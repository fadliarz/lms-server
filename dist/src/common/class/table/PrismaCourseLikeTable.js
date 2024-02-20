"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
require("reflect-metadata");
const inversify_1 = require("inversify");
const PrismaClientSingleton_1 = __importDefault(require("../PrismaClientSingleton"));
const getValuable_1 = __importDefault(require("../../functions/getValuable"));
const RecordNotFoundException_1 = __importDefault(require("../exceptions/RecordNotFoundException"));
let PrismaCourseLikeTable = class PrismaCourseLikeTable {
    constructor() {
        this.prisma = PrismaClientSingleton_1.default.getInstance();
    }
    findUnique(likeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const like = yield this.prisma.courseLessonVideo.findUnique({
                where: {
                    id: likeId,
                },
            });
            return like ? (0, getValuable_1.default)(like) : like;
        });
    }
    findUniqueOrThrow(likeId, errorObject) {
        return __awaiter(this, void 0, void 0, function* () {
            const like = yield this.findUnique(likeId);
            if (!like) {
                throw errorObject || new RecordNotFoundException_1.default();
            }
            return (0, getValuable_1.default)(like);
        });
    }
};
PrismaCourseLikeTable = __decorate([
    (0, inversify_1.injectable)()
], PrismaCourseLikeTable);
exports.default = PrismaCourseLikeTable;
