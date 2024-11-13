import { Body, Controller, Get, Post, Req, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { Request, Response } from 'express';
import { CreateUserDTO } from 'src/DTOs/CreateUses.Dto';
import { UsersService } from './users.service';
@Controller('users')
export class UsersController {
    constructor(private userService : UsersService){}
    @Post()
    @UsePipes(new ValidationPipe())
    createUser(@Body() createUserDto : CreateUserDTO){

        console.log(createUserDto);
        console.log(createUserDto.userId);

        return this.userService.createUser(createUserDto);
    }
}
