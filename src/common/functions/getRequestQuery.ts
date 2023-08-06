import { Request } from "express"

export function getRequestQuery<T>(req: Request) {
  
  return req.query as T
}