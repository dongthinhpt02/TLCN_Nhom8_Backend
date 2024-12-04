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
import { BrandService } from './brand/brand.service';
import { BrandModule } from './brand/brand.module';
import { CategoryService } from './category/category.service';
import { CategoryController } from './category/category.controller';
import { CategoryModule } from './category/category.module';
import { SizeService } from './size/size.service';
import { SizeController } from './size/size.controller';
import { SizeModule } from './size/size.module';
import { ColorService } from './color/color.service';
import { ColorController } from './color/color.controller';
import { ColorModule } from './color/color.module';
import { NewsService } from './news/news.service';
import { NewsController } from './news/news.controller';
import { NewsModule } from './news/news.module';
import { PromotionService } from './promotion/promotion.service';
import { PromotionController } from './promotion/promotion.controller';
import { PromotionModule } from './promotion/promotion.module';
import { ProductService } from './product/product.service';
import { ProductController } from './product/product.controller';
import { ProductModule } from './product/product.module';
import { ProductitemService } from './productitem/productitem.service';
import { ProductitemController } from './productitem/productitem.controller';
import { ProductitemModule } from './productitem/productitem.module';
import { PaymentmethodService } from './paymentmethod/paymentmethod.service';
import { PaymentmethodController } from './paymentmethod/paymentmethod.controller';
import { PaymentmethodModule } from './paymentmethod/paymentmethod.module';
import { CartitemService } from './cartitem/cartitem.service';
import { CartitemController } from './cartitem/cartitem.controller';
import { CartitemModule } from './cartitem/cartitem.module';
import { LockingproductitemService } from './lockingproductitem/lockingproductitem.service';
import { LockingproductitemController } from './lockingproductitem/lockingproductitem.controller';
import { LockingproductitemModule } from './lockingproductitem/lockingproductitem.module';

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
    BrandModule,
    CategoryModule,
    SizeModule,
    ColorModule,
    NewsModule,
    PromotionModule,
    ProductModule,
    ProductitemModule,
    PaymentmethodModule,
    CartitemModule,
    LockingproductitemModule,
  ],
  controllers: [AppController, JwtController, ImageKitController, AuthController, AddressController, CategoryController, SizeController, ColorController, NewsController, PromotionController, ProductController, ProductitemController, PaymentmethodController, CartitemController, LockingproductitemController],
  providers: [AppService, JwtService, ImageKitService, DatabaseService, DaysService, AddressService, BrandService, CategoryService, SizeService, ColorService, NewsService, PromotionService, ProductService, ProductitemService, PaymentmethodService, CartitemService, LockingproductitemService],
  exports: [DatabaseService, JwtService]
})
export class AppModule {}
