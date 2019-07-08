import { PipeTransform, BadRequestException } from "@nestjs/common";
import { MaterialRequisitionNoteStatus } from "../material-requisition-note-status.enum";

export class MaterialRequisitionNoteStatusValidationPipe implements PipeTransform {
    readonly allowedStatuses = [
        MaterialRequisitionNoteStatus.REQUESTED,
        MaterialRequisitionNoteStatus.APPROVED
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