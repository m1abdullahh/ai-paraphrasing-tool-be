import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  SignInDTO,
  RegisterDTO,
  AccountRecoveryDTO,
  ConfirmAccountRecoveryTokenDTO,
  NewPasswordDTO,
} from '../dto/auth.dto';
import { AuthService } from '../services/auth.service';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';
import { ExtendedRequest } from 'src/types';
import { Public } from 'src/shared/decorators/Public';
import { EmailService } from '../services/email.service';

@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard)
@ApiTags('User Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  @Public()
  @ApiOperation({ summary: 'User Signup' })
  @ApiBody({ type: RegisterDTO })
  @Post('register')
  async handleRegister(@Body() signUpData: RegisterDTO) {
    const availability = await this.authService.checkAvailability({
      username: signUpData.username,
      email: signUpData.email,
    });
    if (!availability.available) {
      throw new BadRequestException(availability.error);
    }
    const createdUser = await this.authService.createUser(signUpData);
    await this.emailService.sendVerificationEmail(createdUser);
    return { message: 'User created, check your email inbox.' };
  }

  @Public()
  @ApiOperation({ summary: 'User Login' })
  @Post('login')
  async handleLogin(@Body() signInData: SignInDTO) {
    const user = await this.authService.findOne(signInData.email);
    if (!user) {
      throw new NotFoundException('No account found with this email.');
    }
    const passwordMatch = compareSync(signInData.password, user.password);
    const expiry = this.configService.get<string>('JWT_EXPIRES_IN');
    const secret = this.configService.get<string>('JWT_SECRET');
    if (passwordMatch) {
      const token = await this.jwtService.signAsync(
        {
          email: user.email,
          userId: user.id,
        },
        {
          expiresIn: expiry,
          secret,
        },
      );
      if (!user.active) {
        throw new UnauthorizedException(
          'Your account is not active,\n contact Administrator for account activation.',
        );
      }
      if (!user.emailVerified) {
        throw new UnauthorizedException(
          'Your email address is not verfied. Please check your inbox. ',
        );
      }
      return {
        accessToken: token,
        expiresIn: expiry,
        user: user,
      };
    }
    throw new BadRequestException('Invalid Password.');
  }

  @ApiOperation({ summary: 'User profile', description: 'Fetch user profile.' })
  @Get('profile')
  async handleGetProfile(@Req() req: ExtendedRequest) {
    return {
      ...req.user['_doc'],
      promptCredits: Math.max(req.user.promptCredits, 0),
    };
  }

  @Get('google-auth')
  handleGetAuthUrl(@Res() res: Response) {
    return res.redirect(this.authService.getGoogleAuthURL());
  }

  @ApiOperation({ summary: 'Callback URL for email verification.' })
  @ApiResponse({ status: 200, description: 'Email Verified Successfully.' })
  @ApiResponse({ status: 400, description: 'Code Is Invalid.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  @ApiQuery({ name: 'code', type: String, required: true })
  @Public()
  @Get('confirm-code')
  async confirmCode(@Query('code') code: string, @Res() res: Response) {
    const userId = await this.emailService.verifyCode(code);
    if (userId) {
      await this.authService.setEmailVerifiedStatus(userId, true);
      return res.redirect(
        `${this.configService.get<string>('CLIENT_URL')}/login?emailVerified=true`,
      );
    }
    throw new BadRequestException('Invalid code.');
  }

  @ApiOperation({
    summary: 'Account Recovery',
    description: 'Request for OTP in case of account recovery.',
  })
  @ApiBody({ type: AccountRecoveryDTO, required: true })
  @Public()
  @Post('account-recovery')
  async handleAccountRecovery(@Body() data: AccountRecoveryDTO) {
    const email = data.email;
    const account = await this.authService.findOne(email);
    if (!account) {
      throw new BadRequestException(
        'No account is registered with this email.',
      );
    }
    try {
      await this.emailService.sendAccountRecoveryEmail(email, account.fullName);
      return { message: 'OTP sent for email verification.' };
    } catch (e) {
      throw new InternalServerErrorException(
        e.message || 'Something went wrong.',
      );
    }
  }

  @ApiOperation({
    summary: 'Account Recovery Step 2',
    description: 'Confirm the OTP with the email.',
  })
  @ApiBody({ type: ConfirmAccountRecoveryTokenDTO, required: true })
  @Public()
  @Post('account-recovery/confirm')
  async confirmAccountRecoveryToken(
    @Body() data: ConfirmAccountRecoveryTokenDTO,
  ) {
    const { email, token } = data;
    try {
      const tokenValidity = await this.emailService.confirmRecoveryCode(
        email,
        token,
      );
      if (tokenValidity.match) {
        return { message: 'OTP matched.', code: tokenValidity.code };
      }
      throw new BadRequestException('OTP mismatch.');
    } catch (e) {
      throw new InternalServerErrorException(
        e.message || 'Something went wrong.',
      );
    }
  }
  @ApiOperation({
    summary: 'Account Recovery Step 3',
    description:
      'Final Step: Send new Password with Code recieved from Step 2.',
  })
  @ApiBody({ type: NewPasswordDTO, required: true })
  @Public()
  @Post('reset-password')
  async resetPassword(@Body() data: NewPasswordDTO) {
    const { code, newPassword } = data;
    try {
      const payload = await this.jwtService.verifyAsync<{ email: string }>(
        code,
        { secret: this.configService.get<string>('JWT_SECRET') },
      );
      await this.emailService.expireRecoveryCode(payload.email, code);
      await this.authService.changePassword(payload.email, newPassword);
      return { message: 'Password changed successfully.' };
    } catch (e) {
      throw new InternalServerErrorException(
        e.message || 'Something went wrong.',
      );
    }
  }
}
