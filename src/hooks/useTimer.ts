import { useCallback, useEffect, useRef, useState } from 'react';

export function useTimer({ initcounter = 30, initStart = true }) {
  const [timer, setTimer] = useState<number>(initcounter);
  const [startTimer, setTimerStart] = useState<boolean>(initStart);
  const interval = useRef<any>(null);

  const resetTimer = useCallback(() => {
    clearInterval(interval.current);
    setTimer(initcounter);
    setTimerStart(initStart);
  }, [initcounter, initStart]);

  const stopTimer = useCallback(() => {
    clearInterval(interval.current);
    setTimerStart(false);
  }, []);

  function pad (n:any) {
    return (n < 10 && n != 0) ? ("0" + n) : n;
  }

  useEffect(() => {
    if (timer < 1) {
      setTimerStart(false);
      return;
    }
    if (startTimer) {
      interval.current = setInterval(() => setTimer((timer) => pad(timer - 1)), 1000);
    }
    return () => clearInterval(interval.current);
  }, [timer, startTimer]);

  return {
    timer,
    startTimer,
    setTimerStart,
    resetTimer,
    stopTimer,
  };
}
