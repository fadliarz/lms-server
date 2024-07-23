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
const BaseAuthorization_1 = __importDefault(require("../../../common/class/BaseAuthorization"));
const PrismaClientSingleton_1 = __importDefault(require("../../../common/class/PrismaClientSingleton"));
const class_type_1 = require("../../class/class.type");
const prismaDefaultConfig_1 = require("../../../common/constants/prismaDefaultConfig");
const RecordNotFoundException_1 = __importDefault(require("../../../common/class/exceptions/RecordNotFoundException"));
let EventRepository = class EventRepository extends BaseAuthorization_1.default {
    constructor() {
        super(...arguments);
        this.prisma = PrismaClientSingleton_1.default.getInstance();
    }
    create(resourceId, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                yield this.authorizeUserRole(tx, resourceId, this.authorization.authorizeCreateEvent.bind(this.authorization));
                return yield tx.event.create({
                    data: Object.assign({}, dto),
                });
            }));
        });
    }
    getById(id, resourceId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                return yield tx.event.findUnique({
                    where: {
                        id,
                    },
                });
            }), prismaDefaultConfig_1.PrismaDefaultTransactionConfigForRead);
        });
    }
    getByIdOrThrow(id, resourceId, error) {
        return __awaiter(this, void 0, void 0, function* () {
            const event = yield this.getById(id, resourceId);
            if (!event) {
                throw error || new RecordNotFoundException_1.default();
            }
            return event;
        });
    }
    getMany(resourceId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                return yield tx.event.findMany();
            }), prismaDefaultConfig_1.PrismaDefaultTransactionConfigForRead);
        });
    }
    update(id, resourceId, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                yield this.authorizeUserRole(tx, resourceId, this.authorization.authorizeUpdateEvent.bind(this.authorization));
                return yield tx.event.update({
                    where: {
                        id,
                    },
                    data: dto,
                });
            }), prismaDefaultConfig_1.PrismaDefaultTransactionConfigForWrite);
        });
    }
    delete(id, resourceId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                yield this.authorizeUserRole(tx, resourceId, this.authorization.authorizeDeleteEvent.bind(this.authorization));
                yield tx.event.delete({
                    where: {
                        id,
                    },
                });
            }), prismaDefaultConfig_1.PrismaDefaultTransactionConfigForWrite);
            return {};
        });
    }
};
__decorate([
    (0, inversify_1.inject)(class_type_1.CourseClassDITypes.AUTHORIZATION),
    __metadata("design:type", Object)
], EventRepository.prototype, "authorization", void 0);
EventRepository = __decorate([
    (0, inversify_1.injectable)()
], EventRepository);
exports.default = EventRepository;
