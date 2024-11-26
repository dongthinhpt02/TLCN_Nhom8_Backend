import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly authService: AuthService) {
    super();
  }

  serializeUser(user: any, done: (err: Error, user: any) => void): void {
    done(null, user); // Save the user object in the session
  }

  async deserializeUser(payload: any, done: (err: Error, user: any) => void): Promise<void> {
    done(null, payload); // Retrieve the user object from the session
  }
}
