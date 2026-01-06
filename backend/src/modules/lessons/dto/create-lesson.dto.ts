import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  IsBoolean,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LessonType } from '@prisma/client';

export class CreateLessonDto {
  @ApiProperty({
    example: 'Introduction to Variables',
    description: 'Lesson title in English',
  })
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  @MaxLength(200)
  title: string;

  @ApiProperty({
    example: 'مقدمة في المتغيرات',
    description: 'Lesson title in Arabic',
  })
  @IsString()
  @IsNotEmpty({ message: 'Arabic title is required' })
  @MaxLength(200)
  titleAr: string;

  @ApiPropertyOptional({
    example: 'Learn about variables in programming...',
    description: 'Lesson content in English',
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({
    example: 'تعلم عن المتغيرات في البرمجة...',
    description: 'Lesson content in Arabic',
  })
  @IsOptional()
  @IsString()
  contentAr?: string;

  @ApiProperty({
    enum: LessonType,
    example: LessonType.VIDEO,
    description: 'Type of lesson',
  })
  @IsEnum(LessonType)
  type: LessonType;

  @ApiPropertyOptional({
    example: 'https://example.com/video.mp4',
    description: 'Video URL (for video lessons)',
  })
  @IsOptional()
  @IsString()
  videoUrl?: string;

  @ApiPropertyOptional({
    example: 15,
    description: 'Duration in minutes',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  duration?: number;

  @ApiPropertyOptional({
    example: false,
    description: 'Is this lesson free?',
  })
  @IsOptional()
  @IsBoolean()
  isFree?: boolean;
}
