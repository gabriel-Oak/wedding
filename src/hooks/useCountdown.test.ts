import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCountdown } from './useCountdown';

describe('useCountdown', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns { days, hours, minutes, seconds } as numbers', () => {
    const target = new Date(Date.now() + 1000 * 60 * 60 * 24 * 2); // 2 days in future
    const { result } = renderHook(() => useCountdown(target));

    expect(typeof result.current.days).toBe('number');
    expect(typeof result.current.hours).toBe('number');
    expect(typeof result.current.minutes).toBe('number');
    expect(typeof result.current.seconds).toBe('number');
  });

  it('calculates approximately 1 day when target is 1 day in the future', () => {
    const target = new Date(Date.now() + 1000 * 60 * 60 * 24); // 1 day in future
    const { result } = renderHook(() => useCountdown(target));

    // With fake timers, Date.now() starts at 0, so target = 86400000
    // At render, difference = 86400000ms = exactly 1 day
    expect(result.current.days).toBe(1);
    expect(result.current.hours).toBe(0);
    expect(result.current.minutes).toBe(0);
    expect(result.current.seconds).toBe(0);
  });

  it('returns all zeros when target date is in the past', () => {
    const target = new Date(Date.now() - 1000 * 60 * 60 * 24); // 1 day in past
    const { result } = renderHook(() => useCountdown(target));

    expect(result.current.days).toBe(0);
    expect(result.current.hours).toBe(0);
    expect(result.current.minutes).toBe(0);
    expect(result.current.seconds).toBe(0);
  });

  it('updates values every second via setInterval', async () => {
    const target = new Date(Date.now() + 1000 * 60 * 60 * 24 + 1000 * 60 * 60);
    const { result } = renderHook(() => useCountdown(target));

    const initialTotal =
      result.current.days * 86400 +
      result.current.hours * 3600 +
      result.current.minutes * 60 +
      result.current.seconds;

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });

    const updatedTotal =
      result.current.days * 86400 +
      result.current.hours * 3600 +
      result.current.minutes * 60 +
      result.current.seconds;

    expect(updatedTotal).toBeLessThan(initialTotal);
  });

  it('stops updating after target date is reached', async () => {
    const target = new Date(Date.now() + 5000); // 5 seconds in future
    const { result } = renderHook(() => useCountdown(target));

    // Advance to 3 seconds — still before target
    await act(async () => {
      await vi.advanceTimersByTimeAsync(3000);
    });
    expect(result.current.days).toBe(0);
    expect(result.current.hours).toBe(0);
    expect(result.current.minutes).toBe(0);
    expect(result.current.seconds).toBeGreaterThan(0);

    // Advance past target (total 6 seconds)
    await act(async () => {
      await vi.advanceTimersByTimeAsync(3000);
    });

    expect(result.current.days).toBe(0);
    expect(result.current.hours).toBe(0);
    expect(result.current.minutes).toBe(0);
    expect(result.current.seconds).toBe(0);
  });

  it('clears interval on unmount', () => {
    const target = new Date(Date.now() + 1000 * 60 * 60 * 24);
    const { unmount } = renderHook(() => useCountdown(target));

    unmount();

    // Advance timers — should not cause any updates after unmount
    vi.advanceTimersByTimeAsync(2000);
  });

  it('accepts a string date', () => {
    const target = '2030-01-01T00:00:00Z';
    const { result } = renderHook(() => useCountdown(target));

    expect(typeof result.current.days).toBe('number');
    expect(typeof result.current.hours).toBe('number');
    expect(typeof result.current.minutes).toBe('number');
    expect(typeof result.current.seconds).toBe('number');
  });
});
