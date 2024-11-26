import { Injectable } from '@nestjs/common';

@Injectable()
export class DaysService {
    async UTCplus7(date: Date) {
        const dateUtc = new Date(date);
        const dateUtcPlus7 = new Date(dateUtc.getTime() + 7 * 60 * 60 * 1000);
        return dateUtcPlus7;
    }
}
