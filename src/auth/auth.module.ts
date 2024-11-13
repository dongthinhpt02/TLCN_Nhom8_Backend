import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/users.module'; 
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/users.schema';
import { Token, TokenSchema } from 'src/schemas/token.schema';
import { Cart, CartSchema } from 'src/schemas/cart.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema
      },
      {
        name : Token.name,
        schema : TokenSchema
      },
      {
        name : Cart.name,
        schema : CartSchema
      },
    ]),
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET || 'nhuomdotroiau', // Đặt secret key của bạn ở đây
      signOptions: { expiresIn: '1h' }, // Thời gian hết hạn token
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
