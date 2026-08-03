import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  // Establece o actualiza el stock inicial para una variante
  async setStock(variantId: string, stock: number) {
    return this.prisma.inventory.upsert({
      where: { variantId },
      update: { stock },
      create: { variantId, stock },
    });
  }

  async getStock(variantId: string) {
    const record = await this.prisma.inventory.findUnique({
      where: { variantId },
    });
    if (!record) {
      throw new NotFoundException(`No hay registro de inventario para la variante ${variantId}`);
    }
    return record;
  }

  // Descuenta el stock cuando se recibe el evento order.created
  async processOrderCreated(orderPayload: any) {
    const items = orderPayload.items || [];
    console.log(`📦 Procesando descuento de inventario para la Orden ID: ${orderPayload.id}`);

    for (const item of items) {
      const { variantId, quantity } = item;

      // Buscar inventario actual
      const inventory = await this.prisma.inventory.findUnique({
        where: { variantId },
      });

      if (inventory) {
        const newStock = Math.max(0, inventory.stock - quantity);
        await this.prisma.inventory.update({
          where: { variantId },
          data: { stock: newStock },
        });
        console.log(`📉 Stock actualizado para variante '${variantId}': ${inventory.stock} -> ${newStock}`);
      } else {
        console.warn(`⚠️ Variante '${variantId}' no registrada en inventario. Saltando...`);
      }
    }
  }
}