import { useEffect, useState } from "react";
import { getTimeParts } from "../utils/format";

export function useCountdown(targetDate) {
  const [parts, setParts] = useState(() => getTimeParts(targetDate));

  useEffect(() => {
    if (!targetDate) return;
    const tick = () => setParts(getTimeParts(targetDate));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return parts;
}
