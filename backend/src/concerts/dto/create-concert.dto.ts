import { IsString, IsInt, IsNotEmpty, Min, MaxLength } from 'class-validator';

export class CreateConcertDto {
  @IsString()
  @IsNotEmpty({ message: 'Concert name is required' })
  @MaxLength(255, { message: 'Concert name must not exceed 255 characters' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Description is required' })
  description: string;

  @IsInt({ message: 'Total seats must be an integer' })
  @Min(1, { message: 'Total seats must be at least 1' })
  totalSeats: number;
}
