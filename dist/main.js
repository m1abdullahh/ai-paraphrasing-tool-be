"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const dotenv = require("dotenv");
const swagger_1 = require("@nestjs/swagger");
const bodyParser = require("body-parser");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const nodeEnv = 'production';
    const envFilePath = '.env.prod';
    const port = 8081;
    console.log(`Loading environment variables from ${nodeEnv} environment file: ${envFilePath}`);
    dotenv.config({ path: envFilePath });
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