import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/schemas/users.schema';

@Injectable()
export class JwtAuthService {
  constructor(private jwtService: JwtService) {}

  async  generateAccessToken(user: User): Promise<string> {
    const payload = { userId: user.userId, email: user.email };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET, // Use environment variables for secrets
      expiresIn: '15m', // Access token expires in 15 minutes
    });
  }

async generateRefreshToken(user: User): Promise<string> {
    const payload = { userId: user.userId };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET, // Use a different secret for refresh token
      expiresIn: '7d', // Refresh token expires in 7 days
    });
  }
}
