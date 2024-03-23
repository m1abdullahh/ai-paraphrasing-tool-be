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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromptController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_guard_1 = require("../auth/guards/auth.guard");
const prompt_service_1 = require("./prompt.service");
let PromptController = class PromptController {
    constructor(promptService) {
        this.promptService = promptService;
    }
    async getUserPrompts(req) {
        try {
            const prompts = await this.promptService.getPromptsByUserId(req.user.id);
            return prompts;
        }
        catch (e) {
            throw new common_1.HttpException(e.message, 500);
        }
    }
};
exports.PromptController = PromptController;
__decorate([
    (0, common_1.Get)('my-prompts'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get prompts',
        description: "Get current user's prompts.",
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PromptController.prototype, "getUserPrompts", null);
exports.PromptController = PromptController = __decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiTags)('Prompts'),
    (0, common_1.Controller)('prompts'),
    __metadata("design:paramtypes", [prompt_service_1.PromptService])
], PromptController);
//# sourceMappingURL=prompt.controller.js.map