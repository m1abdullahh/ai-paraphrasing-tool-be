import { GeneratorService } from './generator.service';
import { GetCompletionDTO } from './DTOs/generator.dto';
import { ResponseMappings } from 'src/shared/utils/ResponseMappings';
import { ExtendedRequest } from 'src/types';
import { Response } from 'express';
import { PromptService } from 'src/prompt/prompt.service';
import { AuthService } from 'src/auth/services/auth.service';
export declare class GeneratorController {
    private readonly generatorService;
    private readonly responseMappings;
    private readonly promptService;
    private readonly authService;
    constructor(generatorService: GeneratorService, responseMappings: ResponseMappings, promptService: PromptService, authService: AuthService);
    handleGetCompletion(prompt: GetCompletionDTO, req: ExtendedRequest, res: Response): Promise<IResponseMappings<unknown>>;
}
