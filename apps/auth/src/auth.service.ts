import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async getUser(email: string) {
    const customerHost = this.configService.get(
      'CUSTOMER_SERVICE_HOST' || 'http://localhost:8002',
    );
    const endpoint = `${customerHost}/customers?search=${email}`;
    const res = await fetch(endpoint);
    const customers: object[] = await res.json();
    if (customers.length <= 0) {
      console.log('customer not found');

      throw new UnauthorizedException('Email or password is wrong');
    }
    console.log(customers);

    return customers[0];
  }

  async signIn(email: string, pass: string): Promise<{ access_token: string }> {
    // const user = await this.usersService.findOne(username);
    // const user = await this.getUser(email);
    await this.getUser(email);

    const user = { _id: 1, username: 'ck', password: '123' };

    if (user?.password !== pass) {
      throw new UnauthorizedException('Email or password is wrong');
    }
    const payload = { sub: user._id, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
