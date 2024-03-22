import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { SignInDTO, RegisterDTO } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { ResponseMappings } from 'src/shared/utils/ResponseMappings';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from './guards/auth.guard';
import { ExtendedRequest } from 'src/types';
import { Public } from 'src/shared/decorators/Public';

@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard)
@ApiTags('User Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly responseMappings: ResponseMappings,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
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
    await this.authService.createUser(signUpData);
    return { message: 'User created, you can sign in now.' };
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
    return req.user;
  }

  @Get('google-auth')
  handleGetAuthUrl(@Res() res: Response) {
    return res.redirect(this.authService.getGoogleAuthURL());
  }
}
