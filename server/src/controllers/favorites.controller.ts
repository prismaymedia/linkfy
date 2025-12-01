import {
    Controller,
    Post,
    Get,
    Body,
    BadRequestException,
    Logger,
    UseGuards,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiCreatedResponse,
    ApiBadRequestResponse,
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/user.decorator';
import { User } from '@supabase/supabase-js';
import {
    DatabaseService,
    DatabaseOperationError,
} from '../database/database.service';
import { z } from 'zod';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';

const HistoryInputSchema = z.object({
    sourcePlatform: z.string().optional(),
    sourceUrl: z.string().url().optional(),
    targetPlatform: z.string().optional(),
    targetUrl: z.string().optional(),
    status: z.string().optional(),
});

const AddFavoriteSchema = z.object({
    historyId: z.number().int().positive(),
    alias: z.string().optional(),
    history: HistoryInputSchema.optional(),
});

const RemoveFavoriteSchema = z.object({
    historyId: z.number().int().positive(),
});

type AddFavoriteDto = z.infer<typeof AddFavoriteSchema>;
type RemoveFavoriteDto = z.infer<typeof RemoveFavoriteSchema>;

@ApiTags('Favorites')
@UseGuards(SupabaseAuthGuard)
@Controller('api/favorites')
export class FavoritesController {
    private readonly logger = new Logger(FavoritesController.name);

    constructor(private readonly databaseService: DatabaseService) { }

    @Post('add')
    @ApiOperation({ summary: 'Add a conversion to favorites' })
    @ApiCreatedResponse({ description: 'Favorite added successfully' })
    @ApiBadRequestResponse({ description: 'Invalid input' })
    async addFavorite(
        @Body() body: AddFavoriteDto,
        @CurrentUser() user: User,
    ) {
try {
            const { historyId, alias } = AddFavoriteSchema.parse(body);

            let resolvedHistoryId = historyId;
            const historyPayload = body.history;

            try {
                // attempt upsert; database service will throw if history missing
                const favorite = await this.databaseService.upsertFavorite({
                    userId: user.id,
                    historyId: resolvedHistoryId,
                    alias: alias || undefined,
                });

                return {
                    success: true,
                    favorite,
                    message: 'Added to favorites',
                };
            } catch (err) {
                // If history missing and client provided payload, create the history
                if (err instanceof DatabaseOperationError && historyPayload) {
                    const created = await this.databaseService.recordHistoryEntry({
                        userId: user.id,
                        sourcePlatform: historyPayload.sourcePlatform ?? 'youtube',
                        sourceUrl: historyPayload.sourceUrl ?? '',
                        targetPlatform: historyPayload.targetPlatform ?? undefined,
                        targetUrl: historyPayload.targetUrl ?? undefined,
                        status: historyPayload.status ?? 'success',
                        payload: {},
                    });

                    resolvedHistoryId = created.id as number;

                    const favorite = await this.databaseService.upsertFavorite({
                        userId: user.id,
                        historyId: resolvedHistoryId,
                        alias: alias || undefined,
                    });

                    return {
                        success: true,
                        favorite,
                        message: 'Added to favorites',
                    };
                }

                throw err;
            }
        } catch (error) {
            if (error instanceof DatabaseOperationError) {
                throw new BadRequestException({
                    success: false,
                    error: 'INVALID_HISTORY_ENTRY',
                    message: (error as Error).message,
                });
            }
            if (error instanceof z.ZodError) {
                throw new BadRequestException({
                    success: false,
                    error: 'INVALID_INPUT',
                    details: error.flatten?.(),
                });
            }
            throw error;
        }
    }

    @Post('remove')
    @ApiOperation({ summary: 'Remove a conversion from favorites' })
    @ApiCreatedResponse({ description: 'Favorite removed successfully' })
    @ApiBadRequestResponse({ description: 'Invalid input' })
    async removeFavorite(
        @Body() body: RemoveFavoriteDto,
        @CurrentUser() user: User,
    ) {
try {
            const { historyId } = RemoveFavoriteSchema.parse(body);

            await this.databaseService.removeFavorite(user.id, historyId);

            return {
                success: true,
                message: 'Removed from favorites',
            };
        } catch (error) {
            if (error instanceof z.ZodError) {
                throw new BadRequestException({
                    success: false,
                    error: 'INVALID_INPUT',
                    details: error.flatten?.(),
                });
            }
            throw error;
        }
    }

    @Get('list')
    @ApiOperation({ summary: 'List all favorites for the current user' })
    @ApiCreatedResponse({ description: 'Favorites list retrieved' })
    async listFavorites(@CurrentUser() user: User) {
try {
            const favorites = await this.databaseService.listFavoritesByUser(user.id);

            return {
                success: true,
                favorites,
            };
        } catch (error) {
            this.logger.error('Failed to list favorites', error);
            throw error;
        }
    }
}
