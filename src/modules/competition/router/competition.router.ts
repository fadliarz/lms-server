import express from "express";
import dIContainer from "../../../inversifyConfig";
import { ICompetitionController } from "../competition.interface";
import { $CompetitionAPI, CompetitionDITypes } from "../competition.type";

export default function CompetitionRouter(authenticationMiddleware: any) {
  const router = express.Router();

  const controller = dIContainer.get<ICompetitionController>(
    CompetitionDITypes.CONTROLLER,
  );

  /**
   * Create
   *
   */

  router.post(
    $CompetitionAPI.CreateCompetition.endpoint,
    authenticationMiddleware,
    controller.createCompetition.bind(controller),
  );

  /**
   * Get
   *
   */

  router.get(
    $CompetitionAPI.GetCompetitions.endpoint,
    authenticationMiddleware,
    controller.getCompetitions.bind(controller),
  );

  router.get(
    $CompetitionAPI.GetCompetitionById.endpoint,
    authenticationMiddleware,
    controller.getCompetitionById.bind(controller),
  );

  /**
   * Update
   *
   */

  router.patch(
    $CompetitionAPI.UpdateCompetition.endpoint,
    authenticationMiddleware,
    controller.updateCompetition.bind(controller),
  );

  /**
   * Delete
   *
   */

  router.delete(
    $CompetitionAPI.DeleteCompetition.endpoint,
    authenticationMiddleware,
    controller.deleteCompetition.bind(controller),
  );

  return router;
}
