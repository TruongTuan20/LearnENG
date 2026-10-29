"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLearning } from "@/components/provider";
import { localDate } from "@/lib/learning";

export function useStudyTimer(lessonId: string) {
  const { update, data } = useLearning();
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const started = useRef<number | null>(null);
  const remainder = useRef(0);
  const sessionId = useRef("");
  const timezone = useRef(data.settings.timezone);
  timezone.current = data.settings.timezone;
  const flush = useCallback(() => {
    if (started.current === null) return;
    const now = performance.now();
    const delta = (now - started.current) / 1000 + remainder.current;
    const seconds = Math.floor(delta);
    remainder.current = delta - seconds;
    started.current = now;
    if (!seconds) return;
    setElapsed((v) => v + seconds);
    const date = localDate(timezone.current);
    const id = `${sessionId.current}:${date}`;
    update((d) => {
      const existing = d.sessions.find((s) => s.id === id);
      return {
        ...d,
        sessions: existing
          ? d.sessions.map((s) =>
              s.id === id ? { ...s, seconds: s.seconds + seconds } : s,
            )
          : [...d.sessions, { id, lessonId, date, seconds }],
      };
    });
  }, [lessonId, update]);
  useEffect(() => {
    const pause = () => {
      flush();
      started.current = null;
      setRunning(false);
    };
    const hidden = () => {
      if (document.hidden) pause();
    };
    const interval = setInterval(flush, 1000);
    document.addEventListener("visibilitychange", hidden);
    window.addEventListener("pagehide", pause);
    return () => {
      flush();
      started.current = null;
      clearInterval(interval);
      document.removeEventListener("visibilitychange", hidden);
      window.removeEventListener("pagehide", pause);
    };
  }, [flush]);
  function toggle() {
    if (started.current !== null) {
      flush();
      started.current = null;
      setRunning(false);
    } else {
      sessionId.current = crypto.randomUUID();
      started.current = performance.now();
      setRunning(true);
    }
  }
  return { running, elapsed, toggle };
}
