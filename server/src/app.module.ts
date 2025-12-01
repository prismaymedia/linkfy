import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { SentryModule, SentryGlobalFilter } from '@sentry/nestjs/setup';
import { AppController } from './controllers/app.controller';
import { FavoritesController } from './controllers/favorites.controller';
import { ConversionService } from './services/conversion.service';
import { YoutubeService } from './services/youtube.service';
import { SpotifyService } from './services/spotify.service';
import { StorageService } from './services/storage.service';
import { DatabaseModule } from './database/database.module';
import { PrometheusModule } from './prometheus/prometheus.module';
import { MetricsInterceptor } from './prometheus/metrics.interceptor';
import { UserModule } from './user/user.module';
import grafanaConfig from './config/grafana.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [grafanaConfig],
    }),
    DatabaseModule,
    SentryModule.forRoot(),
    PrometheusModule,
    UserModule,
  ],
  controllers: [AppController, FavoritesController],
  providers: [
    ConversionService,
    YoutubeService,
    SpotifyService,
    StorageService,
    {
      provide: APP_FILTER,
      useClass: SentryGlobalFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: MetricsInterceptor,
    },
  ],
})
export class AppModule { }
