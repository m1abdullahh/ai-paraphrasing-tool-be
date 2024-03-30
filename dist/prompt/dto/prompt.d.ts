import { GeneratorModel } from 'src/types';
export type AddPromptDTO = {
    user: string;
    prompt: string;
    completion: string;
    model: GeneratorModel;
};
