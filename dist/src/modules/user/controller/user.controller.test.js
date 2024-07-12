"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversifyConfig_1 = __importDefault(require("../../../inversifyConfig"));
const user_type_1 = require("../user.type");
const user_service_1 = require("../service/user.service");
const validateJoi_1 = __importDefault(require("../../../common/functions/validateJoi"));
const filterUserObject_1 = __importDefault(require("../../../common/functions/filterUserObject"));
const mockCreateUser = jest.fn();
const mockGetPublicUserById = jest.fn();
const mockGetMe = jest.fn();
const mockUpdateBasicUser = jest.fn();
const mockUpdateUserEmail = jest.fn();
const mockUpdateUserPassword = jest.fn();
const mockUpdateUserPhoneNumber = jest.fn();
const mockDeleteUser = jest.fn();
const mockSignInUser = jest.fn();
const mockSignOutUser = jest.fn();
const mockGenerateFreshAuthenticationToken = jest.fn();
jest.mock("validateJoi");
describe("UserController Test Suites", () => {
    let sut;
    let mockRequest;
    let mockResponse;
    let mockNext;
    beforeAll(() => {
        inversifyConfig_1.default.unbind(user_type_1.UserDITypes.SERVICE);
        inversifyConfig_1.default.bind(user_type_1.UserDITypes.SERVICE).toConstantValue({
            createUser: mockCreateUser,
            getPublicUserById: mockGetPublicUserById,
            getMe: mockGetMe,
            updateBasicUser: mockUpdateBasicUser,
            updateUserEmail: mockUpdateUserEmail,
            updateUserPassword: mockUpdateUserPassword,
            updateUserPhoneNumber: mockUpdateUserPhoneNumber,
            deleteUser: mockDeleteUser,
            signInUser: mockSignInUser,
            signOutUser: mockSignOutUser,
            generateFreshAuthenticationToken: mockGenerateFreshAuthenticationToken,
        });
    });
    afterAll(() => {
        inversifyConfig_1.default.unbind(user_type_1.UserDITypes.SERVICE);
        inversifyConfig_1.default.bind(user_type_1.UserDITypes.SERVICE).to(user_service_1.UserService);
    });
    beforeEach(() => {
        mockRequest = {
            body: {},
            query: {},
        };
        mockResponse = {
            status: jest.fn(() => mockResponse),
            cookie: jest.fn(() => mockResponse),
            json: jest.fn(() => mockResponse),
        };
        mockNext = jest.fn();
        sut = inversifyConfig_1.default.get(user_type_1.UserDITypes.SERVICE);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe("createUser", () => {
        it("should create a new user", () => __awaiter(void 0, void 0, void 0, function* () {
            validateJoi_1.default.mockImplementation(() => { });
            const mockUser = { id: 1 };
            mockCreateUser.mockResolvedValue(mockUser);
            //
            const newUser = yield sut.createUser(mockRequest, mockResponse, mockNext);
            //
            expect(mockCreateUser).toBeCalledTimes(1);
            expect(newUser).toEqual(mockUser);
            expect(mockResponse.cookie).toHaveBeenCalledTimes(2);
            expect(mockResponse.status).toHaveBeenCalledTimes(1);
            expect(mockResponse.json).toHaveBeenCalledTimes(1);
            expect(mockResponse.json).toHaveBeenCalledWith({
                data: (0, filterUserObject_1.default)(mockUser),
            });
        }));
        it("shouldn't create a new user", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockError = new Error();
            validateJoi_1.default.mockRejectedValue(mockError);
            //
            yield sut.createUser(mockRequest, mockResponse, mockNext);
            //
            expect(mockNext).toBeCalledTimes(1);
            expect(mockNext).toBeCalledWith(mockError);
        }));
    });
});
