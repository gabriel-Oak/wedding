import { describe, it, expect } from 'vitest';
import {
  validatePhone,
  formatPhoneError,
  formatPhoneForbidden,
  formatPhoneNotFound,
  logValidationFailure,
} from './phone-validation';

// ─── validatePhone ────────────────────────────────────────────────────────

describe('validatePhone', () => {
  it('should return null for null input', () => {
    expect(validatePhone(null)).toBeNull();
  });

  it('should return null for empty string', () => {
    expect(validatePhone('')).toBeNull();
  });

  it('should return null for whitespace only', () => {
    expect(validatePhone('   ')).toBeNull();
  });

  it('should return null for non-numeric input', () => {
    expect(validatePhone('abc123')).toBeNull();
  });

  it('should return null for too short number (9 digits)', () => {
    expect(validatePhone('123456789')).toBeNull();
  });

  it('should return null for too long number (12 digits)', () => {
    expect(validatePhone('1234567890123')).toBeNull();
  });

  // ─── 10-digit numbers ─────────────────────────────────────────────────

  it('should normalize 10-digit without +55', () => {
    const result = validatePhone('1199999999');
    expect(result).toBe('+551199999999');
  });

  it('should normalize 10-digit with +55', () => {
    const result = validatePhone('+551199999999');
    expect(result).toBe('+551199999999');
  });

  // ─── 11-digit numbers ─────────────────────────────────────────────────

  it('should normalize 11-digit without +55', () => {
    const result = validatePhone('11999999999');
    expect(result).toBe('+5511999999999');
  });

  it('should normalize 11-digit with +55', () => {
    const result = validatePhone('+5511999999999');
    expect(result).toBe('+5511999999999');
  });

  // ─── With formatting chars ────────────────────────────────────────────

  it('should strip parentheses', () => {
    const result = validatePhone('(11) 999999999');
    expect(result).toBe('+5511999999999');
  });

  it('should strip dashes', () => {
    const result = validatePhone('11-99999999');
    expect(result).toBe('+551199999999');
  });

  it('should strip spaces', () => {
    const result = validatePhone('11 99999 999');
    expect(result).toBe('+551199999999');
  });

  it('should strip complex formatting', () => {
    const result = validatePhone('(11) 99999-9999');
    expect(result).toBe('+5511999999999');
  });

  it('should handle +55 with formatting', () => {
    const result = validatePhone('+55 (11) 99999-9999');
    expect(result).toBe('+5511999999999');
  });

  // ─── Edge cases ───────────────────────────────────────────────────────

  it('should handle 10-digit with +55', () => {
    const result = validatePhone('+551199999999');
    expect(result).toBe('+551199999999');
  });

  it('should return normalized string starting with +55', () => {
    const result = validatePhone('21988887777');
    expect(result).toMatch(/^\+5521988887777$/);
  });
});

// ─── formatPhoneError ─────────────────────────────────────────────────────

describe('formatPhoneError', () => {
  it('should return a Response with 400 status', () => {
    const res = formatPhoneError('Invalid format');
    expect(res.status).toBe(400);
  });

  it('should set Content-Type header', () => {
    const res = formatPhoneError('Invalid format');
    expect(res.headers.get('Content-Type')).toBe('application/json');
  });

  it('should include error message in body', async () => {
    const res = formatPhoneError('Bad phone');
    const body = await res.json();
    expect(body).toEqual({ error: 'Bad phone' });
  });
});

// ─── formatPhoneForbidden ─────────────────────────────────────────────────

describe('formatPhoneForbidden', () => {
  it('should return a Response with 403 status', () => {
    const res = formatPhoneForbidden('Missing phone');
    expect(res.status).toBe(403);
  });

  it('should set Content-Type header', () => {
    const res = formatPhoneForbidden('Missing phone');
    expect(res.headers.get('Content-Type')).toBe('application/json');
  });

  it('should include error message in body', async () => {
    const res = formatPhoneForbidden('No phone provided');
    const body = await res.json();
    expect(body).toEqual({ error: 'No phone provided' });
  });
});

// ─── formatPhoneNotFound ──────────────────────────────────────────────────

describe('formatPhoneNotFound', () => {
  it('should return a Response with 404 status', () => {
    const res = formatPhoneNotFound('Not found');
    expect(res.status).toBe(404);
  });

  it('should set Content-Type header', () => {
    const res = formatPhoneNotFound('Not found');
    expect(res.headers.get('Content-Type')).toBe('application/json');
  });

  it('should include error message in body', async () => {
    const res = formatPhoneNotFound('Guest not found');
    const body = await res.json();
    expect(body).toEqual({ error: 'Guest not found' });
  });
});

// ─── logValidationFailure ─────────────────────────────────────────────────

describe('logValidationFailure', () => {
  let errorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    errorSpy.mockRestore();
  });

  it('should log with reason only', () => {
    logValidationFailure('Invalid format');
    expect(errorSpy).toHaveBeenCalled();
    const call = errorSpy.mock.calls[0][0];
    expect(call).toContain('[Phone Validation]');
    expect(call).toContain('Invalid format');
    expect(call).not.toContain('phone:');
  });

  it('should log with reason and phone', () => {
    logValidationFailure('Invalid format', '+5511999999999');
    expect(errorSpy).toHaveBeenCalled();
    const call = errorSpy.mock.calls[0][0];
    expect(call).toContain('phone: +5511999999999');
  });

  it('should include ISO timestamp', () => {
    logValidationFailure('Test');
    const call = errorSpy.mock.calls[0][0];
    // ISO timestamp should be present
    expect(call).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+Z/);
  });
});
