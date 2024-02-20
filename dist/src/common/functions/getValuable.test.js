"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getValuable_1 = __importDefault(require("./getValuable"));
const someObject = {
    name: "Fadli",
};
const someOtherObject = {
    name: null,
};
describe("getValuable Test Suite", () => {
    it("shouldn't modify: no field with value null", () => {
        const actual = (0, getValuable_1.default)(someObject);
        const expected = {
            name: "Fadli",
        };
        expect(actual).toEqual(expected);
    });
    it.only("should change fields with value null to be undefined", () => {
        const actual = (0, getValuable_1.default)(someOtherObject);
        const expected = {};
        expect(actual).toEqual(expected);
    });
    it("shouldn't modify: no field with value null for array", () => {
        const actual = (0, getValuable_1.default)([someObject, someObject]);
        const expected = [
            {
                name: "Fadli",
            },
            {
                name: "Fadli",
            },
        ];
        expect(actual).toEqual(expected);
    });
    it("should change fields with value null to be undefined for array", () => {
        const actual = (0, getValuable_1.default)([someOtherObject, someOtherObject]);
        const expected = [
            {
                name: undefined,
            },
            {
                name: undefined,
            },
        ];
        expect(actual).toEqual(expected);
    });
});
