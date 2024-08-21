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
const BaseAuthorization_1 = __importDefault(require("../../../common/class/BaseAuthorization"));
const handleRepositoryError_1 = __importDefault(require("../../../common/functions/handleRepositoryError"));
let EventService = class EventService extends BaseAuthorization_1.default {
    createEvent(user, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.authorization.authorizeCreateEvent(user);
                return yield this.repository.createEvent(dto);
            }
            catch (error) {
                throw (0, handleRepositoryError_1.default)(error);
            }
        });
    }
    getEvents() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.repository.getEvents();
            }
            catch (error) {
                throw (0, handleRepositoryError_1.default)(error);
            }
        });
    }
    getEventById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.repository.getEventByIdOrThrow(id);
            }
            catch (error) {
                throw (0, handleRepositoryError_1.default)(error);
            }
        });
    }
    updateEvent(user, id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.authorization.authorizeUpdateEvent(user);
                return yield this.repository.updateEvent(id, dto);
            }
            catch (error) {
                throw (0, handleRepositoryError_1.default)(error);
            }
        });
    }
    deleteEvent(user, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.authorization.authorizeDeleteEvent(user);
                return yield this.repository.deleteEvent(id);
            }
            catch (error) {
                throw (0, handleRepositoryError_1.default)(error);
            }
        });
    }
};
__decorate([
    (0, inversify_1.inject)(event_type_1.EventDITypes.REPOSITORY),
    __metadata("design:type", Object)
], EventService.prototype, "repository", void 0);
__decorate([
    (0, inversify_1.inject)(event_type_1.EventDITypes.AUTHORIZATION),
    __metadata("design:type", Object)
], EventService.prototype, "authorization", void 0);
EventService = __decorate([
    (0, inversify_1.injectable)()
], EventService);
exports.default = EventService;
