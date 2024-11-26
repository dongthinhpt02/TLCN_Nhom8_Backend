import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb'
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class JwtService {
  private readonly secret: string;

  constructor(private readonly databaseService: DatabaseService,
  ) {
    this.secret = process.env.JWT_SECRET;
  }

  async signToken(payload: string | object | Buffer, pk: string = this.secret, options: jwt.SignOptions = {}): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      jwt.sign(payload, pk, options, (error, token) => {
        if (error) {
          reject(new UnauthorizedException('Signing Fail'));
        }
        resolve(token!);
      });
    });
  }

  async verifyToken(token: string, pk: string = this.secret, options: jwt.VerifyOptions = {}): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      jwt.verify(token, pk, options, (error, decoded) => {
        if (error) {
          reject(new UnauthorizedException('Invalid Token'));
        }
        resolve(decoded);
      });
    });
  }
  async saveToken(user_id: ObjectId, refreshtoken: string) {
    try {
      const createdToken = await this.databaseService.getDb().collection('tokens').insertOne({
        user_id,
        refreshtoken,
        createdAt : new Date()
      })
      return createdToken;
    } catch (error) {
      throw new Error('Error saving token')
    }
  }
  async deleteToken({ refreshtoken }: { refreshtoken: string }) {
    try {
      const deleteToken = await this.databaseService.getDb().collection('tokens').deleteOne({refreshtoken})
      return deleteToken;
    } catch (error) {
      throw new Error('Error deleting token')
    }
  }
}
