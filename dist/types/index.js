"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TooManyRequestsException = exports.GeneratorModel = exports.EmailType = exports.ENV_MAPPINGS = exports.ENV = exports.WORDS_PER_CREDIT = void 0;
const common_1 = require("@nestjs/common");
exports.WORDS_PER_CREDIT = 10;
var ENV;
(function (ENV) {
    ENV["PROD"] = "PROD";
    ENV["DEV"] = "DEV";
})(ENV || (exports.ENV = ENV = {}));
exports.ENV_MAPPINGS = {
    DEV: '.env.dev',
    PROD: '.env.prod',
};
var EmailType;
(function (EmailType) {
    EmailType["VERIFICATION"] = "verification";
    EmailType["ACTIVATION"] = "activation";
    EmailType["PASSWORD_RESET"] = "password-reset";
})(EmailType || (exports.EmailType = EmailType = {}));
var GeneratorModel;
(function (GeneratorModel) {
    GeneratorModel["GPT_4"] = "GPT_4";
    GeneratorModel["CLAUDE_3"] = "CLAUDE_3";
    GeneratorModel["GEMINI_PRO"] = "GEMINI_PRO";
})(GeneratorModel || (exports.GeneratorModel = GeneratorModel = {}));
class TooManyRequestsException extends common_1.HttpException {
    constructor(response = 'Too Many Requests', status = common_1.HttpStatus.TOO_MANY_REQUESTS) {
        super(response, status);
    }
}
exports.TooManyRequestsException = TooManyRequestsException;
//# sourceMappingURL=index.js.map