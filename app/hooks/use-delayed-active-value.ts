import { useCallback, useEffect, useRef, useState } from "react";

export function useDelayedActiveValue<T>(delay = 90) {
  const [activeValue, setActiveValue] = useState<T | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearReset = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const activate = useCallback(
    (value: T) => {
      clearReset();
      setActiveValue(value);
    },
    [clearReset],
  );

  const scheduleReset = useCallback(() => {
    clearReset();
    timerRef.current = setTimeout(() => {
      setActiveValue(null);
      timerRef.current = null;
    }, delay);
  }, [clearReset, delay]);

  useEffect(() => clearReset, [clearReset]);

  return { activeValue, activate, scheduleReset };
}
