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
  // Vertical-only margin: a bare '-80px' also shrinks the left/right detection band, which on narrow
  // viewports leaves a short, left-aligned number span outside it so the observer never fires and the
  // count-up stays at 0. '-80px 0px' keeps the trigger offset vertical and the horizontal band full-width.
  const inView = useInView(ref, { once: true, margin: '-80px 0px' });
  const reduceMotion = useReducedMotion();
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    if (reduceMotion || !inView) return;
    const controls = animate(0, value, {
      duration,
      ease: 'easeOut',
      onUpdate: (v) => setAnimated(v),
    });
    return () => controls.stop();
  }, [inView, value, duration, reduceMotion]);

  // Reduced motion shows the final value straight away (no gate on inView, never stuck at 0);
  // otherwise the animated value, which counts up once the element scrolls into view.
  const shown = reduceMotion ? value : animated;

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
