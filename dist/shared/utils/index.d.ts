import { EmailType } from 'src/types';
export declare function generateProposalPrompt(jobDescription: string, name: string, optionalExperience?: number, additionalPrompt?: string): string;
export declare function countWords(str: string): number;
export declare function getEmailVariables(emailType: EmailType): {
    mainAgenda: string;
    cbUrl: string;
    requestFor: string;
    mainButtonText: string;
};
export declare function getEmailTemplate(name: string, token: string, expiry: string, emailType: EmailType): string;
