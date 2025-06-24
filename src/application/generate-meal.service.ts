import OpenAI from 'openai';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GenerateMealService {
  private readonly systemRole: OpenAI.Chat.Completions.ChatCompletionMessageParam[] =
    [
      {
        role: 'system',
        name: 'persona',
        content:
          'Você é um nutricionista que busca ajudar o equilíbrio entre uma refeição saudável e saborosa',
      },
      {
        role: 'system',
        name: 'goal',
        content:
          'Com base na refeição pedida e no desejo informado, crie 3 opções de refeições com 10 ou menos ingredientes para cada uma',
      },
      {
        role: 'system',
        name: 'output',
        content:
          'Retorne no formato JSON: [{ meal: string, ingredients: string[] }]',
      },
    ];

  constructor(private readonly openAi: OpenAI) {}

  async execute(meal: string, obs: string): Promise<string> {
    const response = await this.openAi.chat.completions.create({
      model: 'gpt-4o-mini',
      response_format: {
        type: 'json_object',
      },
      messages: [
        ...this.systemRole,
        {
          role: 'user',
          content: `Refeição: ${meal}`,
        },
        {
          role: 'user',
          content: `Obs.: ${obs}`,
        },
      ],
      temperature: 0.2,
    });
    return JSON.parse(response.choices[0].message.content ?? '');
  }
}
