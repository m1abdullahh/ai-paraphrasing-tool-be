import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';
import { GeneratorModel } from 'src/types';

export class GetCompletionDTO {
  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  @MinLength(50)
  jobDescription: string;

  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: Number, required: false })
  @IsNumber()
  experience: number;

  @ApiProperty({ type: String, required: false })
  @IsString()
  additionalPrompt: string;

  @ApiProperty({
    type: String,
    required: true,
    enum: GeneratorModel,
    default: GeneratorModel.GPT_4,
  })
  @IsString()
  @IsNotEmpty()
  model: GeneratorModel;
}
