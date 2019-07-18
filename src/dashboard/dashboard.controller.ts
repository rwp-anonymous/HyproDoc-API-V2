import { Controller, UseGuards, Get } from '@nestjs/common';
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { DashboardService } from './dashboard.service';

@ApiUseTags('Dashboard')
@ApiBearerAuth()
@Controller('dashboard')
@UseGuards(AuthGuard())
export class DashboardController {
    constructor(private dashboardService: DashboardService) { }

    @Get('/summary')
    getDashboardCounts(): Promise<number> {
        return this.dashboardService.getDashboardCounts();
    }
}
