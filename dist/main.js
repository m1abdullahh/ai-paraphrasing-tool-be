"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.envFilePath = void 0;
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const dotenv = require("dotenv");
const swagger_1 = require("@nestjs/swagger");
const bodyParser = require("body-parser");
const common_1 = require("@nestjs/common");
const types_1 = require("./types");
const nodeEnv = types_1.ENV.DEV;
exports.envFilePath = types_1.ENV_MAPPINGS[nodeEnv];
async function bootstrap() {
    const port = 8080;
    console.log(`Loading environment variables from ${nodeEnv} environment file: ${exports.envFilePath}`);
    dotenv.config({ path: exports.envFilePath });
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    app.useGlobalPipes(new common_1.ValidationPipe());
    const config = new swagger_1.DocumentBuilder()
        .setTitle('AI Paraphrasing Tool')
        .setDescription('AI Paraphrasing Tool API description.')
        .setVersion('1.0')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
    }, 'JWT-auth')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config, {
        deepScanRoutes: true,
    });
    if (nodeEnv !== types_1.ENV.PROD)
        swagger_1.SwaggerModule.setup('api', app, document, {
            customSiteTitle: 'AI Paraphrasing Tool APIs',
            swaggerOptions: {
                defaultModelsExpandDepth: -1,
                defaultModelExpandDepth: -1,
                docExpansion: 'none',
            },
        });
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
    await app.listen(port);
}
bootstrap();
//# sourceMappingURL=main.js.map