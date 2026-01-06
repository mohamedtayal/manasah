import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  MaxLength,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateQuizDto {
  @ApiProperty({
    example: 'Python Basics Quiz',
    description: 'Quiz title in English',
  })
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  @MaxLength(200)
  title: string;

  @ApiProperty({
    example: 'اختبار أساسيات بايثون',
    description: 'Quiz title in Arabic',
  })
  @IsString()
  @IsNotEmpty({ message: 'Arabic title is required' })
  @MaxLength(200)
  titleAr: string;

  @ApiPropertyOptional({
    example: 'Test your knowledge of Python basics',
    description: 'Quiz description',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiPropertyOptional({
    example: 15,
    description: 'Time limit in minutes',
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(180)
  timeLimit?: number;

  @ApiPropertyOptional({
    example: 70,
    description: 'Passing score percentage (default 60)',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  passingScore?: number;
}
