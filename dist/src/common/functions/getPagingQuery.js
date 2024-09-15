"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getPagingQuery(query) {
    const pagingQuery = {};
    if (!isNaN(Number(query.pageSize)))
        pagingQuery.pageSize = Number(query.pageSize);
    if (!isNaN(Number(query.pageNumber)))
        pagingQuery.pageNumber = Number(query.pageNumber);
    return pagingQuery;
}
exports.default = getPagingQuery;
