import { ArtificialIntelligence } from '../infra/artificial-intelligence';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GenerateMealService {
  private readonly systemInput =
    'Você é um nutricionista que busca ajudar o equilíbrio entre uma refeição saudável e saborosa. Com base na refeição pedida e no desejo informado, crie 3 opções de refeições com 10 ou menos ingredientes para cada uma';
  private readonly systemOutput =
    'Retorne no formato JSON: [{ meal: string, ingredients: string[] }]';

  constructor(private readonly ai: ArtificialIntelligence) {}

  async execute(meal: string, obs: string): Promise<string> {
    const message = `Refeição: ${meal}. Objetivo/Obs.: ${obs}`;
    const response = await this.ai.generateJSON(
      `${this.systemInput}. ${this.systemOutput}`,
      message,
    );
    if (!response) throw new Error('Cannot create meal');
    return response;
  }
}
