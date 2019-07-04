import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
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
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/v2/docs', app, document);
  /* End of Swagger Setup */

  app.enableCors();

  await app.listen(3000);
}
bootstrap();
