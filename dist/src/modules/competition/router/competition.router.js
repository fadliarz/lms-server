"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const inversifyConfig_1 = __importDefault(require("../../../inversifyConfig"));
const competition_type_1 = require("../competition.type");
function CompetitionRouter(authenticationMiddleware) {
    const router = express_1.default.Router();
    const controller = inversifyConfig_1.default.get(competition_type_1.CompetitionDITypes.CONTROLLER);
    /**
     * Create
     *
     */
    router.post(competition_type_1.$CompetitionAPI.CreateCompetition.endpoint, authenticationMiddleware, controller.createCompetition.bind(controller));
    /**
     * Get
     *
     */
    router.get(competition_type_1.$CompetitionAPI.GetCompetitions.endpoint, authenticationMiddleware, controller.getCompetitions.bind(controller));
    router.get(competition_type_1.$CompetitionAPI.GetCompetitionById.endpoint, authenticationMiddleware, controller.getCompetitionById.bind(controller));
    /**
     * Update
     *
     */
    router.patch(competition_type_1.$CompetitionAPI.UpdateCompetition.endpoint, authenticationMiddleware, controller.updateCompetition.bind(controller));
    /**
     * Delete
     *
     */
    router.delete(competition_type_1.$CompetitionAPI.DeleteCompetition.endpoint, authenticationMiddleware, controller.deleteCompetition.bind(controller));
    return router;
}
exports.default = CompetitionRouter;
