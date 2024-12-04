import { Body, Controller, Post, UsePipes, ValidationPipe, Headers } from '@nestjs/common';
import { CartitemService } from './cartitem.service';
import { CreateCartItemDTO } from 'src/DTOs/CreateCartItem.dto';
import { CustomException } from 'src/exception/CustomException';

@Controller('cartitem')
export class CartitemController {
    constructor(private readonly cartItemService: CartitemService) { }

    @Post('create')
    @UsePipes(new ValidationPipe())
    async createCartItem(@Headers('Authorization') authorization: string,
        @Body() createCartItemDTO: CreateCartItemDTO) {
        if (!authorization || !authorization.startsWith('Bearer ')) {
            // throw new UnauthorizedException('Authorization header is missing or invalid');
            throw new CustomException('Authorization header is missing or invalid');
        }
        const newCartItem = {
            ...createCartItemDTO
        }
        return await this.cartItemService.createCartItem(newCartItem);
    }
}
