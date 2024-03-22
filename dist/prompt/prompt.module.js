"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromptModule = void 0;
const common_1 = require("@nestjs/common");
const prompt_service_1 = require("./prompt.service");
const mongoose_1 = require("@nestjs/mongoose");
const prompt_1 = require("./models/prompt");
let PromptModule = class PromptModule {
};
exports.PromptModule = PromptModule;
exports.PromptModule = PromptModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: prompt_1.Prompt.name, schema: prompt_1.PromptSchema, collection: 'Prompts' },
            ]),
        ],
        providers: [prompt_service_1.PromptService],
    })
], PromptModule);
//# sourceMappingURL=prompt.module.js.map