import { Controller, Post, UsePipes, ValidationPipe, Headers, Body, Param, Get } from '@nestjs/common';
import { PaymentmethodService } from './paymentmethod.service';
import { CreatePaymentMethodDTO } from 'src/DTOs/CreatePaymentMethod.dto';
import { CustomException } from 'src/exception/CustomException';
import { ObjectId } from 'mongodb';

@Controller('paymentmethod')
export class PaymentmethodController {
    constructor(private readonly paymentmethodService : PaymentmethodService){}

    @Post('create')
    @UsePipes(new ValidationPipe())
    async createPaymentMethod(@Headers('Authorization') authorization: string,
        @Body() createPaymentMethodDTO: CreatePaymentMethodDTO) {
        if (!authorization || !authorization.startsWith('Bearer ')) {
            // throw new UnauthorizedException('Authorization header is missing or invalid');
            throw new CustomException('Authorization header is missing or invalid');
        }
        const newPaymentMethod = {
            ...createPaymentMethodDTO,
        };
        return this.paymentmethodService.createPaymentMethod(newPaymentMethod);
    }

    @Post('update/:id')
    @UsePipes(new ValidationPipe())
    async updatePaymentMethod(@Param('id') id: string,
        @Headers('Authorization') authorization: string,
        @Body() updatePaymentMethodDTO: CreatePaymentMethodDTO,) {
        if (!authorization || !authorization.startsWith('Bearer ')) {
            // throw new UnauthorizedException('Authorization header is missing or invalid');
            throw new CustomException('Authorization header is missing or invalid');
        }
        const updatePaymentMethod = {
            ...updatePaymentMethodDTO,
            _id: new ObjectId(id),
        }
        return this.paymentmethodService.updatePaymentMethod(updatePaymentMethod);
    }

    @Post('lock/:id')
    @UsePipes(new ValidationPipe())
    async lockPaymentMethod(@Param('id') id: string,
        @Headers('Authorization') authorization: string) {
        if (!authorization || !authorization.startsWith('Bearer ')) {
            throw new CustomException('Authorization header is missing or invalid');
        }
        return this.paymentmethodService.lockPaymentMethod(id);
    }
    @Post('restore/:id')
    @UsePipes(new ValidationPipe())
    async restorePaymentMethod(@Param('id') id: string,
        @Headers('Authorization') authorization: string) {
        if (!authorization || !authorization.startsWith('Bearer ')) {
            throw new CustomException('Authorization header is missing or invalid');
        }
        return this.paymentmethodService.restorePaymentMethod(id);
    }
    @Get('allpaymentmethod')
    @UsePipes(new ValidationPipe())
    async getAllPaymentMethod(@Headers('Authorization') authorization: string) {
        if (!authorization || !authorization.startsWith('Bearer ')) {
            throw new CustomException('Authorization header is missing or invalid');
        }
        return this.paymentmethodService.getAllPaymentMethod();
    }
    @Get('allactivepaymentmethod')
    @UsePipes(new ValidationPipe())
    async getAllActivePaymentMethod(@Headers('Authorization') authorization: string) {
        if (!authorization || !authorization.startsWith('Bearer ')) {
            throw new CustomException('Authorization header is missing or invalid');
        }
        return this.paymentmethodService.getAllActivePaymentMethod();
    }
    @Get('detail/:id')
    @UsePipes(new ValidationPipe())
    async getDetailPaymentMethod(@Param('id') id: string,
        @Headers('Authorization') authorization: string) {
        if (!authorization || !authorization.startsWith('Bearer ')) {
            throw new CustomException('Authorization header is missing or invalid');
        }
        return this.paymentmethodService.getDetailPaymentMethod(id);
    }
}
