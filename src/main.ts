import {NestFactory} from '@nestjs/core';
import {ValidationPipe} from '@nestjs/common';
import {NestExpressApplication} from '@nestjs/platform-express';
import AppModule from '@/app.module';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';

declare const module: any;
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    abortOnError: false,
  });

  app.useGlobalPipes(new ValidationPipe({transform: true}));

  const config = new DocumentBuilder()
    .setTitle('Indy Test')
    .setDescription('indy test for software engineering position')
    .setVersion('1.0')
    .addTag('promo-code')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(8080);
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap();
