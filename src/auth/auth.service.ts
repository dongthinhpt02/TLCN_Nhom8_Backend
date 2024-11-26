import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from 'src/jwt/jwt.service';
import { MongoClient, ObjectId } from 'mongodb';  // Sử dụng MongoClient và ObjectId từ mongodb
import { Status } from 'src/enum/enum.status.user';
import { v4 as uuidv4 } from 'uuid';
import { comparePasswords, hashPassword } from './hash.utils';
import { CreateCartDTO, CreateTokenDTO, CreateUserDTO } from 'src/DTOs/CreateUsers.Dto';
import { IsEmail, validateOrReject } from 'class-validator';
import { DatabaseService } from 'src/database/database.service';
import { TokenType } from 'src/enum/enum.token.user';
import { DaysService } from 'src/days/days.service';
import { LoginDTO } from 'src/DTOs/LoginUsers.dto';
import { access } from 'fs';
import { Role } from 'src/enum/enum.role.user';
import { Gender } from 'src/enum/enum.gender.user';


@Injectable()
export class AuthService {
  constructor(private readonly databaseService: DatabaseService,
    private readonly daysService: DaysService,
    private readonly jwtService: JwtService
  ) {

  }

  private generateToken(user_id: ObjectId, tokenType: TokenType, expiredIn?: String) {
    return this.jwtService.signToken({
      payload: {
        user_id,
        type: tokenType
      },
      options: {
        expiredIn: expiredIn ? expiredIn : process.env.JWT_REFRESH_EXPIRATION
      }
    });
  }

  async register(createUserDto: CreateUserDTO) {
    const db = this.databaseService.getDb();
    const existUser = await db.collection('users').findOne({ email: createUserDto.email });

    if (existUser) throw new ConflictException('User already exists');



    const hashedPassword = await hashPassword(createUserDto.password);
    createUserDto.password = hashedPassword;

    const status = Status.ACTIVE;



    const dateOfBirth = new Date(createUserDto.dateOfBirth);

    const user = {
      status: status,
      dateOfBirth: dateOfBirth,
      password: createUserDto.password,
      ...createUserDto
    }
    await this.databaseService.getDb().collection('users').insertOne(user)
    const [accessToken, refreshToken] = await Promise.all([
      this.generateToken(user._id, TokenType.AccessToken, process.env.JWT_ACCESS_EXPIRATION),
      this.generateToken(user._id, TokenType.RefreshToken, process.env.JWT_REFRESH_EXPIRATION)
    ]);

    const token = {
      ...createUserDto.token,
      user_id: user._id,
      refreshToken: refreshToken,
    }

    await this.jwtService.saveToken(user._id, refreshToken);

    const cart = {
      user_id: user._id,
      totalQuantity: createUserDto.cart?.totalQuantity || 0,
      totalPriceCart: createUserDto.cart?.totalPriceCart || 0,
    }
    const cartResult = await this.databaseService.getDb().collection('carts').insertOne(cart);

    return { accessToken, refreshToken }

  }

