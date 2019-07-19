import { Repository, EntityRepository } from "typeorm";
import { PurchaseOrder } from "./purchase-order.entity";
import { CreatePurchaseOrderDto } from "./dto/create-purchase-order.dto";
import { PurchaseOrderStatus } from "./purchase-order-status.enum";
import { GetPurchaseOrdersFilterDto } from "./dto/get-purchase-notes-filter.dto";
import { User } from "../auth/user.entity";
import { UserRoles } from "../auth/user-roles.enum";
import { ConflictException, InternalServerErrorException, Logger, UnauthorizedException } from "@nestjs/common";
import { PurchaseOrderItem } from "../purchase-order-items/purchase-order-item.entity";

@EntityRepository(PurchaseOrder)
export class PurchaseOrderRepository extends Repository<PurchaseOrder> {
    private logger = new Logger('PurchaseOrderRepository');

    async getPurchaseOrders(
        filterDto: GetPurchaseOrdersFilterDto,
        user: User
    ): Promise<PurchaseOrder[]> {
        const { status, search } = filterDto;
        const query = this.createQueryBuilder('purchaseOrder');

        let allowedRoles: UserRoles[] = [
            UserRoles.ADMIN,
            UserRoles.CEO,
            UserRoles.SITE_ENGINEER,
            UserRoles.PROJECT_MANAGER
        ]

        if (!this.isRoleValid(user.role, allowedRoles)) {
            query.where('(purchaseOrder.issuedById = :userId OR purchaseOrder.approvedById = :userId)', { userId: user.id })
        }

        if (status) {
            query.andWhere('purchaseOrder.status = :status', { status })
        }

        if (search) {
            query.andWhere('(purchaseOrder.poNo LIKE :search OR purchaseOrder.siteLocation LIKE :search)', { search: `%${search}%` })
        }

        try {
            const purchaseOrders = await query
                .leftJoinAndSelect("purchaseOrder.items", "item")
                .leftJoinAndSelect("purchaseOrder.purchaseOrderItems", "purchaseOrderItem")
                .innerJoinAndSelect("purchaseOrder.issuedBy", "user")
                .getMany();

            const newPurchaseOrders = purchaseOrders.map(({ issuedBy: { password, ...restOfObj }, ...restOfNote }) => Object.assign({ ...restOfNote, issuedBy: restOfObj }))

            return newPurchaseOrders;
        } catch (error) {
            this.logger.error(`Failed to get purchase orders for user "${user.email}". Filters: ${JSON.stringify(filterDto)}`, error.stack);
            throw new InternalServerErrorException();
        }
    }

    async createPurchaseOrder(
        createPurchaseOrderDto: CreatePurchaseOrderDto,
        user: User
    ): Promise<PurchaseOrder> {
        let allowedRoles: UserRoles[] = [
            UserRoles.ADMIN,
            UserRoles.PROCUREMENT_OFFICER
        ]

        if (this.isRoleValid(user.role, allowedRoles)) {

            const { poNo, siteLocation, supplier, items, purchaseOrderItems } = createPurchaseOrderDto;

            const savedPurchaseOrderItems = await this.createPurchaseOrderItems(purchaseOrderItems);

            const purchaseOrder = new PurchaseOrder();
            purchaseOrder.poNo = poNo;
            purchaseOrder.siteLocation = siteLocation;
            purchaseOrder.supplier = supplier;
            purchaseOrder.issuedDate = new Date();
            purchaseOrder.issuedBy = user;
            purchaseOrder.items = items;
            purchaseOrder.purchaseOrderItems = savedPurchaseOrderItems;
            purchaseOrder.status = PurchaseOrderStatus.REQUESTED;

            try {
                await purchaseOrder.save();
            } catch (error) {
                this.logger.error(`Failed to create a  purchase order note for user "${user.email}". DTO: ${JSON.stringify(createPurchaseOrderDto)}`, error.stack);

                if (error.code === '23505') {   // duplicate po
                    throw new ConflictException('Duplicate PO Number');
                } else {
                    throw new InternalServerErrorException();
                }
            }

            delete purchaseOrder.issuedBy;

            return purchaseOrder;
        } else {
            throw new UnauthorizedException();
        }
    }

    async createPurchaseOrderItems(items: PurchaseOrderItem[]): Promise<PurchaseOrderItem[]> {
        let savedPurchaseOrderItems: PurchaseOrderItem[] = [];
        for await (const item of items) {
            const newItem = new PurchaseOrderItem();
            newItem.code = item.code;
            newItem.unit = item.unit;
            newItem.deliverdQuantity = item.deliverdQuantity;
            newItem.pricePerUnit = item.pricePerUnit;

            try {
                await newItem.save();
            } catch (error) {
                if (error.code === '23505') {   // duplicate po
                    throw new ConflictException('Duplicate PO Number');
                } else {
                    throw new InternalServerErrorException();
                }
            }
            savedPurchaseOrderItems.push(newItem);
        }
        return savedPurchaseOrderItems;
    }

    private isRoleValid(role: any, allowedRoles: UserRoles[]) {
        const idx = allowedRoles.indexOf(role);
        return idx !== -1;
    }
}