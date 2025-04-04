import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      log: ['query', 'info', 'warn'],
    });
    console.log('PrismaService initialized');
  }

  onModuleInit() {
    console.log('PrismaService module initialized');
    this.$connect()
      .then(() => {
        console.log('Connected to the database');
      })
      .catch((error) => {
        console.error('Error connecting to the database', error);
      });
  }

  onModuleDestroy() {
    console.log('PrismaService module destroyed');
    this.$disconnect()
      .then(() => {
        console.log('Disconnected from the database');
      })
      .catch((error) => {
        console.error('Error disconnecting from the database', error);
      });
  }
}
