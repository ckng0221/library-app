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

export class VerificationDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NTU5NzZjNTU1NDIyNGFmODUxOWE3MjQiLCJuYW1lIjoiTXkgQ3VzdG9tZXIiLCJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20iLCJpYXQiOjE3MDY1OTIzMzd9.OPhJR0uEnlB-VX2N4kTZLcMMXIbXiJSACIKAG8xy_DA',
  })
  token: string;
}
