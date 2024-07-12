"use strict";
// import { IUserService } from "./user.service";
// import dIContainer from "../../../inversifyConfig";
// import { UserDITypes } from "../user.type";
// import { IUserRepository, UserRepository } from "../repository/user.repository";
// import RecordNotFoundException from "../../../common/class/exceptions/RecordNotFoundException";
// import { Request, Response } from "express";
// import AuthenticationException from "../../../common/class/exceptions/AuthenticationException";
// import ClientException from "../../../common/class/exceptions/ClientException";
// import sha256Encrypt from "../../../utils/encrypt";
//
// const mockCreateUser = jest.fn();
// const mockGetUserById = jest.fn();
// const mockGetUserByIdOrThrow = jest.fn();
// const mockGetUserByEmail = jest.fn();
// const mockGetUserByAccessToken = jest.fn();
// const mockGetUserByRefreshToken = jest.fn();
// const mockGetMe = jest.fn();
// const mockUpdateUser = jest.fn();
// const mockUnauthorizedUpdateUser = jest.fn();
// const mockDeleteUser = jest.fn();
//
// describe("UserService Test Suites", () => {
//   let sut: IUserService;
//
//   beforeAll(() => {
//     dIContainer.unbind(UserDITypes.REPOSITORY);
//     dIContainer.bind<IUserRepository>(UserDITypes.REPOSITORY).toConstantValue({
//       createUser: mockCreateUser,
//       getUserById: mockGetUserById,
//       getUserByIdOrThrow: mockGetUserByIdOrThrow,
//       getUserByEmail: mockGetUserByEmail,
//       getUserByAccessToken: mockGetUserByAccessToken,
//       getUserByRefreshToken: mockGetUserByRefreshToken,
//       getMe: mockGetMe,
//       updateUser: mockUpdateUser,
//       unauthorizedUpdateUser: mockUnauthorizedUpdateUser,
//       deleteUser: mockDeleteUser,
//     });
//   });
//
//   afterAll(() => {
//     dIContainer.unbind(UserDITypes.REPOSITORY);
//     dIContainer
//       .bind<IUserRepository>(UserDITypes.REPOSITORY)
//       .to(UserRepository);
//   });
//
//   beforeEach(() => {
//     sut = dIContainer.get<IUserService>(UserDITypes.SERVICE);
//   });
//
//   afterEach(() => {
//     jest.clearAllMocks();
//   });
//
//   describe("createUser", () => {
//     it("should create a new user", async () => {
//       const dto = { id: 1 } as any;
//       mockGetUserByEmail.mockResolvedValue(null);
//       mockCreateUser.mockResolvedValue(dto);
//
//       //
//
//       const result = await sut.createUser(dto);
//
//       //
//
//       expect(result).toEqual(dto);
//     });
//
//     it("should throw an error if user with given email already exists", async () => {
//       const dto = { id: 1 } as any;
//       mockGetUserByEmail.mockResolvedValue({ id: 1 });
//
//       //
//
//       await expect(sut.createUser(dto)).rejects.toThrowError();
//     });
//   });
//
//   describe("getPublicUserById", () => {
//     it("should return public user details when user exists", async () => {
//       const user = { id: 1 };
//       mockGetUserById.mockResolvedValue(user);
//
//       //
//
//       const result = await sut.getPublicUserById(user.id);
//
//       //
//
//       expect(result).toEqual(user);
//     });
//
//     it("should throw RecordNotFoundException when user does not exist", async () => {
//       mockGetUserById.mockResolvedValue(null);
//
//       //
//
//       await expect(sut.getPublicUserById(1)).rejects.toThrowError(
//         RecordNotFoundException,
//       );
//     });
//   });
//
//   describe("getMe", () => {
//     it("should return user details", async () => {
//       const user = { id: 1 };
//       mockGetMe.mockResolvedValue(user);
//
//       //
//
//       const result = await sut.getMe(user.id, user.id + 1);
//
//       //
//
//       expect(result).toEqual(user);
//     });
//   });
//
//   describe("updateBasicUser", () => {
//     it("should update basic user details", async () => {
//       const dto = { id: 1 } as any;
//       mockUpdateUser.mockResolvedValue(dto);
//
//       //
//
//       const result = await sut.updateBasicUser(1, 1, dto);
//
//       //
//
//       expect(result).toEqual(dto);
//     });
//   });
//
//   describe("updateUserEmail", () => {
//     it("should update user email", async () => {
//       const updatedUser = { id: 1 } as any;
//       mockUpdateUser.mockResolvedValue(updatedUser);
//
//       //
//
//       const result = await sut.updateUserEmail(1, 1, "", "" as any);
//
//       //
//
//       expect(result).toEqual(updatedUser);
//     });
//   });
//
//   describe("updateUserPassword", () => {
//     it("should update user password", async () => {
//       const updatedUser = { id: 1 } as any;
//       mockUpdateUser.mockResolvedValue(updatedUser);
//
//       //
//
//       const result = await sut.updateUserPassword(1, 1, "", "" as any);
//
//       //
//
//       expect(result).toEqual(updatedUser);
//     });
//   });
//
//   describe("updateUserPhoneNumber", () => {
//     it("should update user phone number", async () => {
//       const updatedUser = { id: 1 } as any;
//       mockUpdateUser.mockResolvedValue(updatedUser);
//
//       //
//
//       const result = await sut.updateUserPhoneNumber(1, 1, "" as any);
//
//       //
//
//       expect(result).toEqual(updatedUser);
//     });
//   });
//
//   describe("deleteUser", () => {
//     it("should delete user", async () => {
//       const deletedUser = { id: 1 };
//       mockDeleteUser.mockResolvedValue(deletedUser);
//
//       //
//
//       const result = await sut.deleteUser(1, 1);
//
//       //
//
//       expect(result).toEqual(deletedUser);
//     });
//   });
//
//   describe("signInUser", () => {
//     const mockClearCookie = jest.fn(() => {
//       return res;
//     });
//     const mockCookie = jest.fn(() => {
//       return res;
//     });
//
//     let req: Request;
//     let res: Response;
//
//     beforeEach(() => {
//       req = { cookies: {} } as Request;
//       res = {
//         cookie: mockCookie as any,
//         clearCookie: mockClearCookie as any,
//       } as any as Response;
//     });
//
//     it("should sign in user with correct credentials", async () => {
//       const user = { id: 1, password: "somePassword", refreshToken: [] } as any;
//       mockGetUserByEmail.mockResolvedValue({
//         ...user,
//         password: sha256Encrypt(user.password),
//       });
//
//       //
//
//       const result = await sut.signInUser(req, res, user);
//
//       //
//
//       expect(result).toEqual(expect.objectContaining(user));
//       expect(mockCookie).toHaveBeenCalledTimes(2);
//     });
//
//     it("should throw RecordNotFoundException if user does not exist", async () => {
//       mockGetUserByEmail.mockResolvedValue(null);
//
//       //
//
//       await expect(sut.signInUser(req, res, {} as any)).rejects.toThrowError(
//         RecordNotFoundException,
//       );
//     });
//
//     it("should throw ClientException if password is incorrect", async () => {
//       const user = { id: 1, password: "somePassword" } as any;
//       mockGetUserByEmail.mockResolvedValue({
//         ...user,
//         password: user.password + "rand",
//       });
//
//       //
//
//       await expect(sut.signInUser(req, res, user)).rejects.toThrowError(
//         ClientException,
//       );
//     });
//
//     it("reuse detection", async () => {});
//   });
//
//   describe("signOutUser", () => {
//     it("valid user: should sign out user", async () => {
//       const storedRefreshToken = "someRefreshToken";
//       const otherRefreshTokens = ["RT1", "RT2"];
//       const user = {
//         id: 1,
//         refreshToken: [...otherRefreshTokens, storedRefreshToken],
//       };
//       mockGetUserByRefreshToken.mockResolvedValue(user);
//
//       //
//
//       await sut.signOutUser(storedRefreshToken);
//
//       //
//
//       expect(mockUnauthorizedUpdateUser).toHaveBeenCalledTimes(1);
//       expect(mockUnauthorizedUpdateUser).toHaveBeenCalledWith(user.id, {
//         refreshToken: otherRefreshTokens,
//       });
//     });
//
//     it("user not found: should throw AuthenticationException", async () => {
//       mockGetUserByRefreshToken.mockResolvedValue(null);
//
//       //
//
//       await expect(sut.signOutUser("")).rejects.toThrowError(
//         AuthenticationException,
//       );
//
//       //
//
//       expect(mockUnauthorizedUpdateUser).not.toHaveBeenCalled();
//     });
//   });
// });
