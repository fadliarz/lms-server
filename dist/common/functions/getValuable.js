"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getValuable = void 0;
function getValuable(obj) {
    return Object.fromEntries(Object.entries(obj).filter(([, v]) => !((typeof v === "string" && !v.length) ||
        v === null ||
        typeof v === "undefined")));
}
exports.getValuable = getValuable;
