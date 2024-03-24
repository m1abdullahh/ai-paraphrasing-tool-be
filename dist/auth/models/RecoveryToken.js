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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecoveryTokenSchema = exports.RecoveryToken = exports.TokenStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
var TokenStatus;
(function (TokenStatus) {
    TokenStatus["FRESH"] = "FRESH";
    TokenStatus["CODE_GENERATED"] = "CODE_GENERATED";
    TokenStatus["EXPIRED"] = "EXPIRED";
})(TokenStatus || (exports.TokenStatus = TokenStatus = {}));
let RecoveryToken = class RecoveryToken {
};
exports.RecoveryToken = RecoveryToken;
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], RecoveryToken.prototype, "token", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], RecoveryToken.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: false }),
    __metadata("design:type", String)
], RecoveryToken.prototype, "code", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], RecoveryToken.prototype, "status", void 0);
exports.RecoveryToken = RecoveryToken = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], RecoveryToken);
exports.RecoveryTokenSchema = mongoose_1.SchemaFactory.createForClass(RecoveryToken);
//# sourceMappingURL=RecoveryToken.js.map