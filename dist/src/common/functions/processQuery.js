"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function processQuery(query) {
    const result = {};
    for (const key in query) {
        if (query.hasOwnProperty(key)) {
            const value = query[key];
            result[key] = value ? /true/i.test(value) : false;
        }
    }
    return result;
}
exports.default = processQuery;
