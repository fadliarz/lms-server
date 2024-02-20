"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getValuable(obj) {
    const filterPredicate = ([, v]) => !((typeof v === "string" && !v.length) ||
        v === null ||
        typeof v === "undefined");
    if (Array.isArray(obj)) {
        return obj.map((item) => Object.fromEntries(Object.entries(item).filter(filterPredicate)));
    }
    else {
        return Object.fromEntries(Object.entries(obj).filter(filterPredicate));
    }
}
exports.default = getValuable;
