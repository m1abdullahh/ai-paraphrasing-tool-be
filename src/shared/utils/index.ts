export function generateProposalPrompt(
  jobDescription: string,
  name: string,
  optionalExperience?: number,
  additionalPrompt?: string,
): string {
  let prompt = `**Proposal for Upwork Job:**\n\n`;
  prompt += `**Job Description:**\n${jobDescription}\n\n`;

  if (optionalExperience) {
    prompt += `**Experience:**\n Add lines that express that I have extensive experience of more than ${optionalExperience} in this field of work.\n\n`;
  }

  if (additionalPrompt && additionalPrompt !== '') {
    prompt += `**Additional Prompts:**\n ${additionalPrompt}`;
  }

  prompt += `\n\n**Please generate the proposal for the provided job description. Focus only on the text generation and do not include any additional information. If you find the name of the employer in the job description, such as in the end, then start the proposal with greetings and his name. And use ${name} as the name of the freelancer who's applying. Use it where it'd give of a good feeling to use.**`;

  return prompt;
}
