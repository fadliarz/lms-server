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
const variant_type_1 = require("../variant.type");
const handleRepositoryError_1 = __importDefault(require("../../../common/functions/handleRepositoryError"));
const BaseService_1 = __importDefault(require("../../../common/class/BaseService"));
const prismaDefaultConfig_1 = require("../../../common/constants/prismaDefaultConfig");
const asyncLocalStorage_1 = __importDefault(require("../../../common/asyncLocalStorage"));
const LocalStorageKey_1 = require("../../../common/constants/LocalStorageKey");
let ProductVariantService = class ProductVariantService extends BaseService_1.default {
    createVariant(user, id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.authorization.authorizeCreateVariant(user);
                const productSnapshot = yield this.globalRepository.product.getProductByIdOrThrow({
                    productId: id.resourceId.productId,
                });
                return yield this.repository.createVariant({ productId: id.resourceId.productId }, Object.assign(Object.assign({}, dto), { productSnapshot }));
            }
            catch (error) {
                throw (0, handleRepositoryError_1.default)(error);
            }
        });
    }
    getVariants(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.repository.getVariants({
                    productId: id.resourceId.productId,
                });
            }
            catch (error) {
                throw (0, handleRepositoryError_1.default)(error);
            }
        });
    }
    getVariantById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.repository.getVariantByIdOrThrow(id);
            }
            catch (error) {
                throw (0, handleRepositoryError_1.default)(error);
            }
        });
    }
    updateVariant(user, id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.authorization.authorizeUpdateVariant(user);
                return yield this.repository.updateVariant(id, dto);
            }
            catch (error) {
                throw (0, handleRepositoryError_1.default)(error);
            }
        });
    }
    updateVariantStockWithIncrement(user, id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.authorization.authorizeUpdateVariant(user);
                return yield this.transactionManager.initializeTransaction((tx) => __awaiter(this, void 0, void 0, function* () {
                    return yield asyncLocalStorage_1.default.run({ [LocalStorageKey_1.LocalStorageKey.TRANSACTION]: tx }, () => __awaiter(this, void 0, void 0, function* () {
                        return this.repository.updateVariantStockWithIncrement(id, dto);
                    }));
                }), prismaDefaultConfig_1.PrismaDefaultTransactionConfigForWrite);
            }
            catch (error) {
                throw (0, handleRepositoryError_1.default)(error);
            }
        });
    }
    deleteVariant(user, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.authorization.authorizeDeleteVariant(user);
                return yield this.repository.deleteVariant(id);
            }
            catch (error) {
                throw (0, handleRepositoryError_1.default)(error);
            }
        });
    }
};
__decorate([
    (0, inversify_1.inject)(variant_type_1.ProductVariantDITypes.REPOSITORY),
    __metadata("design:type", Object)
], ProductVariantService.prototype, "repository", void 0);
__decorate([
    (0, inversify_1.inject)(variant_type_1.ProductVariantDITypes.AUTHORIZATION),
    __metadata("design:type", Object)
], ProductVariantService.prototype, "authorization", void 0);
ProductVariantService = __decorate([
    (0, inversify_1.injectable)()
], ProductVariantService);
exports.default = ProductVariantService;
