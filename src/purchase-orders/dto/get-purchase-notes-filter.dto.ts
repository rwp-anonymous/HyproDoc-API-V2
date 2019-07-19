import { IsOptional, IsIn, IsNotEmpty } from "class-validator";
import { PurchaseOrderStatus } from "../purchase-order-status.enum";

export class GetPurchaseOrdersFilterDto {
    @IsOptional()
    @IsIn([PurchaseOrderStatus.REQUESTED, PurchaseOrderStatus.APPROVED])
    status: PurchaseOrderStatus;

    @IsOptional()
    @IsNotEmpty()
    search: string;
}