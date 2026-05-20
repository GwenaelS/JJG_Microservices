import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Supprime automatiquement les propriétés qui ne sont pas dans le DTO
      forbidNonWhitelisted: true, // Renvoie une erreur si le client envoie des propriétés interdites
      transform: true, // Transforme automatiquement les types (ex: une string "1" en number 1)
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
