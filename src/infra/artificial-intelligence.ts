import { GoogleGenAI } from '@google/genai';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ArtificialIntelligence {
  private readonly ai: GoogleGenAI;
  private readonly model = 'gemini-2.0-flash';

  constructor(private readonly configService: ConfigService) {
    this.ai = new GoogleGenAI({
      apiKey: this.configService.getOrThrow('GEMINI_API_KEY'),
    });
  }

  async generateJSON(
    system: string,
    message: string,
  ): Promise<string | undefined> {
    const response = await this.ai.chats
      .create({
        model: this.model,
        config: {
          temperature: 0.7,
          systemInstruction: system,
          responseMimeType: 'application/json',
        },
      })
      .sendMessage({
        message,
      });

    return response.text;
  }
}
