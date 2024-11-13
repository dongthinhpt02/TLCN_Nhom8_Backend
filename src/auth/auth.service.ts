import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDTO } from 'src/DTOs/CreateUses.Dto';
import { Status } from 'src/enum/enum.status.user';
import { Cart } from 'src/schemas/cart.schema';
import { Token } from 'src/schemas/token.schema';
import { User } from 'src/schemas/users.schema';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {

    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Token.name) private tokenModel: Model<Token>,
        @InjectModel(Cart.name) private cartModel: Model<Cart>,
        private jwtService: JwtService) { }

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


    async createUser(createUserDto: CreateUserDTO) {

       

        const cartId = uuidv4();
        const cart = new this.cartModel({
            cartId: cartId,
            totalQuantity: createUserDto.cart?.totalQuantity || 0,
            totalPriceCart: createUserDto.cart?.totalPriceCart || 0,
        });
        await cart.save();

        const userId = uuidv4();

        const status = Status.ACTIVE;
       
        const tokenId = uuidv4();
        const token = new this.tokenModel({
            tokenId: tokenId,
            refreshToken: createUserDto.token?.refreshToken || null,
            expired: createUserDto.token?.expired || null,
        });
        await token.save();

        const newUser = new this.userModel({ userId, cartId, tokenId, status, ...createUserDto });

        return newUser.save();
    }
}
