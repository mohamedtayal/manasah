import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: process.env.NODE_ENV === 'development' 
        ? ['query', 'info', 'warn', 'error']
        : ['error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
    console.log('📦 Database connected');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('📦 Database disconnected');
  }

  async cleanDatabase() {
    if (process.env.NODE_ENV !== 'production') {
      // Delete all data in development/test
      const models = Reflect.ownKeys(this).filter((key) => {
        return (
          typeof key === 'string' &&
          !key.startsWith('_') &&
          !key.startsWith('$') &&
          typeof (this as any)[key]?.deleteMany === 'function'
        );
      });

      return Promise.all(
        models.map((model) => (this as any)[model].deleteMany()),
      );
    }
  }
}
