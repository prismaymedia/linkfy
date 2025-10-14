import { UnauthorizedException, ExecutionContext, Logger } from '@nestjs/common';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';

// Mock Supabase client
const mockGetUser = jest.fn();

jest.mock('@supabase/supabase-js', () => ({
    createClient: jest.fn(() => ({
        auth: {
            getUser: mockGetUser,
        },
    })),
}));

describe('SupabaseAuthGuard', () => {
    let guard: SupabaseAuthGuard;
    let mockContext: Partial<ExecutionContext>;
    let mockRequest: any;

    beforeEach(() => {
        jest.clearAllMocks();
        guard = new SupabaseAuthGuard();

        // Silence Nest Logger output in tests
        jest.spyOn(Logger.prototype, 'error').mockImplementation(() => { });
        jest.spyOn(Logger.prototype, 'warn').mockImplementation(() => { });
        jest.spyOn(Logger.prototype, 'log').mockImplementation(() => { });

        mockRequest = {
            headers: {},
            cookies: {},
        };

        mockContext = {
            switchToHttp: () => ({
                getRequest: () => mockRequest,
            }),
        } as any;
    });

    it('should throw Unauthorized if no token in header or cookies', async () => {
        await expect(
            guard.canActivate(mockContext as ExecutionContext),
        ).rejects.toThrow(UnauthorizedException);
    });

    it('should extract token from Authorization header', async () => {
        mockRequest.headers.authorization = 'Bearer valid-token';
        mockGetUser.mockResolvedValue({ data: { user: { id: '123' } }, error: null });

        const result = await guard.canActivate(mockContext as ExecutionContext);
        expect(result).toBe(true);
        expect(mockRequest.user).toEqual({ id: '123' });
    });

    it('should fallback to supabase-token cookie if no header', async () => {
        mockRequest.cookies['supabase-token'] = JSON.stringify({ access_token: 'cookie-token' });
        mockGetUser.mockResolvedValue({ data: { user: { id: 'cookie-user' } }, error: null });

        const result = await guard.canActivate(mockContext as ExecutionContext);
        expect(result).toBe(true);
        expect(mockRequest.supabaseToken).toBe('cookie-token');
        expect(mockRequest.user).toEqual({ id: 'cookie-user' });
    });

    it('should handle non-JSON cookie gracefully', async () => {
        mockRequest.cookies['sb-access-token'] = 'raw-token';
        mockGetUser.mockResolvedValue({ data: { user: { id: 'raw-user' } }, error: null });

        const result = await guard.canActivate(mockContext as ExecutionContext);
        expect(result).toBe(true);
        expect(mockRequest.supabaseToken).toBe('raw-token');
        expect(mockRequest.user).toEqual({ id: 'raw-user' });
    });

    it('should throw Unauthorized if Supabase returns error', async () => {
        mockRequest.headers.authorization = 'Bearer invalid-token';
        mockGetUser.mockResolvedValue({ data: null, error: { message: 'Invalid token' } });

        await expect(
            guard.canActivate(mockContext as ExecutionContext),
        ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw Unauthorized if no user returned', async () => {
        mockRequest.headers.authorization = 'Bearer no-user-token';
        mockGetUser.mockResolvedValue({ data: { user: null }, error: null });

        await expect(
            guard.canActivate(mockContext as ExecutionContext),
        ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw Unauthorized if supabase.auth.getUser throws', async () => {
        mockRequest.headers.authorization = 'Bearer crash-token';
        mockGetUser.mockRejectedValue(new Error('Unexpected failure'));

        await expect(
            guard.canActivate(mockContext as ExecutionContext),
        ).rejects.toThrow(UnauthorizedException);
    });
});
