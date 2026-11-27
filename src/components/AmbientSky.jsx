import React, { useMemo } from 'react';

const STARS = [
  { top: '6%', left: '8%', size: 2, delay: '0s', dur: '3.8s' },
  { top: '12%', left: '16%', size: 1.5, delay: '1.1s', dur: '4.5s' },
  { top: '5%', left: '25%', size: 2.5, delay: '0.4s', dur: '5.2s' },
  { top: '18%', left: '33%', size: 1.5, delay: '2.0s', dur: '4.0s' },
  { top: '8%', left: '44%', size: 2, delay: '0.8s', dur: '4.8s' },
  { top: '15%', left: '54%', size: 1.5, delay: '1.7s', dur: '3.6s' },
  { top: '7%', left: '63%', size: 2.5, delay: '2.4s', dur: '5.0s' },
  { top: '20%', left: '72%', size: 1.5, delay: '0.6s', dur: '4.3s' },
  { top: '9%', left: '81%', size: 2, delay: '1.4s', dur: '3.9s' },
  { top: '16%', left: '90%', size: 2, delay: '2.1s', dur: '4.7s' },
  { top: '24%', left: '12%', size: 1.5, delay: '1.9s', dur: '4.4s' },
  { top: '28%', left: '28%', size: 2, delay: '0.2s', dur: '5.1s' },
  { top: '25%', left: '48%', size: 1.5, delay: '2.6s', dur: '4.2s' },
  { top: '31%', left: '66%', size: 2, delay: '1.0s', dur: '4.9s' },
  { top: '27%', left: '84%', size: 1.5, delay: '0.5s', dur: '3.7s' },
  { top: '36%', left: '6%', size: 2, delay: '1.3s', dur: '4.6s' },
  { top: '38%', left: '94%', size: 1.5, delay: '2.3s', dur: '4.1s' },
  { top: '4%', left: '74%', size: 2, delay: '0.9s', dur: '5.4s' },
];

const CLOUDS = [
  { top: '6%', width: 240, height: 68, opacity: 0.55, dur: '68s', delay: '-12s' },
  { top: '14%', width: 190, height: 54, opacity: 0.42, dur: '84s', delay: '-42s' },
  { top: '24%', width: 280, height: 76, opacity: 0.36, dur: '96s', delay: '-26s' },
  { top: '10%', width: 160, height: 46, opacity: 0.48, dur: '74s', delay: '-58s' },
];

/**
 * Lightweight GPU-composited sky layer:
 * - Dark theme: twinkling cold-blue stars + subtle periodic shooting star
 * - Light theme: serene drifting clouds in a cool-blue sky
 */
export default function AmbientSky({ theme }) {
  const isDark = theme === 'dark';

  const starNodes = useMemo(
    () =>
      STARS.map((s, idx) => (
        <span
          key={idx}
          className="sky-star"
          style={{
            top: s.top,
            left: s.left,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animationDuration: s.dur,
            animationDelay: s.delay,
          }}
        />
      )),
    []
  );

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden z-0 select-none"
      style={{ contain: 'strict' }}
    >
      {isDark ? (
        <div className="absolute inset-0">
          {starNodes}
          <span className="sky-shooting-star" />
        </div>
      ) : (
        <div className="absolute inset-0">
          {CLOUDS.map((c, idx) => (
            <div
              key={idx}
              className="sky-cloud"
              style={{
                top: c.top,
                width: `${c.width}px`,
                height: `${c.height}px`,
                opacity: c.opacity,
                animationDuration: c.dur,
                animationDelay: c.delay,
              }}
            >
              <svg
                viewBox="0 0 240 72"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
              >
                <defs>
                  <linearGradient id={`cloudGrad-${idx}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="#dbeafe" stopOpacity="0.55" />
                  </linearGradient>
                </defs>
                <path
                  d="M42 58H198C214.569 58 228 46.359 228 32C228 19.04 217.07 8.29 202.75 6.32C197.43 -2.01 187.48 -6.5 176.5 -4.9C169.36 -14.7 156.25 -20 142.5 -17.5C130.9 -26.2 113.8 -25.1 103.5 -14.8C91.2 -17.5 78.2 -11.4 72.5 0.2C56.8 -0.8 43.2 8.7 39.2 22.4C25.5 23.8 15 34.1 15 46.5C15 53.1 26.8 58 42 58Z"
                  transform="translate(0 14)"
                  fill={`url(#cloudGrad-${idx})`}
                />
              </svg>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
