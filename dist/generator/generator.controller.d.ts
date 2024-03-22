import { GeneratorService } from './generator.service';
import { GetCompletionDTO } from './DTOs/generator.dto';
import { ResponseMappings } from 'src/shared/utils/ResponseMappings';
import { ExtendedRequest } from 'src/types';
export declare class GeneratorController {
    private readonly generatorService;
    private readonly responseMappings;
    constructor(generatorService: GeneratorService, responseMappings: ResponseMappings);
    handleGetCompletion(prompt: GetCompletionDTO, req: ExtendedRequest): Promise<IResponseMappings<unknown>>;
}
