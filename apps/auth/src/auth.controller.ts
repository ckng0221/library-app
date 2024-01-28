import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, VerificationDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: AuthDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @HttpCode(HttpStatus.OK)
  @Post('verfication')
  async verifyToken(@Body() verificationDto: VerificationDto) {
    if (!verificationDto.token)
      throw new UnprocessableEntityException('Token cannot be empty');

    try {
      return await this.authService.verifyToken(verificationDto.token);
    } catch (err) {
      console.error(err);

      throw new UnauthorizedException();
    }
  }
}
