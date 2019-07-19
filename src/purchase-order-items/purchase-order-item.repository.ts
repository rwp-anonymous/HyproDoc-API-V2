import { Repository, EntityRepository } from "typeorm";
import { InternalServerErrorException, ConflictException } from "@nestjs/common";
import { CreatePurchaseOrderItemDto } from "./dto/create-purchase-order-item.dto";
import { PurchaseOrderItem } from "./purchase-order-item.entity";

@EntityRepository(PurchaseOrderItem)
export class PurchaseOrderItemRepository extends Repository<PurchaseOrderItem> {
    async createItem(
        createPurcahseOrderItemItemDto: CreatePurchaseOrderItemDto
    ): Promise<PurchaseOrderItem> {
        // if (user.role === UserRoles.STORE_KEEPER || user.role === UserRoles.ADMIN) {
        const { code, deliverdQuantity, unit, pricePerUnit } = createPurcahseOrderItemItemDto;

        const item = new PurchaseOrderItem();

        item.code = code;
        item.unit = unit;
        item.deliverdQuantity = deliverdQuantity;
        item.pricePerUnit = pricePerUnit;

        try {
            await item.save();
        } catch (error) {
            if (error.code === '23505') {   // duplicate item
                throw new ConflictException('Duplicate Item Code');
            } else {
                throw new InternalServerErrorException();
            }
        }

        return item;
        // } else {
        //     throw new UnauthorizedException();
        // }
    }
}