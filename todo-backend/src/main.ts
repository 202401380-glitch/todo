import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Enable CORS for frontend connection
  app.enableCors();

  // 2. Enable Class Validator globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Auto-strip un-validated properties
      forbidNonWhitelisted: true, // Throw error if extra properties are sent
      transform: true, // Automatically transform payloads to DTO instances
    }),
  );

  // 3. Configure Swagger API Docs
  const config = new DocumentBuilder()
    .setTitle('Todo API')
    .setDescription('The Todo Application API endpoints')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // 4. Start Server (Once at the end)
  const port = process.env.PORT || 5000;
  await app.listen(port);

  console.log(`🚀 Server running on: http://localhost:${port}`);
  console.log(`📚 Swagger Docs available at: http://localhost:${port}/api/docs`);
}
bootstrap();