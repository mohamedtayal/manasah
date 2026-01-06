import { IsInt, IsBoolean, IsOptional, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProgressDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  @ApiPropertyOptional({ description: 'Watch time in seconds', example: 120 })
  watchTime?: number;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ description: 'Mark lesson as completed', example: true })
  completed?: boolean;
}
