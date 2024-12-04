import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateNewsDTO } from 'src/DTOs/CreateNews.dto';
import { Status } from 'src/enum/enum.status.user';
import { CustomException } from 'src/exception/CustomException';
import { ObjectId } from 'mongodb';

@Injectable()
export class NewsService {
    constructor(private readonly databaseService : DatabaseService){}
    async createNews(createNewsDTO : CreateNewsDTO){
        try {
            const db = this.databaseService.getDb();
            const status = Status.ACTIVE;
            const newNews = {
                ...createNewsDTO,
                status,
                createdAt: new Date(),
                updatedAt: null,
                deletedAt: null,
            };
            await db.collection('news').insertOne(newNews);
            return newNews;
        } catch (error) {
            throw new CustomException(error.message);
        }
    }
    async updateNews(updateNewsDTO : CreateNewsDTO){
        try {
            const db = this.databaseService.getDb();
            const updateNews = {
                ...updateNewsDTO,
                updatedAt: new Date(),
            }
            console.log(updateNews);
            await db.collection('news').updateOne({ _id: new ObjectId(updateNewsDTO._id) }, { $set: updateNews });

            return updateNews;

        } catch (error) {
            throw new CustomException(error.message);
        }
    }
    async lockNews(id: string) {
        try {
            const db = this.databaseService.getDb();
            const result = await db.collection('news').updateOne(
                { _id: new ObjectId(id) },
                {
                    $set: {
                        status: Status.INACTIVE,
                        deletedAt: new Date()
                    }
                },
            );
            if (result.modifiedCount === 0) {
                throw new CustomException('Failed to lock news or news not found');
            }
            return { message: 'News locked successfully' };
        } catch (error) {
            throw new CustomException(error.message)
        }
    }
    async restoreNews(id: string) {
        try {
            const db = this.databaseService.getDb();
            const result = await db.collection('news').updateOne(
                { _id: new ObjectId(id) },
                {
                    $set: {
                        status: Status.ACTIVE
                    }
                },
            );
            if (result.modifiedCount === 0) {
                throw new CustomException('Failed to restore news or news not found');
            }
            return { message: 'News restored successfully' };
        } catch (error) {
            throw new CustomException(error.message)
        }
    }
    async getAllNews() {
        try {
            const db = this.databaseService.getDb();
            const getAllNews = await db.collection('news').find().toArray();
            return getAllNews;
        } catch (error) {
            throw new CustomException(error.message);
        }
    }
    async getAllActiveNews() {
        try {
            const db = this.databaseService.getDb();
            const getAllActiveNews = await db.collection('news').find(
                {
                    status: Status.ACTIVE
                }
            )
            .toArray();
            return getAllActiveNews;
        } catch (error) {
            throw new CustomException(error.message);
        }
    }
    async getDetailNews(id : string){
        try {
            const db = this.databaseService.getDb()
            const getDetailNews = await db.collection('news').findOne({
                _id : new ObjectId(id),
            });
            return getDetailNews;
        } catch (error) {
            throw new CustomException(error.message)
        }
    }
}
