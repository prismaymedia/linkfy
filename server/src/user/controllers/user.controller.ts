import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { SupabaseAuthGuard } from '../../auth/supabase-auth.guard';
import { CurrentUser } from '../../auth/user.decorator';
import { User } from '@supabase/supabase-js';

@ApiTags('Users')
@Controller('api/users')
@UseGuards(SupabaseAuthGuard)
export class UserController {
    @Get('info')
    @ApiOperation({ summary: 'Get current user information' })
    @ApiOkResponse({
        description: 'User information retrieved successfully',
        schema: {
            example: {
                id: 'user-uuid',
                email: 'user@example.com',
                full_name: 'John Doe',
                avatar_url: 'https://example.com/avatar.jpg',
            },
        },
    })
    async getUserInfo(@CurrentUser() user: User) {
        return {
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name,
            avatar_url: user.user_metadata?.avatar_url,
            created_at: user.created_at,
        };
    }
}
