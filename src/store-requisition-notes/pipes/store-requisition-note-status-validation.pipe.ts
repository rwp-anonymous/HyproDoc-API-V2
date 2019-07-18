import { PipeTransform, BadRequestException } from "@nestjs/common";
import { StoreRequisitionNoteStatus } from "../store-requisition-note-status.enum";

export class StoreRequisitionNoteStatusValidationPipe implements PipeTransform {
    readonly allowedStatuses = [
        StoreRequisitionNoteStatus.REQUESTED,
        StoreRequisitionNoteStatus.APPROVED
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