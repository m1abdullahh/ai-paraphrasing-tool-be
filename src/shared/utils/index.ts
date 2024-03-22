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

  prompt += `\n\n **Try not to include lines like: \n "I am writing to express my strong interest in..."\n in the start. Don't add lines like these in the first or second line of the proposal. Also avoid lines like: \n "Thank you for considering my application.." in the ending lines of the proposal. Instead, try to be creative and attract the employer by describing how you and your skills can help them in this project. `;

  return prompt;
}

export function countWords(str: string) {
  return str.trim().split(/\s+/).length;
}
