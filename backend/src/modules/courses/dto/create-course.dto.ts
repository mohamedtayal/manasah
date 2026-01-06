import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsUrl,
  IsEnum,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateCourseDto {
  @ApiProperty({
    example: 'Python Programming Fundamentals',
    description: 'Course title in English',
  })
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  @MaxLength(200)
  title: string;

  @ApiProperty({
    example: 'أساسيات البرمجة بـ Python',
    description: 'Course title in Arabic',
  })
  @IsString()
  @IsNotEmpty({ message: 'Arabic title is required' })
  @MaxLength(200)
  titleAr: string;

  @ApiPropertyOptional({
    example: 'Learn Python from scratch',
    description: 'Course description in English',
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiPropertyOptional({
    example: 'تعلم بايثون من الصفر',
    description: 'Course description in Arabic',
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  descriptionAr?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/thumbnail.jpg',
    description: 'Course thumbnail URL',
  })
  @IsOptional()
  @IsString()
  thumbnail?: string;

  @ApiPropertyOptional({
    example: 99.99,
    description: 'Course price (0 for free)',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  price?: number;

  @ApiPropertyOptional({
    example: 'beginner',
    description: 'Course level',
    enum: ['beginner', 'intermediate', 'advanced'],
  })
  @IsOptional()
  @IsString()
  @IsEnum(['beginner', 'intermediate', 'advanced'])
  level?: string;

  @ApiPropertyOptional({
    example: 1440,
    description: 'Total duration in minutes',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  duration?: number;
}
