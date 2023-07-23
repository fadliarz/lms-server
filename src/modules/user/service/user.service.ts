import jwt from "jsonwebtoken";
import { isEqual } from "lodash";
import sha256Encrypt from "../../../utils/encrypt";
import { PublicUser, SignUpDto } from "../user.type";
import { IUserRepository } from "../repository/user.repository";
import { injectable, inject } from "inversify";
import { UserDITypes } from "../user.type";
import HttpException from "../../../common/exceptions/HttpException";
import { StatusCode } from "../../../common/constants/statusCode";
import { getValuable } from "../../../common/functions/getValuable";

export interface IUserService {
  createNewUserAndGenerateAuthenticationToken: (
    userDetails: SignUpDto
  ) => Promise<PublicUser>;
  signInUser: (email: string, password: string) => Promise<PublicUser>;
  clearUserAuthenticationToken: (userId: string) => Promise<void>;
}

@injectable()
export class UserService implements IUserService {
  @inject(UserDITypes.USER_REPOSITORY)
  private userRepository: IUserRepository;

  private generateFreshAuthenticationToken(
    type: "accessToken" | "refreshToken",
    email: string
  ): string {
    try {
      var privateKey = process.env.ACCESS_TOKEN_PRIVATE_KEY;

      if (type === "refreshToken") {
        privateKey = process.env.REFRESH_TOKEN_PRIVATE_KEY;
      }

      return jwt.sign({ email }, privateKey as string, {
        expiresIn: Math.floor(Date.now()) + 1000 * 60 * 60 * 24 * 30, // 30 Days
      });
    } catch (error) {
      throw error;
    }
  }

  private verifyPassword(
    incomingPassword: string,
    encryptedPassword: string
  ): boolean {
    try {
      return isEqual(sha256Encrypt(incomingPassword), encryptedPassword);
    } catch (error) {
      throw error;
    }
  }

  public async createNewUserAndGenerateAuthenticationToken(
    userDetails: SignUpDto
  ): Promise<PublicUser> {
    try {
      const { email } = userDetails;

      const userBelongToSignUpEmail = await this.userRepository.getUserByEmail(
        email
      );

      if (userBelongToSignUpEmail) {
        throw new HttpException(
          StatusCode.BAD_REQUEST,
          "Email is taken, please try another email!"
        );
      }

      const accessToken = this.generateFreshAuthenticationToken(
        "accessToken",
        email
      );

      const refreshToken = this.generateFreshAuthenticationToken(
        "refreshToken",
        email
      );

      const encryptedPassword = sha256Encrypt(userDetails.password);

      userDetails.password = encryptedPassword;

      const newUserDetails = await this.userRepository.createNewUser({
        ...userDetails,
        accessToken,
        refreshToken,
      });

      return getValuable(newUserDetails);
    } catch (error) {
      throw error;
    }
  }

  public async signInUser(
    email: string,
    password: string
  ): Promise<PublicUser> {
    try {
      const userBelongToSignInEmail = await this.userRepository.getUserByEmail(
        email
      );

      if (!userBelongToSignInEmail) {
        throw new HttpException(StatusCode.NOT_FOUND, "User not found!");
      }

      const isPasswordMatch = this.verifyPassword(
        password,
        userBelongToSignInEmail.password
      );

      if (!isPasswordMatch) {
        throw new HttpException(StatusCode.BAD_REQUEST, "Invalid password!");
      }

      const accessToken = this.generateFreshAuthenticationToken(
        "accessToken",
        email
      );
      const refreshToken = this.generateFreshAuthenticationToken(
        "refreshToken",
        email
      );

      const user = {
        ...userBelongToSignInEmail,
        accessToken,
        refreshToken,
      };

      await this.userRepository.updateExistingUserDetails(user.id, {
        accessToken,
        refreshToken,
      });

      return getValuable(user);
    } catch (error) {
      throw error;
    }
  }

  public async clearUserAuthenticationToken(userId: string) {
    try {
      await this.userRepository.updateExistingUserDetails(userId, {
        accessToken: "",
      });
    } catch (error) {
      throw error;
    }
  }
}
