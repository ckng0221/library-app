import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
export class AuthDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    example: 'name@email.com',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'userpassword',
  })
  password: string;
}
