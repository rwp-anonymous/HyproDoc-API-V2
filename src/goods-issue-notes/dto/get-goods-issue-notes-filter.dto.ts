import { IsOptional, IsIn, IsNotEmpty } from "class-validator";
import { GoodsIssueNoteStatus } from "../goods-issue-note-status.enum";

export class GetGoodsIssueNotesFilterDto {
    @IsOptional()
    @IsIn([GoodsIssueNoteStatus.ISSUED, GoodsIssueNoteStatus.RECEIVED])
    status: GoodsIssueNoteStatus;

    @IsOptional()
    @IsNotEmpty()
    search: string;
}