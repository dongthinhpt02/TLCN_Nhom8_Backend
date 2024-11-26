import { Injectable } from '@nestjs/common';

import { JwtService } from 'src/jwt/jwt.service';
import type { UploadOptions } from 'imagekit/dist/libs/interfaces'
import { DatabaseService } from 'src/database/database.service';
import ImageKit from 'imagekit';



// type RequestTokenPayload = { uploadPayload: {}, expire: string, publicKey: string }
type RequestTokenPayload = { uploadPayload: Omit<UploadOptions, 'file' | 'token'> }
@Injectable()
export class ImageKitService {
 
 
 // private readonly uploadOptions: UploadOptions;
  constructor(  private readonly jwtService: JwtService,
    private readonly databaseService: DatabaseService,
    // private readonly imageKit: ImageKit
    
  ) {
    // this.imageKit = new ImageKit({
    //   publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    //   privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    //   urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
    // });
  }

  
  async generateImageKitToken(payload : RequestTokenPayload): Promise<string> {
    try {
      const token = this.jwtService.signToken(
        payload.uploadPayload,
        process.env.IMAGEKIT_PRIVATE_KEY,
        {
          expiresIn: process.env.IMAGEKIT_TOKEN_EXPIRE, // BE quy định lun 
          algorithm: 'HS256',
          header: {
            alg: 'HS256',
            typ: 'JWT',
            kid: process.env.IMAGEKIT_PUBLIC_KEY, 
          },
        }
      );
      return token;
    } catch (error) {
      throw new Error(error);
    }
  }

  // async requestUploadToken(payload: RequestTokenPayload) {
  //   const token = await this.generateImageKitToken(
  //     payload.uploadPayload,
  //     payload.expire,
  //     process.env.IMAGEKIT_PUBLIC_KEY,
  //   );
  //   return token;
  // }
  // async test() {
  //   this.uploadOptions = {
  //     file: 'https://ik.imagekit.io/demo/tr:n-tr:w-400/sample.jpg',
  //     fileName: 'sample.jpg',
  //   }
  //   const result = await this.imageKit.upload(this.uploadOptions);
  //   return result;
  // }
}
