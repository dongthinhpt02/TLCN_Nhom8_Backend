import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { MongoClient, Db } from 'mongodb';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private client: MongoClient;
  private db: Db;

  constructor() {
    const uri = 'mongodb://localhost:27017';
    this.client = new MongoClient(uri);
  }

  async onModuleInit() {
    await this.client.connect();
    this.db = this.client.db('cau_long_shop'); 
    //console.log('Connected to MongoDB');
  }

  getDb(): Db {
    return this.db;
    console.log('sử dụng db');
  }

  async onModuleDestroy() {
    // Đóng kết nối khi ứng dụng dừng
    await this.client.close();
  }
}
