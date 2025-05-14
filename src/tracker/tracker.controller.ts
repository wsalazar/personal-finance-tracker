import { Controller, Get, Param, Query } from '@nestjs/common';
import { TrackerService } from './tracker.service';

@Controller('tracker')
export class TrackerController {
  constructor(private readonly trackerService: TrackerService) {}

  @Get(':userId')
  async findTrackedFinancesByUserId(
    @Param('userId') userId: string,
  ): Promise<{ goalName: string; percentage: number; id: string }[]> {
    /**
     * todo Once the goal has been met it should be moved to the expense category.
     */
    return await this.trackerService.getFinanceTracker(userId);
  }
}
