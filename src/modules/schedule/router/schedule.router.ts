import express from "express";
import dIContainer from "../../../inversifyConfig";
import { ICourseScheduleController } from "../schedule.interface";
import { CourseScheduleDITypes } from "../schedule.type";
import { $CourseScheduleAPI } from "../schedule.api";

export default function CourseScheduleRouter(authenticationMiddleware: any) {
  const router = express.Router();

  const controller = dIContainer.get<ICourseScheduleController>(
    CourseScheduleDITypes.CONTROLLER,
  );

  /**
   * Create
   *
   */

  router.post(
    $CourseScheduleAPI.CreateSchedule.endpoint,
    authenticationMiddleware,
    controller.createSchedule.bind(controller),
  );

  /**
   * Get
   *
   */

  router.get(
    $CourseScheduleAPI.GetSchedules.endpoint,
    authenticationMiddleware,
    controller.getSchedules.bind(controller),
  );

  router.get(
    $CourseScheduleAPI.GetScheduleById.endpoint,
    authenticationMiddleware,
    controller.getScheduleById.bind(controller),
  );

  /**
   * Update
   *
   */

  router.patch(
    $CourseScheduleAPI.UpdateSchedule.endpoint,
    authenticationMiddleware,
    controller.updateSchedule.bind(controller),
  );

  /**
   * Delete
   *
   */

  router.delete(
    $CourseScheduleAPI.DeleteSchedule.endpoint,
    authenticationMiddleware,
    controller.deleteSchedule.bind(controller),
  );

  return router;
}
