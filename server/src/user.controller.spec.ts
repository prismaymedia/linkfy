import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user/controllers/user.controller';
import { SupabaseAuthGuard } from './auth/supabase-auth.guard';

describe('UserController', () => {
    let controller: UserController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
        })
            .overrideGuard(SupabaseAuthGuard)
            .useValue({ canActivate: jest.fn().mockReturnValue(true) })
            .compile();

        controller = module.get<UserController>(UserController);
    });

    function createUserMock() {
        return {
            id: 'user-id',
            email: 'user@example.com',
            user_metadata: {
                full_name: 'John Doe',
                avatar_url: 'https://example.com/avatar.jpg',
            },
            created_at: new Date().toISOString(),
        } as any;
    }

    it('returns current user info', async () => {
        const user = createUserMock();
        const result = await controller.getUserInfo(user);

        expect(result).toMatchObject({
            id: 'user-id',
            email: 'user@example.com',
            full_name: 'John Doe',
            avatar_url: 'https://example.com/avatar.jpg',
        });
    });
});
