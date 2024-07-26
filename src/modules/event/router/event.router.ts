import express from "express";
import dIContainer from "../../../inversifyConfig";
import { EventDITypes, eventUrls, IEventController } from "../event.type";

export default function EventRouter(authenticationMiddleware: any) {
  const router = express.Router();

  const controller = dIContainer.get<IEventController>(EventDITypes.CONTROLLER);

  /**
   * Create
   *
   */
  router.post(
    "/",
    authenticationMiddleware,
    controller.create.bind(controller),
  );

  /**
   * Get
   *
   */
  router.get(
    "/",
    authenticationMiddleware,
    controller.getMany.bind(controller),
  );

  router.get(
    eventUrls.event,
    authenticationMiddleware,
    controller.getById.bind(controller),
  );

  /**
   * Update
   *
   */
  router.patch(
    eventUrls.event,
    authenticationMiddleware,
    controller.update.bind(controller),
  );

  /**
   * Delete
   *
   */
  router.delete(
    eventUrls.event,
    authenticationMiddleware,
    controller.delete.bind(controller),
  );
}
