import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from 'src/jwt/jwt.service';
import { MongoClient, ObjectId } from 'mongodb'; // Sử dụng MongoClient và ObjectId từ mongodb
import { Status } from 'src/enum/enum.status.user';
import { v4 as uuidv4 } from 'uuid';
import { comparePasswords, hashPassword } from './hash.utils';
import {
  CreateCartDTO,
  CreateTokenDTO,
  CreateUserDTO,
} from 'src/DTOs/CreateUsers.Dto';
import { IsEmail, validateOrReject } from 'class-validator';
import { DatabaseService } from 'src/database/database.service';
import { TokenType } from 'src/enum/enum.token.user';
import { LoginDTO } from 'src/DTOs/LoginUsers.dto';
import { access } from 'fs';
import { Role } from 'src/enum/enum.role.user';
import { Gender } from 'src/enum/enum.gender.user';
import { CustomException } from 'src/exception/CustomException';

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

  private generateToken(
    user_id: ObjectId,
    tokenType: TokenType,
    expiredIn?: String,
  ) {
    return this.jwtService.signToken({
      payload: {
        user_id,
        type: tokenType,
      },
      options: {
        expiredIn: expiredIn ? expiredIn : process.env.JWT_REFRESH_EXPIRATION,
      },
    });
  }

  async getUserIdFromAccessToken(accessToken: string): Promise<string> {
    try {
      const decoded = await this.jwtService.verifyToken(accessToken);
      return decoded.payload.user_id;
    } catch (error) {
      new CustomException(error.message);
    }
  }

  async getUserIdFromAccessToken(accessToken: string): Promise<string> {
    try {
      const decoded = await this.jwtService.verifyToken(accessToken);
      return decoded.payload.user_id;
    } catch (error) {
      new CustomException(error.message);
    }
  }

  async register(createUserDto: CreateUserDTO) {
    try {
      const db = this.databaseService.getDb();
      const existUser = await db
        .collection('users')
        .findOne({ email: createUserDto.email });

      if (existUser) throw new CustomException('User already exists');

      const hashedPassword = await hashPassword(createUserDto.password);
      createUserDto.password = hashedPassword;

      const status = Status.ACTIVE;

      const dateOfBirth = new Date(createUserDto.dateOfBirth);

      const user = {
        status: status,
        dateOfBirth: dateOfBirth,
        password: createUserDto.password,
        createdAt: new Date(),
        ...createUserDto,
      };
      await this.databaseService.getDb().collection('users').insertOne(user);
      const [accessToken, refreshToken] = await Promise.all([
        this.generateToken(
          user._id,
          TokenType.AccessToken,
          process.env.JWT_ACCESS_EXPIRATION,
        ),
        this.generateToken(
          user._id,
          TokenType.RefreshToken,
          process.env.JWT_REFRESH_EXPIRATION,
        ),
      ]);

      const token = {
        ...createUserDto.token,
        user_id: user._id,
        refreshToken: refreshToken,
      };

      await this.jwtService.saveToken(user._id, refreshToken);

      const cart = {
        user_id: user._id,
        totalQuantity: createUserDto.cart?.totalQuantity || 0,
        totalPriceCart: createUserDto.cart?.totalPriceCart || 0,
      };
      const cartResult = await this.databaseService
        .getDb()
        .collection('carts')
        .insertOne(cart);

      return { accessToken, refreshToken };
    } catch (error) {
      new CustomException(error.message);
    }
  }

  async login(loginUserDto: LoginDTO) {
    try {
      const db = this.databaseService.getDb();
      const user = await db
        .collection('users')
        .findOne({ email: loginUserDto.email });
      if (!user) throw new CustomException('User not found');

      if (user.status === Status.INACTIVE)
        throw new CustomException('User is inactive');

      const isPasswordValid = await comparePasswords(
        loginUserDto.password,
        user.password,
      );

      if (!isPasswordValid) throw new CustomException('Invalid password');

      const [accessToken, refreshToken] = await Promise.all([
        this.generateToken(
          user._id,
          TokenType.AccessToken,
          process.env.JWT_ACCESS_EXPIRATION,
        ),
        this.generateToken(
          user._id,
          TokenType.RefreshToken,
          process.env.JWT_REFRESH_EXPIRATION,
        ),
      ]);

      await this.jwtService.saveToken(user._id, refreshToken);

      return { accessToken, refreshToken };
    } catch (error) {
      new CustomException(error.message);
    }
  }
  async googleLogin(googleUser: any): Promise<any> {
    try {
      const existingUser = await this.databaseService
        .getDb()
        .collection('users')
        .findOne({ email: googleUser.email });

      if (existingUser) {
        // return this.login({ email: existingUser.email, password: existingUser.password });
        const [accessToken, refreshToken] = await Promise.all([
          this.generateToken(
            existingUser._id,
            TokenType.AccessToken,
            process.env.JWT_ACCESS_EXPIRATION,
          ),
          this.generateToken(
            existingUser._id,
            TokenType.RefreshToken,
            process.env.JWT_REFRESH_EXPIRATION,
          ),
        ]);
        await this.jwtService.saveToken(existingUser._id, refreshToken);
        return { accessToken, refreshToken, user: existingUser };
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
      newUserDto.phoneNumber = null;

      const result = await this.databaseService
        .getDb()
        .collection('users')
        .insertOne({
          ...newUserDto,
          createdAt: new Date(),
        });

      const findUser = await this.databaseService
        .getDb()
        .collection('users')
        .findOne({ _id: result.insertedId });

      const [accessToken, refreshToken] = await Promise.all([
        this.generateToken(
          findUser._id,
          TokenType.AccessToken,
          process.env.JWT_ACCESS_EXPIRATION,
        ),
        this.generateToken(
          findUser._id,
          TokenType.RefreshToken,
          process.env.JWT_REFRESH_EXPIRATION,
        ),
      ]);

      await this.jwtService.saveToken(findUser._id, refreshToken);

      const cart = {
        user_id: findUser._id,
        totalQuantity: newUserDto.cart?.totalQuantity || 0,
        totalPriceCart: newUserDto.cart?.totalPriceCart || 0,
      };
      const cartResult = await this.databaseService
        .getDb()
        .collection('carts')
        .insertOne(cart);

      return { accessToken, refreshToken, user: findUser };
    } catch (error) {
      new CustomException(error.message);
    }
  }
  async logout(refreshtoken: string) {
    try {
      const existingToken = await this.databaseService
        .getDb()
        .collection('tokens')
        .findOne({ refreshtoken });

      console.log('Token exists in DB:', existingToken);
      if (!existingToken) {
        return {
          message: 'Token not found',
        };
      }

      await this.jwtService.deleteToken({ refreshtoken });

      console.log(refreshtoken);

      return { message: 'Logout successfully' };
    } catch (error) {
      new CustomException(error.message);
    }
  }
  async refresh_refreshToken(user_id: ObjectId) {
    try {
      const db = this.databaseService.getDb();
      const user = await db.collection('users').findOne({ _id: user_id });
      if (!user) throw new CustomException('User not found');

      const [accessToken, refreshToken] = await Promise.all([
        this.generateToken(
          user._id,
          TokenType.AccessToken,
          process.env.JWT_ACCESS_EXPIRATION,
        ),
        this.generateToken(
          user._id,
          TokenType.RefreshToken,
          process.env.JWT_REFRESH_EXPIRATION,
        ),
      ]);
      return { accessToken, refreshToken };
    } catch (error) {
      throw error;
    }
  }
}
