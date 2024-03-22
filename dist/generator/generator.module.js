"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneratorModule = void 0;
const common_1 = require("@nestjs/common");
const generator_service_1 = require("./generator.service");
const generator_controller_1 = require("./generator.controller");
const auth_service_1 = require("../auth/services/auth.service");
const mongoose_1 = require("@nestjs/mongoose");
const User_1 = require("../auth/models/User");
const ResponseMappings_1 = require("../shared/utils/ResponseMappings");
const prompt_module_1 = require("../prompt/prompt.module");
const prompt_service_1 = require("../prompt/prompt.service");
const prompt_1 = require("../prompt/models/prompt");
let GeneratorModule = class GeneratorModule {
};
exports.GeneratorModule = GeneratorModule;
exports.GeneratorModule = GeneratorModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                {
                    name: User_1.User.name,
                    schema: User_1.UserSchema,
                    collection: 'Users',
                },
                {
                    name: prompt_1.Prompt.name,
                    schema: prompt_1.PromptSchema,
                    collection: 'Prompts',
                },
            ]),
            prompt_module_1.PromptModule,
        ],
        providers: [generator_service_1.GeneratorService, auth_service_1.AuthService, ResponseMappings_1.ResponseMappings, prompt_service_1.PromptService],
        controllers: [generator_controller_1.GeneratorController],
    })
], GeneratorModule);
//# sourceMappingURL=generator.module.js.map