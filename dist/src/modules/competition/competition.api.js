"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$CompetitionAPI = void 0;
var $CompetitionAPI;
(function ($CompetitionAPI) {
    const root = "/competitions";
    const competition = root + "/:competitionId";
    let CreateCompetition;
    (function (CreateCompetition) {
        CreateCompetition.endpoint = root;
        CreateCompetition.generateUrl = () => CreateCompetition.endpoint;
    })(CreateCompetition = $CompetitionAPI.CreateCompetition || ($CompetitionAPI.CreateCompetition = {}));
    let GetCompetitions;
    (function (GetCompetitions) {
        GetCompetitions.endpoint = root;
        GetCompetitions.generateUrl = () => GetCompetitions.endpoint;
    })(GetCompetitions = $CompetitionAPI.GetCompetitions || ($CompetitionAPI.GetCompetitions = {}));
    let GetCompetitionById;
    (function (GetCompetitionById) {
        GetCompetitionById.endpoint = competition;
        GetCompetitionById.generateUrl = (competitionId) => `/competitions/${competitionId}`;
    })(GetCompetitionById = $CompetitionAPI.GetCompetitionById || ($CompetitionAPI.GetCompetitionById = {}));
    let UpdateCompetition;
    (function (UpdateCompetition) {
        UpdateCompetition.endpoint = competition;
        UpdateCompetition.generateUrl = (competitionId) => `/competitions/${competitionId}`;
    })(UpdateCompetition = $CompetitionAPI.UpdateCompetition || ($CompetitionAPI.UpdateCompetition = {}));
    let DeleteCompetition;
    (function (DeleteCompetition) {
        DeleteCompetition.endpoint = competition;
        DeleteCompetition.generateUrl = (competitionId) => `/competitions/${competitionId}`;
    })(DeleteCompetition = $CompetitionAPI.DeleteCompetition || ($CompetitionAPI.DeleteCompetition = {}));
})($CompetitionAPI || (exports.$CompetitionAPI = $CompetitionAPI = {}));
