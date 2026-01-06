import { IsArray, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReorderDto {
  @ApiProperty({
    example: ['uuid1', 'uuid2', 'uuid3'],
    description: 'Array of IDs in the desired order',
  })
  @IsArray()
  @IsUUID('4', { each: true })
  ids: string[];
}
