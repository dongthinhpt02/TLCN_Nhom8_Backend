import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateUserDTO } from 'src/DTOs/CreateUses.Dto';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService : AuthService){}
    @Post('register')
    @UsePipes(new ValidationPipe())
    createUser(@Body() createUserDto : CreateUserDTO){
        
        console.log(createUserDto);

        return this.authService.createUser(createUserDto);

       
    }
}
