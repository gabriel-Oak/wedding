import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, POST, PATCH, DELETE } from './route';

// ─── MOCKS ───────────────────────────────────────────────────────────────────

vi.mock('@/lib/auth/guard', () => ({
  requireAdmin: vi.fn().mockResolvedValue({ id: 'admin-id' }),
}));

vi.mock('@/lib/supabase/server', () => ({
  createSupabaseClient: vi.fn(),
}));

// ─── HELPERS ─────────────────────────────────────────────────────────────────

let queueIndex = 0;

/**
 * Creates a mock Supabase client. Every chainable method returns the same
 * builder shape. `.then(cb)` dequeues the next queued result.
 */
function createMockClient(results: Array<{ data: unknown; error: Error | null }>) {
  queueIndex = 0;

  const dequeue = () => {
    const r = results[queueIndex++];
    return { data: r.data, error: r.error };
  };

  const b = () => ({
    select: () => b(),
    insert: () => b(),
    update: () => b(),
    delete: () => b(),
    eq: () => b(),
    single: () => b(),
    then: (cb: (r: { data: unknown; error: Error | null }) => unknown) => cb(dequeue()),
  });

  return { from: () => b() };
}

function mockRequest(body?: unknown, method = 'GET'): NextRequest {
  return new NextRequest('http://localhost:3000/api/admin/guests', {
    method,
    body: body ? JSON.stringify(body) : undefined,
  }) as NextRequest;
}

let requireAdmin: ReturnType<typeof vi.fn>;
let createSupabaseClient: ReturnType<typeof vi.fn>;

beforeEach(async () => {
  vi.clearAllMocks();
  ({ requireAdmin } = await import('@/lib/auth/guard'));
  ({ createSupabaseClient } = await import('@/lib/supabase/server'));
  // Default: admin is authenticated
  (requireAdmin as ReturnType<typeof vi.fn>).mockResolvedValue({ id: 'admin-id' });
});

// ─── GET ─────────────────────────────────────────────────────────────────────

describe('GET /api/admin/guests', () => {
  it('returns 401 when admin not authenticated', async () => {
    (requireAdmin as ReturnType<typeof vi.fn>).mockImplementation(() => {
      throw new Error('Unauthorized');
    });

    const res = await GET();
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error).toBe('Unauthorized');
  });

  it('returns all guests with confirmation status', async () => {
    const mockData = [
      {
        id: '1',
        name: 'Joao',
        phone: '11999999999',
        is_hot_guest: true,
        is_natural_guest: false,
        has_read: false,
        updated_at: '2026-01-01',
        confirmations: { rsvp_status: 'Confirmado' },
      },
    ];

    const client = createMockClient([{ data: mockData, error: null }]);
    (createSupabaseClient as ReturnType<typeof vi.fn>).mockReturnValue(client);

    const res = await GET();
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toHaveLength(1);
    expect(json[0].name).toBe('Joao');
    expect(json[0].rsvp_status).toBe('Confirmado');
  });

  it('returns empty array when no guests', async () => {
    const client = createMockClient([{ data: [], error: null }]);
    (createSupabaseClient as ReturnType<typeof vi.fn>).mockReturnValue(client);

    const res = await GET();
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toHaveLength(0);
  });

  it('returns 500 on supabase error', async () => {
    const client = createMockClient([{ data: null, error: new Error('DB error') }]);
    (createSupabaseClient as ReturnType<typeof vi.fn>).mockReturnValue(client);

    const res = await GET();
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe('DB error');
  });
});

// ─── POST ────────────────────────────────────────────────────────────────────

describe('POST /api/admin/guests', () => {
  it('returns 400 when name or phone missing', async () => {
    const res = await POST(mockRequest({ name: 'Joao' }, 'POST'));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe('name and phone are required');
  });

  it('creates guest and confirmation', async () => {
    const client = createMockClient([
      { data: { id: 'new-id', name: 'Maria', phone: '11988888888' }, error: null },
      { data: null, error: null },
    ]);
    (createSupabaseClient as ReturnType<typeof vi.fn>).mockReturnValue(client);

    const res = await POST(mockRequest({
      name: 'Maria',
      phone: '11988888888',
      is_hot_guest: true,
    }, 'POST'));

    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.name).toBe('Maria');
    expect(json.phone).toBe('11988888888');
  });

  it('returns 400 on guest insert error', async () => {
    const client = createMockClient([
      { data: null, error: new Error('Duplicate phone') },
    ]);
    (createSupabaseClient as ReturnType<typeof vi.fn>).mockReturnValue(client);

    const res = await POST(mockRequest({ name: 'Maria', phone: '11988888888' }, 'POST'));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe('Duplicate phone');
  });
});

// ─── PATCH ───────────────────────────────────────────────────────────────────

describe('PATCH /api/admin/guests', () => {
  it('returns 400 when id missing', async () => {
    const res = await PATCH(mockRequest({ name: 'Updated' }, 'PATCH'));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe('id is required');
  });

  it('returns 400 when no valid fields', async () => {
    const res = await PATCH(mockRequest({ id: '123' }, 'PATCH'));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe('No valid fields to update');
  });

  it('updates guest fields', async () => {
    const client = createMockClient([{
      data: { id: '123', name: 'Updated', phone: '11999999999', is_hot_guest: false },
      error: null,
    }]);
    (createSupabaseClient as ReturnType<typeof vi.fn>).mockReturnValue(client);

    const res = await PATCH(mockRequest({
      id: '123',
      name: 'Updated',
      is_hot_guest: false,
    }, 'PATCH'));

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.name).toBe('Updated');
  });

  it('ignores invalid fields', async () => {
    const client = createMockClient([{
      data: { id: '123', name: 'Ok' },
      error: null,
    }]);
    (createSupabaseClient as ReturnType<typeof vi.fn>).mockReturnValue(client);

    const res = await PATCH(mockRequest({
      id: '123',
      name: 'Ok',
      invalid_field: 'should be ignored',
    }, 'PATCH'));

    expect(res.status).toBe(200);
  });
});

// ─── DELETE ──────────────────────────────────────────────────────────────────

describe('DELETE /api/admin/guests', () => {
  it('returns 400 when id missing', async () => {
    const res = await DELETE(mockRequest({}, 'DELETE'));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe('id is required');
  });

  it('returns 404 when guest not found', async () => {
    const client = createMockClient([{ data: null, error: null }]);
    (createSupabaseClient as ReturnType<typeof vi.fn>).mockReturnValue(client);

    const res = await DELETE(mockRequest({ id: 'nonexistent' }, 'DELETE'));
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.error).toBe('Guest not found');
  });

  it('deletes guest and confirmation', async () => {
    const client = createMockClient([
      { data: { phone: '11999999999' }, error: null },
      { data: null, error: null },
      { data: null, error: null },
    ]);
    (createSupabaseClient as ReturnType<typeof vi.fn>).mockReturnValue(client);

    const res = await DELETE(mockRequest({ id: '123' }, 'DELETE'));

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
  });
});
