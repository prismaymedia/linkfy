import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import * as schema from '../../../shared/schema';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseService.name);
  private db: ReturnType<typeof drizzle>;

  constructor() {
    this.logger.log('🔹 Initializing DatabaseService...');

    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
      this.logger.warn(
        '⚠️ DATABASE_URL not configured in environment variables',
      );
      this.logger.warn('⚠️ Drizzle ORM will not be available');
    } else {
      this.logger.log(`🔹 Database URL found`);
    }

    // Configure WebSocket for Neon serverless
    neonConfig.webSocketConstructor = ws;

    const pool = new Pool({ connectionString: databaseUrl });
    this.db = drizzle(pool, { schema });
    this.logger.log('✅ Drizzle database client initialized');
  }

  async onModuleInit() {
    this.logger.log(
      '🔹 DatabaseService module initialized, verifying connection...',
    );

    if (!process.env.DATABASE_URL) {
      this.logger.warn(
        '⚠️ Skipping database connection test (no DATABASE_URL)',
      );
      return;
    }

    try {
      // Test the connection by querying the conversions table
      const result = await this.db.select().from(schema.conversions).limit(1);
      this.logger.log(
        `🎯 Connection to database successful, test query returned ${result.length} records`,
      );
    } catch (err) {
      this.logger.error('❌ Error connecting to database', err);
    }
  }

  getDb() {
    return this.db;
  }
}
