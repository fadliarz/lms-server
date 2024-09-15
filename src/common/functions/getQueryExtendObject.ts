import { PagingQuery } from "../shared.types";

export default function getQueryExtendsObject(
  pagingQuery?: PagingQuery,
): { take: number; skip: number } | {} {
  if (pagingQuery && pagingQuery.pageSize && pagingQuery.pageNumber) {
    return {
      take: pagingQuery.pageSize,
      skip: (pagingQuery.pageNumber - 1) * pagingQuery.pageSize,
    };
  }

  return {};
}
