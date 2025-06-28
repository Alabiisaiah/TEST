import { Controller, Get, Param, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  getSummary() {
    return this.dashboardService.getSummary();
  }

  @Get('attendance/today-by-class')
  getTodaysAttendanceByClass() {
    return this.dashboardService.getTodaysAttendanceByClass();
  }

  @Get('attendance/class/:id/term')
  getClassAttendanceByTerm(
    @Param('id') id: string,
    @Query('term') term: string,
    @Query('session') session: string,
  ) {
    return this.dashboardService.getClassAttendanceSummaryByTerm(+id, term, session);
  }

  @Get('attendance/class/:id/day')
  getClassAttendanceByDay(
    @Param('id') id: string,
    @Query('date') date: string,
  ) {
    return this.dashboardService.getClassAttendanceSummaryByDay(+id, date);
  }
}
