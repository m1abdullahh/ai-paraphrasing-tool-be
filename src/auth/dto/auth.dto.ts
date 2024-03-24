import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

export class RegisterDTO {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  @IsStrongPassword({
    minLength: 8,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password: string;
}

export class SignInDTO {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsStrongPassword(
    {},
    {
      message: 'Invalid password.',
    },
  )
  password: string;
}

export class AccountRecoveryDTO {
  @ApiProperty({ type: String, required: true })
  @IsEmail()
  email: string;
}

export class ConfirmAccountRecoveryTokenDTO extends AccountRecoveryDTO {
  @ApiProperty({ type: String, required: true })
  @IsString()
  @MinLength(6)
  token: string;
}

export class NewPasswordDTO {
  @ApiProperty({ type: String, required: true })
  @IsString()
  code: string;

  @ApiProperty({ type: String, required: true })
  @IsStrongPassword()
  newPassword: string;
}
