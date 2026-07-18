'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion, animate } from 'motion/react';

export function CountUp({
  value,
  decimals = 0,
  prefix = '',
  suffix = '',
  duration = 1.2,
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView || reduceMotion) return;
    const controls = animate(0, value, {
      duration,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [inView, value, duration, reduceMotion]);

  const shown = reduceMotion ? (inView ? value : 0) : display;

  return (
    <span ref={ref} className="font-mono tabular-nums">
      {prefix}
      {shown.toLocaleString('en-GB', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}
