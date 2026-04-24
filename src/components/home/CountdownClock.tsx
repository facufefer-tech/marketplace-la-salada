"use client";

import { useEffect, useState } from "react";

function untilMidnight() {
  const now = new Date();
  const target = new Date(now);
  target.setHours(23, 59, 59, 999);
  const ms = Math.max(0, target.getTime() - now.getTime());
  const h = String(Math.floor(ms / 3600000)).padStart(2, "0");
  const m = String(Math.floor((ms % 3600000) / 60000)).padStart(2, "0");
  const s = String(Math.floor((ms % 60000) / 1000)).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

export function CountdownClock() {
  const [value, setValue] = useState("23:59:59");

  useEffect(() => {
    setValue(untilMidnight());
    const id = window.setInterval(() => setValue(untilMidnight()), 1000);
    return () => window.clearInterval(id);
  }, []);

  return <span>{value}</span>;
}
