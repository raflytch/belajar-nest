/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma/prisma.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private prismaService: PrismaService) {}
  async use(req: any, res: any, next: () => void) {
    const username = req.headers['x-username'] as string;
    if (!username) {
      throw new HttpException('Username not found', 401);
    }

    const user = await this.prismaService.user.findUnique({
      where: {
        id: username,
      },
    });

    if (user) {
      req.user = user;
    } else {
      throw new HttpException('User not found', 401);
    }
    next();
  }
}
