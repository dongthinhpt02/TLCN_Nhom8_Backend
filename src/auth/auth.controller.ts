import { Body, Controller, Get, Header, Headers, HttpStatus, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateCartDTO, CreateTokenDTO, CreateUserDTO } from 'src/DTOs/CreateUsers.Dto';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { LoginDTO } from 'src/DTOs/LoginUsers.dto';
import { GoogleGuard } from './google.guard';
import { JwtStrategy } from './jwt.strategy';
import { STATUS_CODES } from 'http';
import { ObjectId} from 'mongodb';
import { any } from 'joi';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }
    @Post('register')
    @UsePipes(new ValidationPipe())
    createUser(@Body() createUserDto: CreateUserDTO) {

        const result = this.authService.register(createUserDto)

        return result;
    }
    @Post('login')
    @UsePipes(new ValidationPipe())
    async login(@Body() loginDto: LoginDTO) {
        const { email, password } = loginDto;
        return this.authService.login({ email, password });
    }
    @Post('logout')
    async logout(@Headers('Authorization') authorization: string) {
        const refreshtoken = authorization.split(' ')[1];
        console.log(refreshtoken);
        return this.authService.logout(refreshtoken);
    }
    @Post('refresh_refreshToken')
    async refresh_refreshToken(@Body() user_id: ObjectId) {
        return this.authService.refresh_refreshToken(user_id);
    }

    @Get('google/login')
    @UseGuards(GoogleGuard)
    handleLogin() {
        return { msg: 'Google Authentication' };
    }


    @Get('google/redirect')
    @UseGuards(GoogleGuard)
    async googleAuthRedirect(@Req() req) {
        // The `req.user` object will contain the authenticated user's information
        return this.authService.googleLogin(req.user);
    }

    @Get('profile')
    @UseGuards(JwtStrategy)
    getProfile(@Req() req) {
        return req.user;
    }
}
