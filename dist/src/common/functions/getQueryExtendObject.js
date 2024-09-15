"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getQueryExtendsObject(pagingQuery) {
    if (pagingQuery && pagingQuery.pageSize && pagingQuery.pageNumber) {
        return {
            take: pagingQuery.pageSize,
            skip: (pagingQuery.pageNumber - 1) * pagingQuery.pageSize,
        };
    }
    return {};
}
exports.default = getQueryExtendsObject;
