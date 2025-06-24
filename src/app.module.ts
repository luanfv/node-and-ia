import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ArtificialIntelligence } from './infra/artificial-intelligence';
import { ConfigModule } from '@nestjs/config';
import { GenerateMealService } from './application/generate-meal.service';
import OpenAI from 'openai';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/.env`,
    }),
  ],
  providers: [
    ArtificialIntelligence,
    GenerateMealService,
    {
      provide: OpenAI,
      useFactory: () =>
        new OpenAI({
          apiKey: process.env['OPENAI_API_KEY'],
        }),
    },
  ],
  controllers: [AppController],
})
export class AppModule {}
