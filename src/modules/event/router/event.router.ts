import express from "express";
import dIContainer from "../../../inversifyConfig";
import { $EventAPI, EventDITypes } from "../event.type";
import { IEventController } from "../event.interface";

export default function EventRouter(authenticationMiddleware: any) {
  const router = express.Router();

  const controller = dIContainer.get<IEventController>(EventDITypes.CONTROLLER);

  /**
   * Create
   *
   */

  router.post(
    $EventAPI.CreateEvent.endpoint,
    authenticationMiddleware,
    controller.createEvent.bind(controller),
  );

  /**
   * Get
   *
   */

  router.get(
    $EventAPI.GetEvents.endpoint,
    authenticationMiddleware,
    controller.getEvents.bind(controller),
  );

  router.get(
    $EventAPI.GetEventById.endpoint,
    authenticationMiddleware,
    controller.getEventById.bind(controller),
  );

  /**
   * Update
   *
   */

  router.patch(
    $EventAPI.UpdateEvent.endpoint,
    authenticationMiddleware,
    controller.updateEvent.bind(controller),
  );

  /**
   * Delete
   *
   */

  router.delete(
    $EventAPI.DeleteEvent.endpoint,
    authenticationMiddleware,
    controller.deleteEvent.bind(controller),
  );

  return router;
}
