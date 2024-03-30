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
exports.GetCompletionDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const types_1 = require("../../types");
class GetCompletionDTO {
}
exports.GetCompletionDTO = GetCompletionDTO;
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, required: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(50),
    __metadata("design:type", String)
], GetCompletionDTO.prototype, "jobDescription", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, required: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], GetCompletionDTO.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, required: false }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], GetCompletionDTO.prototype, "experience", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, required: false }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetCompletionDTO.prototype, "additionalPrompt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        required: true,
        enum: types_1.GeneratorModel,
        default: types_1.GeneratorModel.GPT_4,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], GetCompletionDTO.prototype, "model", void 0);
//# sourceMappingURL=generator.dto.js.map