"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function convertStringToBoolean(text) {
    if (text && text.toLowerCase() === "true") {
        return true;
    }
    return false;
}
exports.default = convertStringToBoolean;
