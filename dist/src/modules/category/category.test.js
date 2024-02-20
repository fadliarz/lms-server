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
require("reflect-metadata");
const errorMiddleware_1 = __importDefault(require("../../middlewares/errorMiddleware"));
const inversifyConfig_1 = __importDefault(require("../../inversifyConfig"));
const category_type_1 = require("./category.type");
const category_service_1 = require("./service/category.service");
const statusCode_1 = require("../../common/constants/statusCode");
const errorCode_1 = require("../../common/constants/errorCode");
const RandPrisma_1 = __importDefault(require("../../common/class/randprisma/RandPrisma"));
/**
 *
 * This is an integration test file for:
 * 1. Controller
 * 2. Service
 * 3. Repository
 *
 */
/**
 *
 * @param mockRequest
 * @param mockResponse
 * @param next
 *
 * Mock next() function so it can simulates real wold scenario.
 *
 */
function mockNextError(mockRequest, mockResponse, mockNext) {
    mockNext.mockImplementation((error) => {
        (0, errorMiddleware_1.default)(error, mockRequest, mockResponse, mockNext);
    });
}
describe("CourseCategory", () => {
    let controller;
    let randDb;
    let mockRequest;
    let mockResponse;
    let mockNext;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        controller = inversifyConfig_1.default.get(category_type_1.CourseCategoryDITypes.CONTROLLER);
        randDb = new RandPrisma_1.default();
    }));
    beforeEach(() => {
        mockRequest = {};
        mockResponse = {
            status: jest.fn(() => mockResponse),
            json: jest.fn(),
        };
        mockNext = jest.fn();
    });
    afterEach(() => {
        jest.resetAllMocks();
    });
    describe("CreateCategory", () => {
        const testCases = [
            {
                name: "OK: Complete Dto",
                modifyDto: (dto) => {
                    return Object.assign({}, dto);
                },
                test: (params) => __awaiter(void 0, void 0, void 0, function* () {
                    const { mockRequest, mockResponse, mockNext } = params;
                    const spyOnCreateCategoryService = jest.spyOn(category_service_1.CourseCategoryService.prototype, "createCategory");
                    yield controller.createCategory(mockRequest, mockResponse, mockNext);
                    expect(spyOnCreateCategoryService).toHaveBeenCalledTimes(1);
                    expect(spyOnCreateCategoryService).toHaveBeenCalledWith(mockRequest.body);
                    const newCategory = (yield spyOnCreateCategoryService.mock.results[0]
                        .value);
                    expect(mockNext).not.toHaveBeenCalled();
                    expect(mockResponse.status).toHaveBeenCalledTimes(1);
                    expect(mockResponse.status).toHaveBeenCalledWith(statusCode_1.StatusCode.RESOURCE_CREATED);
                    expect(mockResponse.json).toHaveBeenCalledTimes(1);
                    expect(mockResponse.json).toHaveBeenCalledWith({
                        data: newCategory,
                    });
                }),
            },
            {
                name: "BadRequest: Missing title",
                modifyDto: (dto) => {
                    return Object.assign(Object.assign({}, dto), { title: undefined });
                },
                test: (params) => __awaiter(void 0, void 0, void 0, function* () {
                    const { mockRequest, mockResponse, mockNext } = params;
                    mockNextError(mockRequest, mockResponse, mockNext);
                    const spyOnCreateCategoryService = jest.spyOn(category_service_1.CourseCategoryService.prototype, "createCategory");
                    yield controller.createCategory(mockRequest, mockResponse, mockNext);
                    expect(spyOnCreateCategoryService).toHaveBeenCalledTimes(0);
                    expect(mockNext).toHaveBeenCalledTimes(1);
                    expect(mockResponse.status).toHaveBeenCalledTimes(1);
                    expect(mockResponse.status).toHaveBeenCalledWith(statusCode_1.StatusCode.BAD_REQUEST);
                    expect(mockResponse.json).toHaveBeenCalledTimes(1);
                    expect(mockResponse.json).toHaveBeenCalledWith({
                        error: {
                            errorCode: errorCode_1.ErrorCode.INVALID_BODY,
                            message: expect.any(String),
                        },
                    });
                }),
            },
        ];
        testCases.forEach((tc) => __awaiter(void 0, void 0, void 0, function* () {
            return it(tc.name, () => __awaiter(void 0, void 0, void 0, function* () {
                const dto = { title: "someTitle" };
                mockRequest.body = tc.modifyDto(dto);
                yield tc.test({
                    mockRequest,
                    mockResponse,
                    mockNext,
                });
            }));
        }));
    });
});
