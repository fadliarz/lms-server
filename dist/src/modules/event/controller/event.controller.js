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
const event_type_1 = require("../event.type");
const validateJoi_1 = __importDefault(require("../../../common/functions/validateJoi"));
const statusCode_1 = require("../../../common/constants/statusCode");
const event_joi_1 = require("./event.joi");
const getRequestUserOrThrowAuthenticationException_1 = __importDefault(require("../../../common/functions/getRequestUserOrThrowAuthenticationException"));
const NaNException_1 = __importDefault(require("../../../common/class/exceptions/NaNException"));
let EventController = class EventController {
    create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, validateJoi_1.default)({ body: event_joi_1.CreateEventDtoJoi })(req, res, next);
                const resourceId = this.validateResourceId(req);
                const newEvent = yield this.service.create(resourceId, req.body);
                return res.status(statusCode_1.StatusCode.RESOURCE_CREATED).json({ data: newEvent });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const eventId = this.validateEventId(req);
                const resourceId = this.validateResourceId(req);
                const event = yield this.service.getById(eventId, resourceId);
                res.status(statusCode_1.StatusCode.SUCCESS).json({ data: event });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getMany(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const eventId = this.validateEventId(req);
                const resourceId = this.validateResourceId(req);
                const events = yield this.service.getById(eventId, resourceId);
                return res.status(statusCode_1.StatusCode.SUCCESS).json({ data: events });
            }
            catch (error) {
                next(error);
            }
        });
    }
    update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, validateJoi_1.default)({ body: event_joi_1.UpdateEventDtoJoi })(req, res, next);
                const eventId = this.validateEventId(req);
                const resourceId = this.validateResourceId(req);
                const updatedEvent = yield this.service.update(eventId, resourceId, req.body);
                return res.status(statusCode_1.StatusCode.SUCCESS).json({ data: updatedEvent });
            }
            catch (error) {
                next(error);
            }
        });
    }
    delete(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const eventId = this.validateEventId(req);
                const resourceId = this.validateResourceId(req);
                yield this.service.delete(eventId, resourceId);
                return res.status(statusCode_1.StatusCode.SUCCESS).json({ data: {} });
            }
            catch (error) {
                next(error);
            }
        });
    }
    validateResourceId(req, error) {
        const { id: userId, role } = (0, getRequestUserOrThrowAuthenticationException_1.default)(req);
        return {
            user: {
                id: userId,
                role,
            },
        };
    }
    validateEventId(req) {
        const eventId = Number(req.params.eventId);
        if (isNaN(eventId)) {
            throw new NaNException_1.default("eventId");
        }
        return eventId;
    }
};
__decorate([
    (0, inversify_1.inject)(event_type_1.EventDITypes.SERVICE),
    __metadata("design:type", Object)
], EventController.prototype, "service", void 0);
EventController = __decorate([
    (0, inversify_1.injectable)()
], EventController);
exports.default = EventController;
