"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENV_MAPPINGS = exports.ENV = exports.WORDS_PER_CREDIT = void 0;
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
//# sourceMappingURL=index.js.map