import { inject, injectable } from "inversify";
import { NextFunction, Request, Response } from "express";
import { StatusCode } from "../../../common/constants/statusCode";
import isNaNArray from "../../../common/functions/isNaNArray";
import NaNException from "../../../common/class/exceptions/NaNException";
import validateJoi from "../../../common/functions/validateJoi";
import getRequestUserOrThrowAuthenticationException from "../../../common/functions/getRequestUserOrThrowAuthenticationException";
import getPagingQuery from "../../../common/functions/getPagingQuery";
import {
  ICourseLessonAttachmentController,
  ICourseLessonAttachmentService,
} from "../attachment.interface";
import {
  CourseLessonAttachmentDITypes,
  CourseLessonAttachmentResourceId,
} from "../attachment.type";
import {
  CreateCourseLessonAttachmentDtoJoi,
  GetCourseLessonAttachmentsQueryJoi,
  UpdateCourseLessonAttachmentDtoJoi,
} from "./attachment.joi";

@injectable()
export default class CourseLessonAttachmentController
  implements ICourseLessonAttachmentController
{
  @inject(CourseLessonAttachmentDITypes.SERVICE)
  service: ICourseLessonAttachmentService;

  public async createAttachment(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      await validateJoi({ body: CreateCourseLessonAttachmentDtoJoi })(
        req,
        res,
        next,
      );

      const newAttachment = await this.service.createAttachment(
        getRequestUserOrThrowAuthenticationException(req),
        { resourceId: this.validateResourceId(req) },
        req.body,
      );

      return res
        .status(StatusCode.RESOURCE_CREATED)
        .json({ data: newAttachment });
    } catch (error) {
      next(error);
    }
  }

  public async getAttachments(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      await validateJoi({ query: GetCourseLessonAttachmentsQueryJoi })(
        req,
        res,
        next,
      );

      const attachments = await this.service.getAttachments(
        getRequestUserOrThrowAuthenticationException(req),
        { resourceId: this.validateResourceId(req) },
        getPagingQuery(req.query),
      );

      return res.status(StatusCode.SUCCESS).json({ data: attachments });
    } catch (error) {
      next(error);
    }
  }

  public async getAttachmentById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const attachment = await this.service.getAttachmentById(
        getRequestUserOrThrowAuthenticationException(req),
        {
          attachmentId: this.validateAttachmentId(req),
          resourceId: this.validateResourceId(req),
        },
      );

      return res.status(StatusCode.SUCCESS).json({ data: attachment });
    } catch (error) {
      next(error);
    }
  }

  public async updateAttachment(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      await validateJoi({ body: UpdateCourseLessonAttachmentDtoJoi })(
        req,
        res,
        next,
      );

      const updatedAttachment = await this.service.updateAttachment(
        getRequestUserOrThrowAuthenticationException(req),
        {
          attachmentId: this.validateAttachmentId(req),
          resourceId: this.validateResourceId(req),
        },
        req.body,
      );

      return res.status(StatusCode.SUCCESS).json({ data: updatedAttachment });
    } catch (error) {
      next(error);
    }
  }

  public async deleteAttachment(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      await this.service.deleteAttachment(
        getRequestUserOrThrowAuthenticationException(req),
        {
          attachmentId: this.validateAttachmentId(req),
          resourceId: this.validateResourceId(req),
        },
      );

      return res.status(StatusCode.SUCCESS).json({ data: {} });
    } catch (error) {
      next(error);
    }
  }

  private validateResourceId(req: Request): CourseLessonAttachmentResourceId {
    const courseId: number = Number(req.params.courseId);
    const lessonId: number = Number(req.params.lessonId);
    if (isNaNArray([courseId, lessonId])) {
      throw new NaNException("courseId || lessonId");
    }

    return {
      courseId,
      lessonId,
    };
  }

  private validateAttachmentId(req: Request): number {
    const attachmentId: number = Number(req.params.attachmentId);
    if (isNaN(attachmentId)) {
      throw new NaNException("attachmentId");
    }

    return attachmentId;
  }
}
