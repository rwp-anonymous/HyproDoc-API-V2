import { Injectable, NotFoundException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { GetPurchaseOrdersFilterDto } from './dto/get-purchase-notes-filter.dto';
import { PurchaseOrderRepository } from './purchase-order.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchaseOrder } from './purchase-order.entity';
import { PurchaseOrderStatus } from './purchase-order-status.enum';
import { User } from '../auth/user.entity';
import { UserRoles } from '../auth/user-roles.enum';

@Injectable()
export class PurchaseOrdersService {
    constructor(
        @InjectRepository(PurchaseOrderRepository)
        private purchaseOrderRepository: PurchaseOrderRepository
    ) { }

    async getPurchaseOrders(
        filterDto: GetPurchaseOrdersFilterDto,
        user: User
    ): Promise<PurchaseOrder[]> {
        return this.purchaseOrderRepository.getPurchaseOrders(filterDto, user);
    }

    async getPurchaseOrderById(
        id: number,
        user: User,
        isUpdateRequest: boolean = false
    ): Promise<PurchaseOrder> {
        let found;

        let allowedRoles: UserRoles[] = [
            UserRoles.ADMIN,
            UserRoles.CEO,
            UserRoles.SITE_ENGINEER,
            UserRoles.PROJECT_MANAGER,
            UserRoles.PROCUREMENT_OFFICER
        ]

        if (isUpdateRequest || this.isRoleValid(user.role, allowedRoles)) {
            found = await this.purchaseOrderRepository.findOne(id, { relations: ["items", "issuedBy", "purchaseOrderItems"] });
        } else {
            await this.purchaseOrderRepository.findOne({
                where: [
                    { id, issuedById: user.id },
                    { id, approvedById: user.id },
                ],
                relations: ["items", "purchaseOrderItems"]
            });
        }

        if (!found) {
            throw new NotFoundException(`Purchase Order with ID ${id} not found`);
        } else {
            delete found.issuedBy.password;
        }

        return found;
    }

    async createPurchaseOrder(
        createPurchaseOrderDto: CreatePurchaseOrderDto,
        user: User
    ): Promise<PurchaseOrder> {
        return this.purchaseOrderRepository.createPurchaseOrder(createPurchaseOrderDto, user);
    }

    async deletePurchaseOrder(id: number, user: User): Promise<void> {
        let result;
        if (user.role === UserRoles.ADMIN) {
            result = await this.purchaseOrderRepository.delete(id);
        } else {
            throw new NotFoundException(`Purchase Order with ID ${id} not found`);
        }

        if (result && result.affected === 0) {
            throw new NotFoundException(`Purchase Order with ID ${id} not found`);
        }
    }

    async updatePurchaseOrderStatus(id: number, status: PurchaseOrderStatus, user: User): Promise<PurchaseOrder> {
        let allowedRoles: UserRoles[] = [
            UserRoles.ADMIN,
            UserRoles.CEO,
            UserRoles.SITE_ENGINEER,
            UserRoles.PROJECT_MANAGER,
        ]

        const purcahseOrder = await this.getPurchaseOrderById(id, user, true);

        if (purcahseOrder.status === PurchaseOrderStatus.APPROVED) {
            throw new ConflictException(`Purchase Order with id ${id} already been approved`);
        } else if (!this.isRoleValid(user.role, allowedRoles)) {
            throw new UnauthorizedException();
        } else {
            purcahseOrder.status = status;
            purcahseOrder.approvedBy = user;
            purcahseOrder.approvedDate = new Date();
            await purcahseOrder.save();

            delete purcahseOrder.approvedBy;

            return purcahseOrder;
        }
    }

    async generatePurchaseOrderNumber(): Promise<{}> {
        const [lastPurchaseOrder] = await this.purchaseOrderRepository.find({
            order: { id: "DESC" },
            take: 1
        });

        let lastNumber = parseInt(lastPurchaseOrder.poNo.replace(/^\D+/g, ''));
        let standardLastNumber = (lastNumber + 1).toString().padStart(3, '0');
        return { nextNumber: `po-${standardLastNumber}` };
    }

    private isRoleValid(role: any, allowedRoles: UserRoles[]) {
        const idx = allowedRoles.indexOf(role);
        return idx !== -1;
    }
}
