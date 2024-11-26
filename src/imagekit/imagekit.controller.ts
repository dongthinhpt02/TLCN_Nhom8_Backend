import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ImageKitService } from './imagekit.service';

@Controller('imagekit')
export class ImageKitController {
    constructor(private readonly imageKitService: ImageKitService) {}

    @Post('request-upload-token')
    async requestUploadToken(@Body() payload: any) {
        const result = await this.imageKitService.generateImageKitToken(payload);
        return {
            status: HttpStatus.OK,
            message: 'Success',
            data: result,
        };
        
    }
}
