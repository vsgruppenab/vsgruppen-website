import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, TEL} from '../theme';
import {KineticWords, Panel, StepLabel, slam, useUnit} from '../lib';

const HANDSET =
  'M6.6 10.8c1.2 2.4 3.2 4.4 5.6 5.6l1.9-1.9c.3-.3.7-.4 1.1-.2 1.2.4 2.5.7 3.8.7.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3c.6 0 1 .4 1 1 0 1.3.2 2.6.7 3.8.1.4 0 .8-.2 1.1l-2 1.9z';

export const Call: React.FC<{dur: number}> = ({dur}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const u = useUnit();
  const disc = 16 * u;

  const pop = slam(frame, fps, 2);
  const tail = interpolate(frame, [52, 66], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <Panel dur={dur} accent={C.hot}>
      <div
        style={{
          position: 'relative',
          width: disc,
          height: disc,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${pop})`,
        }}
      >
        {/* ringsignaler, täta */}
        {[0, 15, 30].map((offset) => {
          const l = (frame - 8 - offset) % 45;
          if (frame - 8 - offset < 0) return null;
          return (
            <div
              key={offset}
              style={{
                position: 'absolute',
                width: disc,
                height: disc,
                borderRadius: '50%',
                border: `${disc * 0.035}px solid ${C.hot}`,
                transform: `scale(${interpolate(l, [0, 45], [1, 1.75])})`,
                opacity: interpolate(l, [0, 45], [0.55, 0]),
              }}
            />
          );
        })}
        <div
          style={{
            width: disc,
            height: disc,
            borderRadius: '50%',
            background: C.hot,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width={disc * 0.5} height={disc * 0.5} viewBox="0 0 24 24" fill={C.white}>
            <path d={HANDSET} />
          </svg>
        </div>
      </div>

      <StepLabel step="2" text="Ring oss direkt" delay={8} accent={C.deep} />

      {/* siffrorna slår in en i taget */}
      <div style={{display: 'flex', marginTop: 1.2 * u}}>
        {TEL.split('').map((ch, i) => {
          const s = slam(frame, fps, 20 + i * 2);
          return (
            <span
              key={i}
              style={{
                fontSize: 11.5 * u,
                fontWeight: 800,
                color: C.hot,
                letterSpacing: -0.04 * u,
                whiteSpace: 'pre',
                display: 'inline-block',
                transform: `translateY(${(1 - s) * 5 * u}px) scale(${0.6 + 0.4 * s})`,
                opacity: Math.min(1, s * 1.6),
              }}
            >
              {ch}
            </span>
          );
        })}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.6 * u,
          marginTop: 2.4 * u,
          opacity: tail,
          transform: `translateY(${(1 - tail) * 2 * u}px)`,
        }}
      >
        <div
          style={{
            background: C.deep,
            color: C.white,
            fontSize: 3 * u,
            fontWeight: 800,
            padding: `${0.7 * u}px ${1.8 * u}px`,
            borderRadius: 999,
          }}
        >
          24/7
        </div>
        <KineticWords
          text="Jour i Linköping, året om"
          delay={54}
          size={3.6}
          weight={600}
          color={C.inkSoft}
          stagger={2}
        />
      </div>
    </Panel>
  );
};
