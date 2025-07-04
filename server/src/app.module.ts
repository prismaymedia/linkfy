import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { ConversionService } from './services/conversion.service';
import { YoutubeService } from './services/youtube.service';
import { SpotifyService } from './services/spotify.service';
import { StorageService } from './services/storage.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    ConversionService,
    YoutubeService,
    SpotifyService,
    StorageService,
  ],
})
export class AppModule { }

