import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Date } from "mongoose";
import { Gender } from "src/enum/enum.gender.user";
import { Role } from "src/enum/enum.role.user";
import { Token } from "./token.schema";
import { Cart } from "./cart.schema";
import { Status } from "src/enum/enum.status.user";

@Schema()
export class User{
    @Prop({require : true, unique : true})
    userId : string

    @Prop({require : true})
    fullname : string

    @Prop({})
    avatar : string

    @Prop({require : true ,email : true, unique : true})
    email : string

    @Prop({})
    password : string

    @Prop({require : true, enum : Gender, default : Gender.MALE})
    gender : Gender

    @Prop({type : Date})
    dateOfBirth : Date

    @Prop({require : true, enum : Role, default : Role.MEMBER})
    role : Role

    // @Prop({require : true, enum : Status, default : Status.ACTIVE})
    // status : Status

    @Prop({
        type: Number,
        enum: [Status.ACTIVE, Status.INACTIVE], // Ensure this is pointing to numeric values
        default: Status.ACTIVE,  // Default to Active
      })
      status: Status;

    @Prop({type : mongoose.Schema.Types.ObjectId, ref : 'Token'})
    token : Token

    @Prop({type : mongoose.Schema.Types.ObjectId, ref : 'Cart'})
    cart : Cart
}
export const UserSchema = SchemaFactory.createForClass(User);