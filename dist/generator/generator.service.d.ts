import { ConfigService } from '@nestjs/config';
import { AuthService } from 'src/auth/services/auth.service';
import { PromptService } from 'src/prompt/prompt.service';
import { GeneratorModel } from 'src/types';
export declare class GeneratorService {
    private readonly configService;
    private readonly promptService;
    private readonly authService;
    private anthropicAi;
    private openAi;
    constructor(configService: ConfigService, promptService: PromptService, authService: AuthService);
    getCompletion(content: string, userId: string, originalPrompt: string, service: GeneratorModel): Promise<string>;
}
