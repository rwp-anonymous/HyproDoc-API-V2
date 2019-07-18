import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MaterialRequisitionNoteRepository } from '../material-requisition-notes/material-requisition-note.repository';

@Injectable()
export class DashboardService {
    constructor(
        @InjectRepository(MaterialRequisitionNoteRepository)
        private materialRequisitionNoteRepository: MaterialRequisitionNoteRepository
    ) { }

    async getDashboardCounts(): Promise<number> {
        return await this.materialRequisitionNoteRepository.count()
    }
}
