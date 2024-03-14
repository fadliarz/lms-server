"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const filterUserObject_1 = __importDefault(require("./filterUserObject"));
describe("filterUserObject Test Suites", () => {
    it("tc 1", () => {
        const user = {
            id: 1,
            password: "somePassword",
            accessToken: "someToken",
            refreshToken: ["someToken"],
        };
        const expected = {
            id: 1,
        };
        const actual = (0, filterUserObject_1.default)(user);
        expect(expected).toEqual(actual);
    });
});
