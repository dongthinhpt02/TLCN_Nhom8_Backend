import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { ImageKitService } from './imagekit/imagekit.service';
import { JwtService } from './jwt/jwt.service';
import { JwtController } from './jwt/jwt.controller';
import { JwtModule } from './jwt/jwt.module';
import { DatabaseService } from './database/database.service';
import { DaysService } from './days/days.service';
import { DaysModule } from './days/days.module';
import { DatabaseModule } from './database/database.module';
import { ImageKitController } from './imagekit/imagekit.controller';
import { ImageKitModule } from './imagekit/imagekit.module';
import { AuthController } from './auth/auth.controller';
import { AddressService } from './address/address.service';
import { AddressController } from './address/address.controller';
import { AddressModule } from './address/address.module';

@Module({
  imports: 
  [
    ConfigModule.forRoot({
      isGlobal: true, // Load toàn cục
    }),UsersModule, AuthModule,
    JwtModule,
    DaysModule,
    DatabaseModule,
    ImageKitModule,
    AddressModule,
  ],
  controllers: [AppController, JwtController, ImageKitController, AuthController, AddressController],
  providers: [AppService, JwtService, ImageKitService, DatabaseService, DaysService, AddressService],
  exports: [DatabaseService, JwtService]
})
export class AppModule {}
