import OpenAI from 'openai';
import { Injectable } from '@nestjs/common';
import { ChatCompletionTool } from 'openai/resources/chat/completions';
import { produtosEmEstoque } from '../infra/database/fake-database';
import { ChatModel } from 'openai/resources/shared';

type StrategyFunctionName = 'produtos_em_estoque';

@Injectable()
export class GenerateMealService {
  private readonly tools: ChatCompletionTool[];
  private readonly model: ChatModel = 'gpt-4o-mini';
  private readonly systemPrompt =
    'Você é um cozinheiro que busca fazer refeições saborosas. Com base na refeição e desejo informados, crie até 3 opções saudáveis com até 10 ingredientes, utilizar **somente com itens do estoque**. Crie apenas opções válidas para refeição informada, retorne menos opções ou até mesmo vazio se não for válido. Retorne **somente** um JSON válido neste formato: { options: [{ meal: string, ingredients: string[] }]}';

  private readonly strategyFunction: {
    [T in StrategyFunctionName]: () => unknown;
  };

  constructor(private readonly openAi: OpenAI) {
    this.tools = [
      {
        type: 'function',
        function: {
          name: 'produtos_em_estoque',
          description: 'Lista os produtos disponíveis em estoque.',
          parameters: {
            type: 'object',
            properties: {},
          },
        },
      },
    ];

    this.strategyFunction = {
      produtos_em_estoque: () => produtosEmEstoque(),
    };
  }

  async execute(meal: string, obs: string): Promise<string> {
    const inputMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: this.systemPrompt },
      { role: 'user', content: `Refeição: ${meal}` },
      { role: 'user', content: `Obs.: ${obs}` },
    ];

    const completion = await this.openAi.chat.completions.create({
      model: this.model,
      messages: inputMessages,
      tools: this.tools,
      response_format: {
        type: 'json_object',
      },
      temperature: 0.2,
    });

    const toolCall = completion.choices[0].message.tool_calls?.[0];

    if (toolCall) {
      const functionName = toolCall.function.name;
      const callId = toolCall.id;
      const result = this.strategyFunction[functionName]();
      const newMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
        ...inputMessages,
        {
          role: 'assistant',
          tool_calls: [toolCall],
        },
        {
          role: 'tool',
          tool_call_id: callId,
          content: JSON.stringify(result),
        },
      ];
      const secondResponse = await this.openAi.chat.completions.create({
        model: this.model,
        messages: newMessages,
        response_format: {
          type: 'json_object',
        },
        temperature: 0.2,
      });

      const finalOutput = secondResponse.choices[0].message.content;
      return JSON.parse(finalOutput ?? '');
    }

    return '';
  }
}
