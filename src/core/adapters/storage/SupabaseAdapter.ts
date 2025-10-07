import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { StorageAdapter } from './StorageAdapter'
import { StorageError } from './StorageAdapter'

/**
 * Supabase implementation of StorageAdapter
 * Provides cloud database storage capabilities
 */
export class SupabaseAdapter implements StorageAdapter {
  private client: SupabaseClient;
  private readonly tableName: string;

  constructor(
    supabaseUrl: string,
    supabaseKey: string,
    tableName: string = 'flow_management_data'
  ) {
    this.client = createClient(supabaseUrl, supabaseKey);
    this.tableName = tableName;
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select('value')
        .eq('key', key)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows found
          return null;
        }
        throw error;
      }

      return data?.value as T || null;
    } catch (error) {
      throw new StorageError(
        `Failed to get item from Supabase: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'SUPABASE_GET_ERROR'
      );
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    try {
      const { error } = await this.client
        .from(this.tableName)
        .upsert({
          key,
          value,
          updated_at: new Date().toISOString()
        });

      if (error) {
        throw error;
      }
    } catch (error) {
      throw new StorageError(
        `Failed to set item in Supabase: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'SUPABASE_SET_ERROR'
      );
    }
  }

  async delete(key: string): Promise<void> {
    try {
      const { error } = await this.client
        .from(this.tableName)
        .delete()
        .eq('key', key);

      if (error) {
        throw error;
      }
    } catch (error) {
      throw new StorageError(
        `Failed to delete item from Supabase: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'SUPABASE_DELETE_ERROR'
      );
    }
  }

  async list<T>(prefix?: string): Promise<T[]> {
    try {
      let query = this.client
        .from(this.tableName)
        .select('value');

      if (prefix) {
        query = query.like('key', `${prefix}%`);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data?.map((item: { value: T }) => item.value) || []
    } catch (error) {
      throw new StorageError(
        `Failed to list items from Supabase: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'SUPABASE_LIST_ERROR'
      );
    }
  }

  async clear(): Promise<void> {
    try {
      const { error } = await this.client
        .from(this.tableName)
        .delete()
        .neq('key', ''); // Delete all rows

      if (error) {
        throw error;
      }
    } catch (error) {
      throw new StorageError(
        `Failed to clear Supabase data: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'SUPABASE_CLEAR_ERROR'
      );
    }
  }

  /**
   * Initialize the Supabase table if it doesn't exist
   */
  async initializeTable(): Promise<void> {
    try {
      // This would typically be done via Supabase migrations
      // For now, we'll assume the table exists with the following structure:
      // CREATE TABLE flow_management_data (
      //   id SERIAL PRIMARY KEY,
      //   key TEXT UNIQUE NOT NULL,
      //   value JSONB NOT NULL,
      //   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      //   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      // );
      console.log('Supabase table initialization should be handled via migrations');
    } catch (error) {
      throw new StorageError(
        `Failed to initialize Supabase table: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'SUPABASE_INIT_ERROR'
      );
    }
  }
}
