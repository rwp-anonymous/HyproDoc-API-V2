import { PipeTransform, BadRequestException } from "@nestjs/common";
import { PurchaseOrderStatus } from "../purchase-order-status.enum";

export class PurchaseOrderStatusValidationPipe implements PipeTransform {
    readonly allowedStatuses = [
        PurchaseOrderStatus.REQUESTED,
        PurchaseOrderStatus.APPROVED
    ];

    transform(value: any) {
        value = value.toUpperCase();

        if (!this.isStatusValid(value)) {
            throw new BadRequestException(`${value} is an invalid status`)
        }

        return value;
    }

    private isStatusValid(status: any) {
        const idx = this.allowedStatuses.indexOf(status);
        return idx !== -1;
    }
}