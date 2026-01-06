import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateModuleDto {
  @ApiProperty({
    example: 'Getting Started',
    description: 'Module title in English',
  })
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  @MaxLength(200)
  title: string;

  @ApiProperty({
    example: 'البداية',
    description: 'Module title in Arabic',
  })
  @IsString()
  @IsNotEmpty({ message: 'Arabic title is required' })
  @MaxLength(200)
  titleAr: string;

  @ApiPropertyOptional({
    example: 'Introduction to the course',
    description: 'Module description',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;
}
