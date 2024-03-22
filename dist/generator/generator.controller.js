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
exports.GeneratorController = void 0;
const common_1 = require("@nestjs/common");
const generator_service_1 = require("./generator.service");
const generator_dto_1 = require("./DTOs/generator.dto");
const ResponseMappings_1 = require("../shared/utils/ResponseMappings");
const swagger_1 = require("@nestjs/swagger");
const utils_1 = require("../shared/utils");
const auth_guard_1 = require("../auth/guards/auth.guard");
let GeneratorController = class GeneratorController {
    constructor(generatorService, responseMappings) {
        this.generatorService = generatorService;
        this.responseMappings = responseMappings;
    }
    async handleGetCompletion(prompt, req) {
        if (req.user.promptCredits < 10) {
            throw new common_1.ImATeapotException('Not enough credits.');
        }
        try {
            const { jobDescription, name, experience, additionalPrompt } = prompt;
            const AIPrompt = (0, utils_1.generateProposalPrompt)(jobDescription, name, experience, additionalPrompt);
            const completion = await this.generatorService.getCompletion(AIPrompt, req.user.id);
            return this.responseMappings.getSuccessResponse(completion);
        }
        catch (e) {
            return this.responseMappings.getErrorResponse(e.messages || 'Something went wrong.');
        }
    }
};
exports.GeneratorController = GeneratorController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Get completion',
        description: 'Get chat completion for textual prompts.',
    }),
    (0, common_1.Post)('get-completion'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [generator_dto_1.GetCompletionDTO, Object]),
    __metadata("design:returntype", Promise)
], GeneratorController.prototype, "handleGetCompletion", null);
exports.GeneratorController = GeneratorController = __decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiTags)('Generator'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Controller)('generator'),
    __metadata("design:paramtypes", [generator_service_1.GeneratorService,
        ResponseMappings_1.ResponseMappings])
], GeneratorController);
//# sourceMappingURL=generator.controller.js.map