import { GenerateMealService } from './application/generate-meal.service';
import { Body, Controller, Get, Post } from '@nestjs/common';

type GenerateMealDto = {
  meal: string;
  obs: string;
};

@Controller('meal')
export class AppController {
  constructor(private readonly generateMealService: GenerateMealService) {}

  @Post()
  async generateMeal(@Body() { meal, obs }: GenerateMealDto): Promise<any> {
    return await this.generateMealService.execute(meal, obs);
  }
}
