import { PipeTransform, BadRequestException } from "@nestjs/common";
import { GoodsIssueNoteStatus } from "../goods-issue-note-status.enum";

export class GoodsIssueNoteStatusValidationPipe implements PipeTransform {
    readonly allowedStatuses = [
        GoodsIssueNoteStatus.ISSUED,
        GoodsIssueNoteStatus.RECEIVED
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