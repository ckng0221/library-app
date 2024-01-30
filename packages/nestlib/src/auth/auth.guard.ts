import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (process.env.NODE_ENV === 'test') return true;

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    const apiKey = this.extractApiKeyFromHeader(request);
    const actualAPIKey = process.env.API_KEY;
    if (actualAPIKey) {
      if (apiKey === process.env.API_KEY) return true;
    }

    if (!token) {
      throw new UnauthorizedException();
    }
    console.log(token);

    try {
      const authEndpoint = `${process.env.BASEURL_AUTH}/auth/verification`;
      // console.log('endpint', authEndpoint);

      const res = await fetch(authEndpoint, {
        method: 'POST',
        body: JSON.stringify({ token: token }),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (res.status !== 200) {
        throw new UnauthorizedException();
      }

      const data = await res.json();
      // console.log(data);

      if (data) {
        request['user'] = data;
      }
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
  private extractApiKeyFromHeader(request: Request) {
    const apiKey = request.headers['x-api-key'] || '';
    return apiKey;
  }
}
