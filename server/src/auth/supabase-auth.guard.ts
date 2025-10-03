import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  private readonly logger = new Logger(SupabaseAuthGuard.name);
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!,
    );
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    let token: string | null = null;

    // If Authorization header exists, extract Bearer token
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else {
      // Allow fallback to cookie-based session if present (Supabase stores session in cookies)
      const cookieAuth =
        request.cookies?.['supabase-token'] ||
        request.cookies?.['sb-access-token'];

      if (!cookieAuth) {
        this.logger.warn(
          'No authorization header or session cookie found',
        );
        throw new UnauthorizedException(
          'No authorization token provided',
        );
      }

      // If cookie present, set token to cookie value
      // cookieAuth may be a JSON string with access_token; try to parse
      try {
        const parsed = JSON.parse(cookieAuth);
        token = parsed?.access_token ?? parsed;
      } catch {
        token = cookieAuth;
      }
    }

    if (!token) {
      this.logger.warn('No token available after cookie/header fallback');
      throw new UnauthorizedException('No authorization token provided');
    }

    try {
      // Validate token with Supabase
      const { data, error } = await this.supabase.auth.getUser(token);

      const user = data?.user ?? null;

      if (error || !user) {
        this.logger.warn(
          `Invalid token or user not found: ${error?.message ?? 'unknown'}`,
        );
        throw new UnauthorizedException('Invalid or expired token');
      }

      // Attach user and token to request object
      (request as any).user = user;
      (request as any).supabaseToken = token;

      return true;
    } catch (err) {
      this.logger.error('Error verifying token', err);
      throw new UnauthorizedException('Error verifying token');
    }
  }
}
