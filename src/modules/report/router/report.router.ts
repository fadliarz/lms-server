import express from "express";
import dIContainer from "../../../inversifyConfig";
import { IReportController } from "../report.interface";
import { $ReportAPI, ReportDITypes } from "../report.type";

export default function ReportRouter(authenticationMiddleware: any) {
  const router = express.Router();

  const controller = dIContainer.get<IReportController>(
    ReportDITypes.CONTROLLER,
  );

  /**
   * Get
   *
   */

  router.get(
    $ReportAPI.GetReports.endpoint,
    authenticationMiddleware,
    controller.getReports.bind(controller),
  );

  router.get(
    $ReportAPI.GetReportById.endpoint,
    authenticationMiddleware,
    controller.getReportById.bind(controller),
  );

  /**
   * Update
   *
   */

  router.patch(
    $ReportAPI.UpdateReport.endpoint,
    authenticationMiddleware,
    controller.updateReport.bind(controller),
  );

  return router;
}
