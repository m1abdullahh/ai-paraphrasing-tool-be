"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomOTP = exports.getRecoveryEmailTemplate = exports.getEmailTemplate = exports.getEmailVariables = exports.countWords = exports.generateProposalPrompt = void 0;
const types_1 = require("../../types");
function generateProposalPrompt(jobDescription, name, optionalExperience, additionalPrompt) {
    let prompt = `**Proposal for Upwork Job:**\n\n`;
    prompt += `**Job Description:**\n${jobDescription}\n\n`;
    if (optionalExperience) {
        prompt += `**Experience:**\n Add lines that express that I have extensive experience of more than ${optionalExperience} in this field of work.\n\n`;
    }
    if (additionalPrompt && additionalPrompt !== '') {
        prompt += `**Additional Prompts:**\n ${additionalPrompt}`;
    }
    prompt += `\n\n**Please generate the proposal for the provided job description. Focus only on the text generation and do not include any additional information. If you find the name of the employer in the job description, such as in the end, then start the proposal with greetings and his name. And use ${name} as the name of the freelancer who's applying. Use it where it'd give of a good feeling to use.**`;
    prompt += `\n\n **Try not to include lines like: \n "I am writing to express my strong interest in..."\n in the start. Don't add lines like these in the first or second line of the proposal. Also avoid lines like: \n "Thank you for considering my application.." in the ending lines of the proposal. Instead, try to be creative and attract the employer by describing how you and your skills can help them in this project. Also try to avoid wording like "Dear Hiring manager", start with something like "Hi dear", or "Hello dear" or something similar.`;
    return prompt;
}
exports.generateProposalPrompt = generateProposalPrompt;
function countWords(str) {
    return str.trim().split(/\s+/).length;
}
exports.countWords = countWords;
function getEmailVariables(emailType) {
    switch (emailType) {
        case types_1.EmailType.VERIFICATION: {
            return {
                mainButtonText: 'Verify Email',
                mainAgenda: 'Confirm Your Email Address.',
                cbUrl: process.env.EMAIL_VERIFICATION_URL,
                requestFor: 'email verification',
            };
        }
        case types_1.EmailType.PASSWORD_RESET: {
            return {
                mainButtonText: 'Reset Password',
                mainAgenda: 'Reset Your Password.',
                cbUrl: process.env.PASSWORD_RESET_CALLBACK_URL,
                requestFor: 'password reset',
            };
        }
    }
}
exports.getEmailVariables = getEmailVariables;
function getEmailTemplate(name, token, expiry, emailType) {
    const emailVars = getEmailVariables(emailType);
    return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title>Email Confirmation</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
  </head>
  <style>
  *:link, *:visited {
    text-decoration: none;
  }
  </style>
  <body style="background-color: #e9ecef; margin: 0; padding: 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;">
  
    <!-- Preheader -->
    <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;">
      ${emailVars.mainAgenda}
    </div>
  
    <!-- Logo -->
    <div style="text-align: center; background-color: #e9ecef; padding: 36px 24px;">
      <a href="https://proposal-generator.abdullahis.live" target="_blank" style="display: inline-block;">
        <img src="https://cdn-icons-png.flaticon.com/512/5537/5537993.png" alt="Logo" style="width: 48px; max-width: 48px; min-width: 48px;">
      </a>
    </div>
  
    <!-- Hero -->
    <div style="text-align: center; background-color: #e9ecef; padding: 36px 24px 0;">
      <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">Hi, ${name.split(' ')[0]}! ${emailVars.mainAgenda}</h1>
    </div>
  
    <!-- Copy Block -->
    <div style="text-align: center; background-color: #e9ecef; padding: 24px;">
      <p style="margin: 0; font-size: 16px; line-height: 24px;">Tap the button below to ${emailVars.mainAgenda.toLowerCase()} If you didn't create an account with <a href="https://proposal-generator.abdullahis.live/">ABServes Proposal Generator</a>, you can safely delete this email.</p>
    </div>
  
    <!-- Button -->
    <div style="text-align: center; background-color: #e9ecef; padding: 12px;">
      <a href="${emailVars.cbUrl}?code=${token}" target="_blank" style="display: inline-block; padding: 16px 36px; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px; background-color: #1a82e2;">${emailVars.mainButtonText}</a>
    </div>
  
    <!-- Copy -->
    <div style="text-align: center; background-color: #e9ecef; padding: 24px;">
      <p style="margin: 0; font-size: 16px; line-height: 24px;">If that doesn't work, copy and paste the following link in your browser:</p>
      <p style="margin: 0;"><a href="${emailVars.cbUrl}?code=${token}" target="_blank">${emailVars.cbUrl}?code=${token}</a></p>
    </div>
  
    <!-- Footer -->
    <div style="text-align: center; background-color: #e9ecef; padding: 24px;">
      <p style="margin: 0; font-size: 14px; line-height: 20px; color: #666;">You received this email because we received a request for ${emailVars.requestFor} for your account. If you didn't request this, you can safely delete this email.</p>
      <p style="margin: 0; font-size: 14px; line-height: 20px; color: #666;">ABServes, Commercial Area, Bahawalpur, Pakistan 6300</p>
    </div>
  </body>
  </html>
  `;
}
exports.getEmailTemplate = getEmailTemplate;
function getRecoveryEmailTemplate(name, otp, expiry) {
    return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title>Account Recovery</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
  </head>
  <style>
  *:link, *:visited {
    text-decoration: none;
  }
  </style>
  <body style="background-color: #e9ecef; margin: 0; padding: 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;">
  
    <!-- Preheader -->
    <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;">
      Use this OTP to recover your account.
    </div>
  
    <!-- Logo -->
    <div style="text-align: center; background-color: #e9ecef; padding: 36px 24px 0px;">
      <a href="https://proposal-generator.abdullahis.live" target="_blank" style="display: inline-block;">
        <img src="https://cdn-icons-png.flaticon.com/512/5537/5537993.png" alt="Logo" style="width: 48px; max-width: 48px; min-width: 48px;">
      </a>
      <h2>ABServes Inc.</h2>
    </div>
  
    <!-- Hero -->
    <div style="text-align: center; background-color: #e9ecef; padding: 36px 24px 0;">
      <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">Hi, ${name.split(' ')[0]}!</h1>
    </div>
  
    <!-- Copy Block -->
    <div style="text-align: center; background-color: #e9ecef; padding: 24px;">
      <p style="margin: 0; font-size: 16px; line-height: 24px;">Use the following OTP to recover your account:</p>
      <h2 style="margin: 10px 0; font-size: 28px; font-weight: bold; color: #333;">${otp}</h2>
      <p style="margin: 0; font-size: 14px; line-height: 20px;">This OTP will expire in ${expiry}.</p>
    </div>
  
    <!-- Footer -->
    <div style="text-align: center; background-color: #e9ecef; padding: 24px;">
    <p style="margin: 0; font-size: 14px; line-height: 20px; color: #666;">You received this email because we received a request for account recovery for your account. If you didn't request this, you can safely delete this email.</p>
    <p style="margin: 0; font-size: 14px; line-height: 20px; color: #666;">For any questions or concerns, contact support at <a href="mailto:akjee204@gmail.com">akje204@gmail.com</a></p>
      <p style="margin: 0; font-size: 14px; line-height: 20px; color: #666;">ABServes Inc., Commercial Area, Bahawalpur, Pakistan 6300</p>
    </div>
  </body>
  </html>
  `;
}
exports.getRecoveryEmailTemplate = getRecoveryEmailTemplate;
const generateRandomOTP = (numCount) => {
    let otp = '';
    for (let i = 0; i < numCount; ++i) {
        otp += ~~(Math.random() * 10);
    }
    return otp;
};
exports.generateRandomOTP = generateRandomOTP;
//# sourceMappingURL=index.js.map