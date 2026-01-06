import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  IsArray,
  ValidateNested,
  IsBoolean,
  Min,
  ArrayMinSize,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { QuestionType } from '@prisma/client';

export class CreateOptionDto {
  @ApiProperty({
    example: 'Option text',
    description: 'Option text in English',
  })
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiProperty({
    example: 'نص الخيار',
    description: 'Option text in Arabic',
  })
  @IsString()
  @IsNotEmpty()
  textAr: string;

  @ApiProperty({
    example: false,
    description: 'Is this the correct answer?',
  })
  @IsBoolean()
  isCorrect: boolean;
}

export class CreateQuestionDto {
  @ApiProperty({
    example: 'What is Python?',
    description: 'Question text in English',
  })
  @IsString()
  @IsNotEmpty({ message: 'Question text is required' })
  text: string;

  @ApiProperty({
    example: 'ما هي بايثون؟',
    description: 'Question text in Arabic',
  })
  @IsString()
  @IsNotEmpty({ message: 'Arabic question text is required' })
  textAr: string;

  @ApiProperty({
    enum: QuestionType,
    example: QuestionType.SINGLE_CHOICE,
    description: 'Type of question',
  })
  @IsEnum(QuestionType)
  type: QuestionType;

  @ApiPropertyOptional({
    example: 10,
    description: 'Points for this question',
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  points?: number;

  @ApiPropertyOptional({
    example: 'Python is a programming language',
    description: 'Explanation for the answer',
  })
  @IsOptional()
  @IsString()
  explanation?: string;

  @ApiPropertyOptional({
    example: 'بايثون هي لغة برمجة',
    description: 'Explanation in Arabic',
  })
  @IsOptional()
  @IsString()
  explanationAr?: string;

  @ApiProperty({
    type: [CreateOptionDto],
    description: 'Answer options',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(2)
  @Type(() => CreateOptionDto)
  options: CreateOptionDto[];
}
