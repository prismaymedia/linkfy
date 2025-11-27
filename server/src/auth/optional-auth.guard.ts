import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class OptionalAuthGuard implements CanActivate {
  private readonly logger = new Logger(OptionalAuthGuard.name);
  private supabase: SupabaseClient | null = null;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey) {
      this.supabase = createClient(supabaseUrl, supabaseAnonKey);
    }
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    let token: string | null = null;

    // If Authorization header exists, extract Bearer token
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else {
      // Allow fallback to cookie-based session if present
      const cookieAuth =
        request.cookies?.['supabase-token'] ||
        request.cookies?.['sb-access-token'];

      if (cookieAuth) {
        try {
          const parsed = JSON.parse(cookieAuth);
          token = parsed?.access_token ?? parsed;
        } catch {
          token = cookieAuth;
        }
      }
    }

    // If no token, just continue without setting user (optional auth)
    if (!token || !this.supabase) {
      return true;
    }

    try {
      // Validate token with Supabase
      const { data, error } = await this.supabase.auth.getUser(token);

      const user = data?.user ?? null;

      if (!error && user) {
        // Attach user and token to request object if valid
        (request as any).user = user;
        (request as any).supabaseToken = token;
      }
    } catch {
      // Silently fail - this is optional auth
      this.logger.debug('Optional auth failed, continuing without user');
    }

    return true;
  }
}

