import { Injectable } from '@nestjs/common';
import {v4 as uuidv4} from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDTO } from 'src/DTOs/CreateUses.Dto';
import { User } from 'src/schemas/users.schema';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>){}
    async createUser(createUserDto : CreateUserDTO){
        const userId = uuidv4();
        const newUser = new this.userModel({userId, ...createUserDto});
       //const newUser = new this.userModel(createUserDto);
       
        console.log(userId);

        return newUser.save();
    }
}
