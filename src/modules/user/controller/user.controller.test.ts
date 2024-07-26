// import { IUserController } from "./user.controller";
// import dIContainer from "../../../inversifyConfig";
// import { UserDITypes, UserModel } from "../user.type";
// import { IUserService, UserService } from "../service/user.service";
// import { NextFunction, Request, Response } from "express";
// import validateJoi from "../../../common/functions/validateJoi";
// import filterUserObject from "../../../common/functions/filterUserObject";
//
// const mockCreateUser = jest.fn();
// const mockGetPublicUserById = jest.fn();
// const mockGetMe = jest.fn();
// const mockUpdateBasicUser = jest.fn();
// const mockUpdateUserEmail = jest.fn();
// const mockUpdateUserPassword = jest.fn();
// const mockUpdateUserPhoneNumber = jest.fn();
// const mockDeleteUser = jest.fn();
// const mockSignInUser = jest.fn();
// const mockSignOutUser = jest.fn();
// const mockGenerateFreshAuthenticationToken = jest.fn();
//
// jest.mock("validateJoi");
//
// describe("UserController Test Suites", () => {
//   let sut: IUserController;
//   let mockRequest: Request;
//   let mockResponse: Response;
//   let mockNext: NextFunction;
//
//   beforeAll(() => {
//     dIContainer.unbind(UserDITypes.SERVICE);
//     dIContainer.bind<IUserService>(UserDITypes.SERVICE).toConstantValue({
//       createUser: mockCreateUser,
//       getPublicUserById: mockGetPublicUserById,
//       getMe: mockGetMe,
//       updateBasicUser: mockUpdateBasicUser,
//       updateUserEmail: mockUpdateUserEmail,
//       updateUserPassword: mockUpdateUserPassword,
//       updateUserPhoneNumber: mockUpdateUserPhoneNumber,
//       deleteUser: mockDeleteUser,
//       signInUser: mockSignInUser,
//       signOutUser: mockSignOutUser,
//       generateFreshAuthenticationToken: mockGenerateFreshAuthenticationToken,
//     });
//   });
//
//   afterAll(() => {
//     dIContainer.unbind(UserDITypes.SERVICE);
//     dIContainer.bind<IUserService>(UserDITypes.SERVICE).to(UserService);
//   });
//
//   beforeEach(() => {
//     mockRequest = {
//       body: {},
//       query: {},
//     } as Request;
//     mockResponse = {
//       status: jest.fn(() => mockResponse),
//       cookie: jest.fn(() => mockResponse),
//       json: jest.fn(() => mockResponse),
//     } as any as Response;
//     mockNext = jest.fn();
//     sut = dIContainer.get<IUserController>(UserDITypes.SERVICE);
//   });
//
//   afterEach(() => {
//     jest.clearAllMocks();
//   });
//
//   describe("createUser", () => {
//     it("should create a new user", async () => {
//       (validateJoi as jest.Mock).mockImplementation(() => {});
//
//       const mockUser = { id: 1 } as UserModel;
//       mockCreateUser.mockResolvedValue(mockUser);
//
//       //
//
//       const newUser = await sut.createUser(mockRequest, mockResponse, mockNext);
//
//       //
//
//       expect(mockCreateUser).toBeCalledTimes(1);
//       expect(newUser).toEqual(mockUser);
//
//       expect(mockResponse.cookie).toHaveBeenCalledTimes(2);
//       expect(mockResponse.status).toHaveBeenCalledTimes(1);
//       expect(mockResponse.json).toHaveBeenCalledTimes(1);
//       expect(mockResponse.json).toHaveBeenCalledWith({
//         data: filterUserObject(mockUser),
//       });
//     });
//
//     it("shouldn't create a new user", async () => {
//       const mockError = new Error();
//       (validateJoi as jest.Mock).mockRejectedValue(mockError);
//
//       //
//
//       await sut.createUser(mockRequest, mockResponse, mockNext);
//
//       //
//
//       expect(mockNext).toBeCalledTimes(1);
//       expect(mockNext).toBeCalledWith(mockError);
//     });
//   });
// });
