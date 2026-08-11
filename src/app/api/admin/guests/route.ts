import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/guard';
import { createSupabaseClient } from '@/lib/supabase/server';

// ─── GET ─────────────────────────────────────────────────────────────────────
// Returns all guests with their confirmation status.
// SELECT guests.*, confirmations.rsvp_status AS confirmation_status
// LEFT JOIN confirmations ON guests.phone = confirmations.phone
export async function GET() {
  await requireAdmin();

  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from('guests')
    .select(`
      *,
      confirmations (
        rsvp_status
      )
    `);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Flatten the JOIN result
  const guests = (data as Array<Record<string, unknown>>).map((g) => {
    const { confirmations, ...rest } = g as Record<string, unknown>;
    return {
      ...rest,
      rsvp_status: (confirmations as Record<string, unknown>)?.rsvp_status ?? 'Pendente',
    };
  });

  return NextResponse.json(guests);
}

// ─── POST ────────────────────────────────────────────────────────────────────
// Creates a guest and a confirmation row with status 'Pendente'.
// Body: { name, phone, is_hot_guest?, is_natural_guest? }
export async function POST(request: NextRequest) {
  await requireAdmin();

  const supabase = createSupabaseClient();
  const body = await request.json();

  const { name, phone, is_hot_guest = false, is_natural_guest = false } = body;

  if (!name || !phone) {
    return NextResponse.json(
      { error: 'name and phone are required' },
      { status: 400 }
    );
  }

  // Insert guest
  const { data: guest, error: guestError } = await supabase
    .from('guests')
    .insert({ name, phone, is_hot_guest, is_natural_guest })
    .select()
    .single();

  if (guestError) {
    return NextResponse.json(
      { error: guestError.message },
      { status: 400 }
    );
  }

  // Insert confirmation row
  const { error: confirmError } = await supabase
    .from('confirmations')
    .insert({
      phone,
      rsvp_status: 'Pendente',
    });

  if (confirmError) {
    // Rollback: delete the guest we just created
    await supabase.from('guests').delete().eq('id', guest.id);
    return NextResponse.json(
      { error: confirmError.message },
      { status: 400 }
    );
  }

  return NextResponse.json(guest, { status: 201 });
}

// ─── PATCH ───────────────────────────────────────────────────────────────────
// Partial update of guest fields by id.
// Body: { id, name?, phone?, is_hot_guest?, is_natural_guest? }
// NOTE: rsvp_status is managed via /api/confirmations, not guests
export async function PATCH(request: NextRequest) {
  await requireAdmin();

  const supabase = createSupabaseClient();
  const body = await request.json();

  const { id } = body;

  if (!id) {
    return NextResponse.json(
      { error: 'id is required' },
      { status: 400 }
    );
  }

  const allowedFields = ['name', 'phone', 'is_hot_guest', 'is_natural_guest'];
  const updates: Record<string, unknown> = {};

  for (const key of allowedFields) {
    if (key in body && body[key] !== undefined) {
      updates[key] = body[key];
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: 'No valid fields to update' },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from('guests')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }

  return NextResponse.json(data);
}

// ─── DELETE ──────────────────────────────────────────────────────────────────
// Deletes guest by id and associated confirmation row.
// Body: { id }
export async function DELETE(request: NextRequest) {
  await requireAdmin();

  const supabase = createSupabaseClient();
  const body = await request.json();

  const { id } = body;

  if (!id) {
    return NextResponse.json(
      { error: 'id is required' },
      { status: 400 }
    );
  }

  // Get guest to find phone for confirmation delete
  const { data: guest } = await supabase
    .from('guests')
    .select('phone')
    .eq('id', id)
    .single();

  if (!guest) {
    return NextResponse.json(
      { error: 'Guest not found' },
      { status: 404 }
    );
  }

  // Delete confirmation first
  if (guest.phone) {
    await supabase.from('confirmations').delete().eq('phone', guest.phone);
  }

  // Delete guest
  const { error } = await supabase.from('guests').delete().eq('id', id);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
