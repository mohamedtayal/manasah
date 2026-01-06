import {
  IsArray,
  ValidateNested,
  IsUUID,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class AnswerDto {
  @ApiProperty({
    description: 'Question ID',
  })
  @IsUUID()
  questionId: string;

  @ApiPropertyOptional({
    description: 'Selected option ID (for choice questions)',
  })
  @IsOptional()
  @IsUUID()
  selectedOptionId?: string;

  @ApiPropertyOptional({
    description: 'Text answer (for short answer questions)',
  })
  @IsOptional()
  @IsString()
  textAnswer?: string;
}

export class SubmitQuizDto {
  @ApiProperty({
    type: [AnswerDto],
    description: 'Array of answers',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  answers: AnswerDto[];
}
