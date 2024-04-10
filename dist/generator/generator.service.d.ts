import { ConfigService } from '@nestjs/config';
import { GeneratorModel } from 'src/types';
export declare class GeneratorService {
    private readonly configService;
    private anthropicAi;
    private openAi;
    private googleAI;
    constructor(configService: ConfigService);
    getCompletion(content: string, userId: string, originalPrompt: string, service: GeneratorModel): Promise<any>;
}
