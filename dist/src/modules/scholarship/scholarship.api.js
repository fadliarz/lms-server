"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$ScholarshipAPI = void 0;
var $ScholarshipAPI;
(function ($ScholarshipAPI) {
    const root = "/scholarships";
    const scholarship = "root" + "/:scholarshipId";
    let CreateScholarship;
    (function (CreateScholarship) {
        CreateScholarship.endpoint = root;
        CreateScholarship.generateUrl = () => {
            return CreateScholarship.endpoint;
        };
    })(CreateScholarship = $ScholarshipAPI.CreateScholarship || ($ScholarshipAPI.CreateScholarship = {}));
    let GetScholarships;
    (function (GetScholarships) {
        GetScholarships.endpoint = root;
        GetScholarships.generateUrl = () => {
            return GetScholarships.endpoint;
        };
    })(GetScholarships = $ScholarshipAPI.GetScholarships || ($ScholarshipAPI.GetScholarships = {}));
    let GetScholarshipById;
    (function (GetScholarshipById) {
        GetScholarshipById.endpoint = scholarship;
        GetScholarshipById.generateUrl = (scholarshipId) => `/scholarships/${scholarshipId}`;
    })(GetScholarshipById = $ScholarshipAPI.GetScholarshipById || ($ScholarshipAPI.GetScholarshipById = {}));
    let UpdateScholarship;
    (function (UpdateScholarship) {
        UpdateScholarship.endpoint = scholarship;
        UpdateScholarship.generateUrl = (scholarshipId) => `/scholarships/${scholarshipId}`;
    })(UpdateScholarship = $ScholarshipAPI.UpdateScholarship || ($ScholarshipAPI.UpdateScholarship = {}));
    let DeleteScholarship;
    (function (DeleteScholarship) {
        DeleteScholarship.endpoint = scholarship;
        DeleteScholarship.generateUrl = (scholarshipId) => `/scholarships/${scholarshipId}`;
    })(DeleteScholarship = $ScholarshipAPI.DeleteScholarship || ($ScholarshipAPI.DeleteScholarship = {}));
})($ScholarshipAPI || (exports.$ScholarshipAPI = $ScholarshipAPI = {}));
