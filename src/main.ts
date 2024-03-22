import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
async function bootstrap() {
  const nodeEnv = 'production';
  const envFilePath = '.env.prod';
  const port = 8080;
  // if (nodeEnv === 'development') {
  //   envFilePath = '.env.dev';
  //   port = 3001;
  // } else if (nodeEnv === 'staging') {
  //   envFilePath = '.env.staging';
  // } else if (nodeEnv == 'production') {
  //   envFilePath = '.env.prod';
  // }

  console.log(
    `Loading environment variables from ${nodeEnv} environment file: ${envFilePath}`,
  );
  dotenv.config({ path: envFilePath });

  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const config = new DocumentBuilder()
    .setTitle('AI Paraphrasing Tool')
    .setDescription('AI Paraphrasing Tool API description.')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true,
  });
  // if (nodeEnv !== 'production')
  SwaggerModule.setup('api', app, document, {
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
