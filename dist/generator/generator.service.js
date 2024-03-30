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
exports.GeneratorService = void 0;
const sdk_1 = require("@anthropic-ai/sdk");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const auth_service_1 = require("../auth/services/auth.service");
const prompt_service_1 = require("../prompt/prompt.service");
const utils_1 = require("../shared/utils");
const types_1 = require("../types");
const openai_1 = require("@azure/openai");
let GeneratorService = class GeneratorService {
    constructor(configService, promptService, authService) {
        this.configService = configService;
        this.promptService = promptService;
        this.authService = authService;
        this.anthropicAi = new sdk_1.default({
            apiKey: this.configService.get('ANTHROPY_KEY'),
        });
        const credentials = new openai_1.AzureKeyCredential(this.configService.get('GPT4_OPENAPI_KEY'));
        this.openAi = new openai_1.OpenAIClient('https://asjndja2.openai.azure.com/', credentials);
    }
    async getCompletion(content, userId, originalPrompt, service) {
        let returnText;
        if (service === types_1.GeneratorModel.CLAUDE_3) {
            const completion = await this.anthropicAi.messages.create({
                max_tokens: 1024,
                messages: [{ content, role: 'user' }],
                model: 'claude-3-opus-20240229',
            });
            returnText = completion.content[0].text;
            this.promptService.addPrompt({
                prompt: originalPrompt,
                completion: returnText,
                user: userId,
            });
        }
        else {
            const completion = await this.openAi.getChatCompletions('xyz', [
                {
                    role: 'user',
                    content,
                },
            ]);
            returnText = completion.choices[0].message.content;
        }
        const wordCount = (0, utils_1.countWords)(returnText);
        const generationCost = wordCount / types_1.WORDS_PER_CREDIT;
        this.authService.changeCredits(userId, ~~-generationCost);
        return returnText;
    }
};
exports.GeneratorService = GeneratorService;
exports.GeneratorService = GeneratorService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prompt_service_1.PromptService,
        auth_service_1.AuthService])
], GeneratorService);
//# sourceMappingURL=generator.service.js.map