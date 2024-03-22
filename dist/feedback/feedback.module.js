"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackModule = void 0;
const common_1 = require("@nestjs/common");
const feedback_controller_1 = require("./feedback.controller");
const feedback_service_1 = require("./feedback.service");
const mongoose_1 = require("@nestjs/mongoose");
const Feedback_1 = require("./models/Feedback");
const auth_module_1 = require("../auth/auth.module");
const auth_service_1 = require("../auth/services/auth.service");
const User_1 = require("../auth/models/User");
let FeedbackModule = class FeedbackModule {
};
exports.FeedbackModule = FeedbackModule;
exports.FeedbackModule = FeedbackModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                {
                    name: Feedback_1.Feedback.name,
                    schema: Feedback_1.FeedbackSchema,
                    collection: 'Feedbacks',
                },
                {
                    name: User_1.User.name,
                    schema: User_1.UserSchema,
                    collection: 'Users',
                },
            ]),
            auth_module_1.AuthModule,
        ],
        controllers: [feedback_controller_1.FeedbackController],
        providers: [feedback_service_1.FeedbackService, auth_service_1.AuthService],
    })
], FeedbackModule);
//# sourceMappingURL=feedback.module.js.map