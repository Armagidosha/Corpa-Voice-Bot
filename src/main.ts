import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { resolveDynamicProviders } from 'nestjs-dynamic-providers';
import { AllExceptionsFilter } from './common/ExceptionFilters/allExceptionFilter';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

async function bootstrap() {
  await resolveDynamicProviders();
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = app.get<Logger>(WINSTON_MODULE_NEST_PROVIDER);
  app.useGlobalFilters(new AllExceptionsFilter(logger));
  await app.listen(configService.getOrThrow('port'));
}
void bootstrap();
