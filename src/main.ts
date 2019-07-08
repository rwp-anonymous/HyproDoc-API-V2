import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import * as config from 'config';
import { AppModule } from './app.module';

async function bootstrap() {
  const serverConfig = config.get('server');

  /* Logger Setup */
  const logger = new Logger('bootstrap');
  /* End of Logger Setup */

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v2');

  /* Swagger Setup */
  const options = new DocumentBuilder()
    .setTitle('HyproDoc - API')
    .setDescription('REST client documentation for HyproDoc Platform')
    .setVersion('2.0')
    .addTag('hyprodoc')
    .setSchemes('http', 'https')
    .setBasePath('api/v2')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/v2/docs', app, document);
  /* End of Swagger Setup */

  app.enableCors();

  const port = process.env.PORT || serverConfig.port;
  await app.listen(port);

  logger.log(`Application listening on port ${port}`);
}
bootstrap();
