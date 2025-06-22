import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { ArtificialIntelligence } from '../infra/artificial-intelligence';
import { GenerateMealService } from './generate-meal.service';

describe('GenerateMealService execute integration tests', () => {
  const aiMockedResult = '{test: 1}';
  const aiMocked = createMock<ArtificialIntelligence>();
  const spyAiMocked = jest.spyOn(aiMocked, 'generateJSON');
  spyAiMocked.mockResolvedValue(aiMockedResult);
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [ArtificialIntelligence, GenerateMealService],
    })
      .overrideProvider(ArtificialIntelligence)
      .useValue(aiMocked)
      .compile();

    await module.init();
  });

  afterAll(async () => {
    await module.close();
  });

  it('SHOULD call the ArtificialIntelligence', async () => {
    const meal = 'any meal 1';
    const obs = 'any thing 1';
    const message = `Refeição: ${meal}. Objetivo/Obs.: ${obs}`;
    const system =
      'Você é um nutricionista que busca ajudar o equilíbrio entre uma refeição saudável e saborosa. Com base na refeição pedida e no desejo informado, crie 3 opções de refeições com 10 ou menos ingredientes para cada uma. Retorne no formato JSON: [{ meal: string, ingredients: string[] }]';
    const service = module.get(GenerateMealService);
    await service.execute(meal, obs);
    expect(spyAiMocked).toHaveBeenCalledWith(system, message);
  });

  it('SHOULD return string', async () => {
    const service = module.get(GenerateMealService);
    await expect(service.execute('system', 'message')).resolves.toEqual(
      aiMockedResult,
    );
  });

  describe('WHEN AI cannot return', () => {
    it('SHOULD throw an error', async () => {
      const ai = module.get(ArtificialIntelligence);
      jest.spyOn(ai, 'generateJSON').mockResolvedValueOnce(undefined);
      const service = module.get(GenerateMealService);
      await expect(service.execute('system', 'message')).rejects.toThrow(
        new Error('Cannot create meal'),
      );
    });
  });
});
