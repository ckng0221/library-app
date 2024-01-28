import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ReadCustomerDto } from '../../customer/src/dto/customer.dto';
import bcrypt from 'bcrypt';

interface ICustomerCred {
  _id: string;
  customer: ReadCustomerDto;
  password: string;
}

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
    const endpoint = `${customerHost}/customer-credentials`;
    const res = await fetch(
      `${endpoint}?` +
        new URLSearchParams({
          email: email,
        }),
    );

    const customerCreds: ICustomerCred[] = await res.json();
    // console.log(customerCreds);

    if (customerCreds.length <= 0) {
      console.log('customer not found');

      throw new UnauthorizedException('Email or password is wrong');
    }
    // console.log(customerCreds);

    return customerCreds[0];
  }

  async signIn(email: string, pass: string): Promise<{ access_token: string }> {
    const user = await this.getUser(email);

    const passwordValid = await bcrypt.compare(pass, user.password);

    if (!passwordValid) {
      throw new UnauthorizedException('Email or password is wrong');
    }
    const payload = {
      sub: user.customer?._id,
      name: user.customer?.name,
      email: user.customer?.email,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async verifyToken(token: string) {
    return this.jwtService.verifyAsync(token);
  }
}
