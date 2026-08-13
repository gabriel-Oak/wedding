import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/guard';
import { createSupabaseClient } from '@/lib/supabase/server';

// ─── DELETE ──────────────────────────────────────────────────────────────────
// Deletes guest by id and associated confirmation row.
// URL: /api/admin/guests/:id
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireAdmin();

  const { id } = await params;

  const supabase = createSupabaseClient();

  // Get guest to find phone for confirmation delete
  const { data: guest, error: guestError } = await supabase
    .from('guests')
    .select('phone')
    .eq('id', id)
    .single();

  if (guestError || !guest) {
    return NextResponse.json(
      { error: 'Guest not found' },
      { status: 404 }
    );
  }

  // Delete confirmation first (foreign key)
  await supabase
    .from('confirmations')
    .delete()
    .eq('phone', guest.phone);

  // Delete guest
  const { error: deleteError } = await supabase
    .from('guests')
    .delete()
    .eq('id', id);

  if (deleteError) {
    return NextResponse.json(
      { error: deleteError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
