import { ObjectId } from 'mongodb';
import { Gender } from 'src/enum/enum.gender.user';
import { Status } from 'src/enum/enum.status.user';

export class User {
  _id?: ObjectId;       
  fullname: string;    
  avatar: string;       
  email: string;       
  password: string;    
  gender: Gender;       
  dateOfBirth: Date;
  phoneNumber : string;   
  role: string;         
  status: Status;
  createdAt?: Date = new Date();
  updatedAt?: Date;
  deletedAt?: Date;
}
