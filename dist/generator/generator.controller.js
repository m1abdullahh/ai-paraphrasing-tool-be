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
const types_1 = require("../types");
const rxjs_1 = require("rxjs");
const prompt_service_1 = require("../prompt/prompt.service");
const auth_service_1 = require("../auth/services/auth.service");
let GeneratorController = class GeneratorController {
    constructor(generatorService, responseMappings, promptService, authService) {
        this.generatorService = generatorService;
        this.responseMappings = responseMappings;
        this.promptService = promptService;
        this.authService = authService;
    }
    async handleGetCompletion(prompt, req, res) {
        if (req.user.promptCredits < 10) {
            throw new types_1.TooManyRequestsException();
        }
        try {
            const { jobDescription, name, experience, additionalPrompt } = prompt;
            const AIPrompt = (0, utils_1.generateProposalPrompt)(jobDescription, name, experience, additionalPrompt);
            const completion = await this.generatorService.getCompletion(AIPrompt, req.user.id, jobDescription, prompt.model);
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');
            const responseObservable = (0, rxjs_1.from)(completion);
            let completeRes = '';
            responseObservable.subscribe({
                next(value) {
                    switch (prompt.model) {
                        case types_1.GeneratorModel.CLAUDE_3:
                            if (value.type.startsWith('content_block_delta')) {
                                res.write(value.delta.text);
                                completeRes = completeRes + value.delta.text;
                            }
                            break;
                        case types_1.GeneratorModel.GPT_4:
                            if (value.choices.length && value.choices[0]?.delta?.content) {
                                res.write(value.choices[0]?.delta?.content);
                                completeRes = completeRes + value.choices[0]?.delta?.content;
                            }
                    }
                },
                complete: () => {
                    res.end();
                    const wordCount = (0, utils_1.countWords)(completeRes);
                    const generationCost = ~~(wordCount / types_1.WORDS_PER_CREDIT);
                    Promise.all([
                        this.promptService.addPrompt({
                            prompt: prompt.jobDescription,
                            completion: completeRes,
                            user: req.user.id,
                            model: prompt.model,
                            cost: generationCost,
                        }),
                        this.authService.changeCredits(req.user.id, -generationCost),
                    ]);
                },
            });
        }
        catch (e) {
            return this.responseMappings.getErrorResponse(e.message || 'Something went wrong.');
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
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [generator_dto_1.GetCompletionDTO, Object, Object]),
    __metadata("design:returntype", Promise)
], GeneratorController.prototype, "handleGetCompletion", null);
exports.GeneratorController = GeneratorController = __decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiTags)('Generator'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Controller)('generator'),
    __metadata("design:paramtypes", [generator_service_1.GeneratorService,
        ResponseMappings_1.ResponseMappings,
        prompt_service_1.PromptService,
        auth_service_1.AuthService])
], GeneratorController);
//# sourceMappingURL=generator.controller.js.map