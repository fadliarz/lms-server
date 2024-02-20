"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const processBoolean_1 = __importDefault(require("./processBoolean"));
describe("processBoolean", () => {
    it("", () => {
        const value = "true";
        const expected = true;
        const actual = (0, processBoolean_1.default)(value);
        expect(expected).toBe(actual);
    });
    it("", () => {
        const value = "tRuE";
        const expected = true;
        const actual = (0, processBoolean_1.default)(value);
        expect(expected).toBe(actual);
    });
    it("", () => {
        const value = "false";
        const expected = false;
        const actual = (0, processBoolean_1.default)(value);
        expect(expected).toBe(actual);
    });
    it("", () => {
        const value = "fAlsE";
        const expected = false;
        const actual = (0, processBoolean_1.default)(value);
        expect(expected).toBe(actual);
    });
    it("", () => {
        const value = "ranDomStriNg";
        const expected = false;
        const actual = (0, processBoolean_1.default)(value);
        expect(expected).toBe(actual);
    });
    it("", () => {
        const value = undefined;
        const expected = false;
        const actual = (0, processBoolean_1.default)(value);
        expect(expected).toBe(actual);
    });
});
