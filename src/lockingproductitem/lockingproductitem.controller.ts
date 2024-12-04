import { Controller, Post, UsePipes, ValidationPipe, Headers, Body } from '@nestjs/common';
import { LockingproductitemService } from './lockingproductitem.service';
import { CreateLockingProductItemDTO } from 'src/DTOs/CreateLockingProductItem.dto';
import { CustomException } from 'src/exception/CustomException';
import { ObjectId } from 'mongodb';

@Controller('lockingproductitem')
export class LockingproductitemController {

    constructor(private readonly lockingProductItemService : LockingproductitemService){}

    @Post('create')
    @UsePipes(new ValidationPipe())
    async createLockingProduct(@Headers('Authorization') authorization: string,
        @Body() createLockingProductDTO: CreateLockingProductItemDTO) {
        if (!authorization || !authorization.startsWith('Bearer ')) {
            // throw new UnauthorizedException('Authorization header is missing or invalid');
            throw new CustomException('Authorization header is missing or invalid');
        }
        const newLocking = {
            ...createLockingProductDTO,
            productItemId : new ObjectId(createLockingProductDTO.productItemId),
            orderDetailId : new ObjectId(createLockingProductDTO.orderDetailId)
        };
        return this.lockingProductItemService.createLockingProductItem(newLocking);
    }
}
