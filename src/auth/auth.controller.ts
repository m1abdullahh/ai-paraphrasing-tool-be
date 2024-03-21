import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { SignInDTO, RegisterDTO } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { ResponseMappings } from 'src/shared/utils/ResponseMappings';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('User Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly responseMappings: ResponseMappings,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  @ApiOperation({ summary: 'User Signup' })
  @ApiBody({ type: RegisterDTO })
  @Post('register')
  async handleRegister(@Body() signUpData: RegisterDTO) {
    const availability = await this.authService.checkAvailability({
      username: signUpData.username,
      email: signUpData.email,
    });
    if (!availability.available) {
      return this.responseMappings.getErrorResponse(availability.error);
    }
    await this.authService.createUser(signUpData);
    return this.responseMappings.getSuccessResponse(
      'User created, you can login now.',
    );
  }

  @ApiOperation({ summary: 'User Login' })
  @Post('login')
  async handleLogin(@Body() signInData: SignInDTO) {
    const user = await this.authService.findOne(signInData.email);
    if (!user) {
      return this.responseMappings.getErrorResponse(
        'No account found with this email.',
      );
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
      return this.responseMappings.getSuccessResponse({
        accessToken: token,
        expiresIn: expiry,
        user: user,
      });
    }
    return this.responseMappings.getErrorResponse('Invalid Password.');
  }

  @Get('google-auth')
  handleGetAuthUrl(@Res() res: Response) {
    return res.redirect(this.authService.getGoogleAuthURL());
  }
}
