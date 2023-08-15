import { Role } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { AuthorizationException } from "../exceptions/AuthorizationException";
import { getRequestUserOrThrowAuthenticationException } from "../functions/getRequestUserOrThrowAuthenticationException";

export abstract class AuthorizationMiddleware {}
