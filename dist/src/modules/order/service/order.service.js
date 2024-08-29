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
const order_type_1 = require("../order.type");
const handleRepositoryError_1 = __importDefault(require("../../../common/functions/handleRepositoryError"));
const BaseService_1 = __importDefault(require("../../../common/class/BaseService"));
const prismaDefaultConfig_1 = require("../../../common/constants/prismaDefaultConfig");
const asyncLocalStorage_1 = __importDefault(require("../../../common/asyncLocalStorage"));
const LocalStorageKey_1 = require("../../../common/constants/LocalStorageKey");
const ClientException_1 = __importDefault(require("../../../common/class/exceptions/ClientException"));
const RecordNotFoundException_1 = __importDefault(require("../../../common/class/exceptions/RecordNotFoundException"));
let OrderService = class OrderService extends BaseService_1.default {
    createOrder(user, id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.authorization.authorizeCreateOrder(user, {
                    targetUserId: dto.userId,
                });
                return yield this.transactionManager.initializeTransaction((tx) => __awaiter(this, void 0, void 0, function* () {
                    const variant = yield asyncLocalStorage_1.default.run({ [LocalStorageKey_1.LocalStorageKey.TRANSACTION]: tx }, () => __awaiter(this, void 0, void 0, function* () {
                        return this.globalRepository.productVariant.getVariantByIdOrThrow(id);
                    }));
                    if (variant.stock != null && variant.stock < 1) {
                        throw new ClientException_1.default(order_type_1.OrderErrorMessage.OUT_OF_STOCK);
                    }
                    if (variant.stock != null) {
                        yield asyncLocalStorage_1.default.run({ [LocalStorageKey_1.LocalStorageKey.TRANSACTION]: tx }, () => __awaiter(this, void 0, void 0, function* () {
                            return this.globalRepository.productVariant.updateVariant(id, {
                                stock: variant.stock - 1,
                            });
                        }));
                    }
                    return yield asyncLocalStorage_1.default.run({ [LocalStorageKey_1.LocalStorageKey.TRANSACTION]: tx }, () => __awaiter(this, void 0, void 0, function* () {
                        return this.repository.createOrder(id, dto);
                    }));
                }), prismaDefaultConfig_1.PrismaDefaultTransactionConfigForWrite);
            }
            catch (error) {
                throw (0, handleRepositoryError_1.default)(error);
            }
        });
    }
    getOrders(user, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.authorization.authorizeGetOrders(user);
                return yield this.repository.getOrders(id);
            }
            catch (error) {
                throw (0, handleRepositoryError_1.default)(error);
            }
        });
    }
    getOrderById(user, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const order = yield this.repository.getOrderById(id);
                yield this.authorization.authorizeGetOrderById(user, {
                    userId: order === null ? user.id + 1 : order.userId,
                });
                if (!order) {
                    throw new RecordNotFoundException_1.default();
                }
                return order;
            }
            catch (error) {
                throw (0, handleRepositoryError_1.default)(error);
            }
        });
    }
    updateOrderArrivedStatus(user, id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.authorization.authorizeUpdateOrderArrivedStatus(user);
                if (dto.isArrived) {
                    return yield this.repository.updateOrder(id, {
                        isArrived: true,
                        arrivedAt: new Date(),
                    });
                }
                return yield this.repository.updateOrder(id, {
                    isArrived: false,
                    arrivedAt: null,
                });
            }
            catch (error) {
                throw (0, handleRepositoryError_1.default)(error);
            }
        });
    }
    deleteOrder(user, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const order = yield this.repository.getOrderById(id);
                yield this.authorization.authorizeDeleteOrder(user, order);
                return yield this.repository.deleteOrder({ orderId: id.orderId });
            }
            catch (error) {
                throw (0, handleRepositoryError_1.default)(error);
            }
        });
    }
};
__decorate([
    (0, inversify_1.inject)(order_type_1.OrderDITypes.REPOSITORY),
    __metadata("design:type", Object)
], OrderService.prototype, "repository", void 0);
__decorate([
    (0, inversify_1.inject)(order_type_1.OrderDITypes.AUTHORIZATION),
    __metadata("design:type", Object)
], OrderService.prototype, "authorization", void 0);
OrderService = __decorate([
    (0, inversify_1.injectable)()
], OrderService);
exports.default = OrderService;
