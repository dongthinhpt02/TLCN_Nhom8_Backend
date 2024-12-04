import { Body, Controller, Post, UsePipes, ValidationPipe, Headers, Param } from '@nestjs/common';
import { CartitemService } from './cartitem.service';
import { CartItem, CreateCartItemDTO } from 'src/DTOs/CreateCartItem.dto';
import { CustomException } from 'src/exception/CustomException';
import { ObjectId } from 'mongodb';

@Controller('cartitem')
export class CartitemController {
    constructor(private readonly cartItemService: CartitemService) { }

    @Post('create')
    @UsePipes(new ValidationPipe())
    async createCartItem(@Headers('Authorization') authorization: string,
        @Body() cartItem : CartItem) {
        if (!authorization || !authorization.startsWith('Bearer ')) {
            // throw new UnauthorizedException('Authorization header is missing or invalid');
            throw new CustomException('Authorization header is missing or invalid');
        }
        const newCartItem = {
            ...cartItem
        }
        return await this.cartItemService.createCartItem(newCartItem);
    }

    //Phải gửi đủ cartId, price, quantity
    @Post('update/:id')
    async updateCartItem(@Param('id') id: string,
        @Headers('Authorization') authorization: string,
        @Body() updateCartItemDTO : CreateCartItemDTO) {
        if (!authorization || !authorization.startsWith('Bearer ')) {
            // throw new UnauthorizedException('Authorization header is missing or invalid');
            throw new CustomException('Authorization header is missing or invalid');
        }
        const updateCartItem = {
            ...updateCartItemDTO,
            _id: new ObjectId(id)
        }
        return await this.cartItemService.updateCartItem(updateCartItem);
    }

    @Post('delete/:id')
    async deleteCartItem(@Param('id') id: string,
        @Headers('Authorization') authorization: string) {
        if (!authorization || !authorization.startsWith('Bearer ')) {
            // throw new UnauthorizedException('Authorization header is missing or invalid');
            throw new CustomException('Authorization header is missing or invalid');
        }
        return await this.cartItemService.deleteCartItem(id);
    }
}
