import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ArtificialIntelligence } from './infra/artificial-intelligence';
import { ConfigModule } from '@nestjs/config';
import { GenerateMealService } from './application/generate-meal.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/.env`,
    }),
  ],
  providers: [ArtificialIntelligence, GenerateMealService],
  controllers: [AppController],
})
export class AppModule {}
