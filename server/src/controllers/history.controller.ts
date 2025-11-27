import {
  Controller,
  Get,
  Delete,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
  HttpStatus,
  Res,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiQuery,
  ApiNoContentResponse,
} from '@nestjs/swagger';
import { HistoryService } from '../services/history.service';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { CurrentUser } from '../auth/user.decorator';
import { User } from '@supabase/supabase-js';
import { Response } from 'express';

@ApiTags('History')
@Controller('api/history')
@UseGuards(SupabaseAuthGuard)
export class HistoryController {
  constructor(private readonly historyService: HistoryService) { }

  @Get()
  @ApiOperation({ summary: 'Get conversion history with optional search and filters' })
  @ApiQuery({ name: 'query', required: false, description: 'Search query' })
  @ApiQuery({ name: 'sourcePlatform', required: false, description: 'Filter by source platform' })
  @ApiQuery({ name: 'targetPlatform', required: false, description: 'Filter by target platform' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by status' })
  @ApiQuery({ name: 'limit', required: false, description: 'Limit results', type: Number })
  @ApiQuery({ name: 'offset', required: false, description: 'Offset for pagination', type: Number })
  @ApiOkResponse({
    description: 'History entries retrieved successfully',
    schema: {
      example: {
        entries: [
          {
            id: 1,
            userId: 'user-uuid',
            sourcePlatform: 'youtube',
            sourceUrl: 'https://music.youtube.com/watch?v=...',
            targetPlatform: 'spotify',
            targetUrl: 'https://open.spotify.com/track/...',
            status: 'completed',
            payload: {},
            createdAt: '2024-01-15T10:30:00Z',
            updatedAt: '2024-01-15T10:30:00Z',
          },
        ],
        total: 1,
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async getHistory(
    @CurrentUser() user: User,
    @Query('query') query?: string,
    @Query('sourcePlatform') sourcePlatform?: string,
    @Query('targetPlatform') targetPlatform?: string,
    @Query('status') status?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    // Parse and validate limit and offset
    let parsedLimit: number | undefined;
    let parsedOffset: number | undefined;

    if (limit) {
      const parsed = parseInt(limit, 10);
      parsedLimit = !Number.isNaN(parsed) ? parsed : undefined;
    }

    if (offset) {
      const parsed = parseInt(offset, 10);
      parsedOffset = !Number.isNaN(parsed) ? parsed : undefined;
    }

    const result = await this.historyService.searchHistory({
      userId: user.id,
      query,
      sourcePlatform,
      targetPlatform,
      status,
      limit: parsedLimit,
      offset: parsedOffset,
    });

    return result;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a specific history entry' })
  @ApiNoContentResponse({ description: 'History entry deleted successfully' })
  @ApiBadRequestResponse({ description: 'Invalid history entry ID' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async deleteHistoryEntry(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.historyService.deleteHistoryEntry(id, user.id);
    res.status(HttpStatus.NO_CONTENT);
    return;
  }

  @Delete()
  @ApiOperation({ summary: 'Clear all history for the current user' })
  @ApiOkResponse({
    description: 'History cleared successfully',
    schema: {
      example: {
        deletedCount: 10,
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async clearHistory(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ) {
    const deletedCount = await this.historyService.clearHistory(user.id);
    res.status(HttpStatus.OK);
    return { deletedCount };
  }
}
