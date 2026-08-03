import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client.js';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const url = process.env.DATABASE_URL ?? 'postgresql://admin:adminpassword@localhost:5433/ecommerce_db?schema=inventory';

    //adapter de Postgres
    const adapter = new PrismaPg({ connectionString: url });

    super({
      adapter,
    });
  }

  async onModuleInit() {
    await this.$connect();
    console.log('🔌 Conectado exitosamente a PostgreSQL (Inventory DB) desde NestJS');
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}