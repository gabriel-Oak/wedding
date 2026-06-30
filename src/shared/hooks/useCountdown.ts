/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useLayoutEffect, useEffect } from 'react';

export interface CountdownValues {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const MILLISECONDS_PER_DAY = 86400000;
const MILLISECONDS_PER_HOUR = 3600000;
const MILLISECONDS_PER_MINUTE = 60000;
const MILLISECONDS_PER_SECOND = 1000;

function calculateCountdown(targetDate: Date): CountdownValues {
  const now = Date.now();
  const difference = targetDate.getTime() - now;

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const days = Math.floor(difference / MILLISECONDS_PER_DAY);
  const hours = Math.floor((difference % MILLISECONDS_PER_DAY) / MILLISECONDS_PER_HOUR);
  const minutes = Math.floor((difference % MILLISECONDS_PER_HOUR) / MILLISECONDS_PER_MINUTE);
  const seconds = Math.floor((difference % MILLISECONDS_PER_MINUTE) / MILLISECONDS_PER_SECOND);

  return { days, hours, minutes, seconds };
}

export function useCountdown(targetDate: Date | string): CountdownValues {
  const [countdown, setCountdown] = useState<CountdownValues>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // useLayoutEffect fires synchronously after render, before browser paint.
  // This ensures the real countdown value is set before the user sees anything,
  // while the initial zero values match SSR to prevent hydration mismatch.
  useLayoutEffect(() => {
    setCountdown(calculateCountdown(new Date(targetDate)));
  }, [targetDate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(calculateCountdown(new Date(targetDate)));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return countdown;
}
