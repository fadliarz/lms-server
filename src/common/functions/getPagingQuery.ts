import { Request } from "express";
import { PagingQuery } from "../shared.types";

export default function getPagingQuery(query: Request["query"]): PagingQuery {
  const pagingQuery: PagingQuery = {};

  if (!isNaN(Number(query.pageSize)))
    pagingQuery.pageSize = Number(query.pageSize);

  if (!isNaN(Number(query.pageNumber)))
    pagingQuery.pageNumber = Number(query.pageNumber);

  return pagingQuery;
}
