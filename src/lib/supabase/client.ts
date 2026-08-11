import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

export function createSupabaseClient(): SupabaseClient {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/**
 * Generic query helper for Supabase client operations.
 */
export async function supabaseQuery<T = unknown>(
  client: SupabaseClient,
  table: string,
  operation: 'select' | 'insert' | 'update' | 'delete',
  filters?: Record<string, unknown>
): Promise<{ data: T[] | null; error: Error | null }> {
  switch (operation) {
    case 'select':
      if (filters && Object.keys(filters).length > 0) {
        const { data, error } = await client
          .from(table)
          .select()
          .eq(Object.keys(filters)[0], Object.values(filters)[0]);
        return { data: data as T[] | null, error };
      }
      const { data: selectAllData, error: selectError } = await client.from(table).select();
      return { data: selectAllData as T[] | null, error: selectError };

    case 'insert':
      const { data: insertData, error: insertError } = await client
        .from(table)
        .insert(filters || {})
        .select();
      return { data: insertData as T[] | null, error: insertError };

    case 'update':
      if (!filters) {
        return { data: null, error: new Error('filters are required for update operations') };
      }
      const { data: updateData, error: updateError } = await client
        .from(table)
        .update(filters)
        .select();
      return { data: updateData as T[] | null, error: updateError };

    case 'delete':
      if (!filters) {
        return { data: null, error: new Error('filters are required for delete operations') };
      }
      const { data: deleteData, error: deleteError } = await client
        .from(table)
        .delete()
        .eq(Object.keys(filters)[0], Object.values(filters)[0]);
      return { data: deleteData as T[] | null, error: deleteError };

    default:
      return { data: null, error: new Error(`Unsupported operation: ${operation}`) };
  }
}

/**
 * Insert helper for Supabase client.
 */
export async function supabaseInsert<T = unknown>(
  client: SupabaseClient,
  table: string,
  data: Record<string, unknown>
): Promise<{ data: T[] | null; error: Error | null }> {
  const { data: result, error } = await client
    .from(table)
    .insert(data)
    .select();
  return { data: result as T[] | null, error };
}

/**
 * Update helper for Supabase client.
 */
export async function supabaseUpdate<T = unknown>(
  client: SupabaseClient,
  table: string,
  data: Record<string, unknown>,
  filters: Record<string, unknown>
): Promise<{ data: T[] | null; error: Error | null }> {
  const { data: result, error } = await client
    .from(table)
    .update(data)
    .eq(Object.keys(filters)[0], Object.values(filters)[0])
    .select();
  return { data: result as T[] | null, error };
}
