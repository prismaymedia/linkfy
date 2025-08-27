import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService implements OnModuleInit {
    private readonly logger = new Logger(SupabaseService.name);
    private supabaseClient: SupabaseClient;

    constructor() {
        const supabaseUrl = process.env.SUPABASE_URL || '';
        const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

        this.logger.log('🔹 Initializing SupabaseService...');

        if (!supabaseUrl || !supabaseKey) {
            this.logger.warn('⚠️ Supabase URL or Key not configured in environment variables');
        } else {
            this.logger.log(`🔹 Supabase URL found: ${supabaseUrl}`);
            this.logger.log(`🔹 Supabase Key found: ${supabaseKey ? '✅ Hidden for security' : '❌ Not defined'}`);
        }


        this.supabaseClient = createClient(supabaseUrl, supabaseKey);
        this.logger.log('✅ Supabase client initialized');
    }

    async onModuleInit() {
        this.logger.log('🔹 SupabaseService module initialized, verifying connection...');

        try {

            const { data, error } = await this.supabaseClient
                .from('spotify_convert')
                .select('*')
                .limit(1);
            if (error) throw error;
            this.logger.log(`🎯 Connection to Supabase successful, test table: ${data?.length ?? 0} records found`);
        } catch (err) {
            this.logger.error('❌ Error connecting to Supabase', err);
        }
    }

    getClient(): SupabaseClient {
        return this.supabaseClient;
    }
}
