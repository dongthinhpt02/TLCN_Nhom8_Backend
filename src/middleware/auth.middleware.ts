import { HttpStatus, Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Http2ServerRequest } from 'http2';
import { AuthController } from 'src/auth/auth.controller';
import { JwtService } from 'src/jwt/jwt.service';

export function isFalsyString(str: string) {
    str = str.trim().toLowerCase(); // handle whitespace and case
    if (str === 'null') return null;
    if (str === 'true') return true;
    if (str === 'false') return false;
    if (str === 'undefined') return undefined;

    return str;
}


@Injectable()
export class VerifyRefreshTokenMiddleware implements NestMiddleware {
    constructor(private readonly jwtService: JwtService) { }
    use(req: Request, res: Response, next: NextFunction) {
        const authorizationHeader = req.headers.authorization as string;
        const token = authorizationHeader?.replace('Bearer', '').trim();
         if (!token) {
        // if (!token) {
            // throw new UnauthorizedException('Token not provided');
            throw {
                statusCode: HttpStatus.UNAUTHORIZED,
                message: 'Token not provided'
            }
        }

        try {
            const decoded = this.jwtService.verifyToken(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } catch (err) {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}

@Injectable()
export class VerifyAccessTokenMiddleware implements NestMiddleware {
    constructor(private readonly jwtService: JwtService) { }
    use(req: Request, res: Response, next: NextFunction) {
        const authorizationHeader = req.headers.authorization as string;
        const token = authorizationHeader?.replace('Bearer', '').trim();
        if (!token) {
            // throw new UnauthorizedException('Token not provided');
            throw {
                statusCode: HttpStatus.UNAUTHORIZED,
                message: 'Token not provided'
            }
        }

        try {
            const decoded = this.jwtService.verifyToken(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } catch (err) {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}

