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
const BaseRepository_1 = __importDefault(require("../../../common/class/BaseRepository"));
const RecordNotFoundException_1 = __importDefault(require("../../../common/class/exceptions/RecordNotFoundException"));
let OrderRepository = class OrderRepository extends BaseRepository_1.default {
    constructor() {
        super();
    }
    createOrder(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (id.resourceId) {
                const variant = yield this.db.productVariant.findFirst({
                    where: { id: id.variantId, productId: id.resourceId.productId },
                    select: { id: true },
                });
                if (!variant) {
                    throw new RecordNotFoundException_1.default();
                }
            }
            return this.db.order.create({
                data: Object.assign(Object.assign({}, data), { variantId: id.variantId }),
            });
        });
    }
    getOrders(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.order.findMany({
                where: this.getWhereObjectForFirstLevelOperation(id),
                include: { variant: true },
            });
        });
    }
    getOrderById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.order.findFirst({
                where: this.getWhereObjectForSecondLevelOperation(id),
            });
        });
    }
    getOrderByIdOrThrow(id, error) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = yield this.getOrderById(id);
            if (!order) {
                throw error || new RecordNotFoundException_1.default();
            }
            return order;
        });
    }
    updateOrder(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.order.update({
                where: this.getWhereObjectForSecondLevelOperation(id),
                data,
            });
        });
    }
    deleteOrder(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db.order.delete({
                where: this.getWhereObjectForSecondLevelOperation(id),
                select: { id: true },
            });
            return {};
        });
    }
    getWhereObjectForFirstLevelOperation(id) {
        if (id.resourceId) {
            return {
                variant: {
                    id: id.variantId,
                    productId: id.resourceId.productId,
                },
            };
        }
        return {
            variantId: id.variantId,
        };
    }
    getWhereObjectForSecondLevelOperation(id) {
        if (id.resourceId) {
            return {
                id: id.orderId,
                variant: {
                    id: id.resourceId.variantId,
                    productId: id.resourceId.productId,
                },
            };
        }
        return {
            id: id.orderId,
        };
    }
};
OrderRepository = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], OrderRepository);
exports.default = OrderRepository;
