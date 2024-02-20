"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function processBoolean(value) {
    return value ? /true/i.test(value) : false;
}
exports.default = processBoolean;
