import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { SentryModule, SentryGlobalFilter } from '@sentry/nestjs/setup';
import { AppController } from './controllers/app.controller';
import { ConversionService } from './services/conversion.service';
import { YoutubeService } from './services/youtube.service';
import { SpotifyService } from './services/spotify.service';
import { StorageService } from './services/storage.service';
import { SupabaseModule } from './supabase/supabase.module';

@Module({
  imports: [
    SupabaseModule,
    SentryModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [
    ConversionService,
    YoutubeService,
    SpotifyService,
    StorageService,
    {
      provide: APP_FILTER,
      useClass: SentryGlobalFilter,
    },
  ],
})
export class AppModule { }
