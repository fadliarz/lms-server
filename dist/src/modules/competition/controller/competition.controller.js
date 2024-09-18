"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const competition_type_1 = require("../competition.type");
const validateJoi_1 = __importDefault(require("../../../common/functions/validateJoi"));
const getRequestUserOrThrowAuthenticationException_1 = __importDefault(require("../../../common/functions/getRequestUserOrThrowAuthenticationException"));
const statusCode_1 = require("../../../common/constants/statusCode");
const NaNException_1 = __importDefault(require("../../../common/class/exceptions/NaNException"));
const competition_joi_1 = require("./competition.joi");
let CompetitionController = class CompetitionController {
    createCompetition(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, validateJoi_1.default)({ body: competition_joi_1.CreateCompetitionDtoJoi });
                const newCompetition = yield this.service.createCompetition((0, getRequestUserOrThrowAuthenticationException_1.default)(req), req.body);
                return res.status(statusCode_1.StatusCode.RESOURCE_CREATED).json({
                    data: newCompetition,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getCompetitions(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const competitions = yield this.service.getCompetitions();
                return res.status(statusCode_1.StatusCode.SUCCESS).json({
                    data: competitions,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getCompetitionById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const competition = yield this.service.getCompetitionById({
                    competitionId: this.validateCompetitionId(req),
                });
                return res.status(statusCode_1.StatusCode.SUCCESS).json({
                    data: competition,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateCompetition(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, validateJoi_1.default)({
                    body: competition_joi_1.UpdateCompetitionDtoJoi,
                })(req, res, next);
                const updatedCompetition = yield this.service.updateCompetition((0, getRequestUserOrThrowAuthenticationException_1.default)(req), { competitionId: this.validateCompetitionId(req) }, req.body);
                return res.status(statusCode_1.StatusCode.SUCCESS).json({
                    data: updatedCompetition,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    deleteCompetition(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.service.deleteCompetition((0, getRequestUserOrThrowAuthenticationException_1.default)(req), { competitionId: this.validateCompetitionId(req) });
                return res.status(statusCode_1.StatusCode.SUCCESS).json({
                    data: result,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    validateCompetitionId(req) {
        const competitionId = Number(req.params.competitionId);
        if (isNaN(competitionId)) {
            throw new NaNException_1.default("competitionId");
        }
        return competitionId;
    }
};
__decorate([
    (0, inversify_1.inject)(competition_type_1.CompetitionDITypes.SERVICE),
    __metadata("design:type", Object)
], CompetitionController.prototype, "service", void 0);
CompetitionController = __decorate([
    (0, inversify_1.injectable)()
], CompetitionController);
exports.default = CompetitionController;