  async login(loginUserDto: LoginDTO) {
    const db = this.databaseService.getDb();
    const user = await db.collection('users').findOne({ email: loginUserDto.email });
    if (!user) throw new NotFoundException('User not found');

    if (user.status === Status.INACTIVE) throw new NotFoundException('User is inactive');

    const isPasswordValid = await comparePasswords(loginUserDto.password, user.password);

    if (!isPasswordValid) throw new NotFoundException('Invalid password');

    const [accessToken, refreshToken] = await Promise.all([
      this.generateToken(user._id, TokenType.AccessToken, process.env.JWT_ACCESS_EXPIRATION),
      this.generateToken(user._id, TokenType.RefreshToken, process.env.JWT_REFRESH_EXPIRATION)
    ]);

    await this.jwtService.saveToken(user._id, refreshToken);

    return { accessToken, refreshToken }
  }
  async googleLogin(googleUser: any): Promise<any> {
    const existingUser = await this.databaseService.getDb().collection('users').findOne({ email: googleUser.email });

    if (existingUser) {
      // return this.login({ email: existingUser.email, password: existingUser.password });
      const [accessToken, refreshToken] = await Promise.all([
        this.generateToken(existingUser._id, TokenType.AccessToken, process.env.JWT_ACCESS_EXPIRATION),
        this.generateToken(existingUser._id, TokenType.RefreshToken, process.env.JWT_REFRESH_EXPIRATION)
      ]);
      await this.jwtService.saveToken(existingUser._id, refreshToken);
      return { accessToken, refreshToken, user: existingUser }
    }

    const newUserDto = new CreateUserDTO();
    newUserDto.fullname = googleUser.name;
    newUserDto.avatar = googleUser.picture;
    newUserDto.email = googleUser.email;
    newUserDto.password = null; // Password not needed for OAuth
    newUserDto.gender = null; // Provide a default or parse gender from profile if available
    newUserDto.role = Role.MEMBER; // Default role
    newUserDto.status = Status.ACTIVE;
    newUserDto.dateOfBirth = null; // Replace if DOB is available in Google profile

    const result = await this.databaseService.getDb().collection('users').insertOne({
      ...newUserDto,
      createdAt: new Date(),
    });

    const findUser = await this.databaseService.getDb().collection('users').findOne({ _id: result.insertedId });


    const [accessToken, refreshToken] = await Promise.all([
      this.generateToken(findUser._id, TokenType.AccessToken, process.env.JWT_ACCESS_EXPIRATION),
      this.generateToken(findUser._id, TokenType.RefreshToken, process.env.JWT_REFRESH_EXPIRATION)
    ]);

    await this.jwtService.saveToken(findUser._id, refreshToken);

    const cart = {
      user_id: findUser._id,
      totalQuantity: newUserDto.cart?.totalQuantity || 0,
      totalPriceCart: newUserDto.cart?.totalPriceCart || 0,
    }
    const cartResult = await this.databaseService.getDb().collection('carts').insertOne(cart);

    return { accessToken, refreshToken, user: findUser }
  }
  async logout(refreshtoken: string) {

    const existingToken = await this.databaseService.getDb()
      .collection('tokens')
      .findOne({ refreshtoken });

    console.log('Token exists in DB:', existingToken);
    if (!existingToken) {
      return {
        message: 'Token not found'
      }
    }

    await this.jwtService.deleteToken({ refreshtoken });

    console.log(refreshtoken);

    return { message: 'Logout successfully' };
  }
  async refresh_refreshToken(user_id: ObjectId) {
    try {
      const db = this.databaseService.getDb();
      const user = await db.collection('users').findOne({ _id: user_id });
      if (!user) throw new NotFoundException('User not found');

      const [accessToken, refreshToken] = await Promise.all([
        this.generateToken(user._id, TokenType.AccessToken, process.env.JWT_ACCESS_EXPIRATION),
        this.generateToken(user._id, TokenType.RefreshToken, process.env.JWT_REFRESH_EXPIRATION)
      ]);
      return { accessToken, refreshToken }
    } catch (error) {
      throw error;
    }
  }
  // async getTokenByEmail(email: string) {
  //   const user = await this.userCollection.findOne({ email: email });
  //   if (!user || !user.tokenId) {
  //     throw new NotFoundException('Token not found');
  //   }

  //   const token = await this.tokenCollection.findOne({ tokenId: user.tokenId });
  //   return token.tokenId;
  // }

  // async login(email: string, password: string) {
  //   const user = await this.userCollection.findOne({ email: email });
  //   if (!user) throw new NotFoundException('User not found');

  //   if(user.status === Status.INACTIVE) throw new NotFoundException('User is inactive');

  //   const isPasswordValid = await comparePasswords(password, user.password);
  //   if (!isPasswordValid) throw new NotFoundException('Invalid password');

  //   const refreshToken = this.generateRefreshToken(user.userId);

  //   const refreshTokenExpiration = parseInt(process.env.JWT_REFRESH_EXPIRATION, 10) * 1000;
  //   const expiredUtcRefresh = new Date(Date.now() + refreshTokenExpiration);
  //   const expiredUtcPlus7Refresh = new Date(expiredUtcRefresh.getTime() + 7 * 60 * 60 * 1000);
  //   const expiredUtcPlus7RefreshMore = new Date(expiredUtcPlus7Refresh.getTime() + 7 * 24 * 60 * 60 * 1000);

  //   // Lấy tokenId từ DB
  //   const tokenId = await this.getTokenByEmail(user.email);

  //   // Cập nhật refresh token trong DB
  //   const updatedToken = await this.tokenCollection.updateOne(
  //     { tokenId: tokenId },
  //     {
  //       $set: {
  //         refreshToken: refreshToken,
  //         expired: expiredUtcPlus7RefreshMore,
  //       },
  //     },
  //   );
  //   if (updatedToken.modifiedCount === 0) {
  //     throw new Error('Token update failed or token not found.');
  //   }

  //   return {
  //     expiredUtcPlus7RefreshMore,
  //     refreshToken,
  //     userId: user.userId,
  //     email: user.email,
  //   };
  // }
}
