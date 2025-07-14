import 'dotenv/config';
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ExecutionContext, CallHandler, NestInterceptor, ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
  }));

  app.use(json());
  app.use(urlencoded({ extended: false }));

  class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler) {
      const req = context.switchToHttp().getRequest();
      const res = context.switchToHttp().getResponse();
      const start = Date.now();
      let capturedJsonResponse: any;

      const originalJson = res.json.bind(res);
      res.json = (body: any) => {
        capturedJsonResponse = body;
        return originalJson(body);
      };

      res.on('finish', () => {
        const duration = Date.now() - start;
        const path = req.path;
        if (path.startsWith('/api')) {
          let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
          if (capturedJsonResponse) {
            logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
          }
          if (logLine.length > 80) {
            logLine = logLine.slice(0, 79) + '…';
          }
          console.log(logLine);
        }
      });

      return next.handle();
    }
  }

  app.useGlobalInterceptors(new LoggingInterceptor());
// Filtro global de excepciones con tipos
  class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const res = ctx.getResponse();
      const status = exception.status || exception.statusCode || 500;
      const message = exception.message || 'Internal Server Error';
      res.status(status).json({ message });
    }
  }

  app.useGlobalFilters(new GlobalExceptionFilter());

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('API Conversión YouTube → Spotify')
    .setDescription('Convert YouTube Music links to Spotify')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 5000;
  await app.listen(port, '0.0.0.0');
  console.log('Swagger docs en http://localhost:' + port + '/docs');
  console.log('Servidor NestJS corriendo en http://localhost:' + port);
}
bootstrap();