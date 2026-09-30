import React from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C} from '../theme';
import {KineticWords, Panel, settle, useUnit} from '../lib';

const DROPS = [26, 40, 54, 68, 82, 96, 110];
const LEAK_X = 68;
const FLOOR_Y = 248;

export const Leak: React.FC<{dur: number}> = ({dur}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const u = useUnit();

  // Delarna flyger in från olika håll och landar.
  const tank = settle(frame, fps, 2);
  const bowl = settle(frame, fps, 6);
  const pipe = settle(frame, fps, 10);
  const floor = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const patchRx = interpolate(frame, [26, 54, 82, 110, 126], [0, 26, 50, 70, 84], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  // Långsam inzoomning — bilden står aldrig helt still.
  const push = interpolate(frame, [0, dur], [1, 1.09]);

  const outline = {
    stroke: C.deep,
    strokeWidth: 2.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none',
  };

  return (
    <Panel dur={dur}>
      <svg
        width={50 * u}
        viewBox="0 0 280 272"
        style={{overflow: 'visible', transform: `scale(${push})`}}
      >
        <ellipse
          cx={LEAK_X}
          cy={FLOOR_Y + 1}
          rx={patchRx}
          ry={patchRx * 0.17}
          fill={C.blue}
          opacity={0.22}
        />
        <ellipse
          cx={LEAK_X}
          cy={FLOOR_Y + 1}
          rx={patchRx * 0.5}
          ry={patchRx * 0.09}
          fill={C.blue}
          opacity={0.3}
        />

        <path
          d={`M14 ${FLOOR_Y} H266`}
          {...outline}
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - floor}
        />

        {/* skål och fot — upp från golvet */}
        <g {...outline} transform={`translate(0 ${(1 - bowl) * 70})`} opacity={bowl}>
          <rect x={96} y={140} width={136} height={22} rx={11} />
          <path d="M112 162 C110 200 122 226 132 238 M230 162 C228 200 210 226 198 238" />
          <path d="M132 238 H198" />
          <rect x={130} y={238} width={68} height={10} rx={3} />
        </g>

        {/* cistern — ner från ovan */}
        <g {...outline} transform={`translate(0 ${(1 - tank) * -90})`} opacity={tank}>
          <rect x={100} y={44} width={64} height={96} rx={8} />
          <path d="M110 64 H154" strokeWidth={1.6} opacity={0.4} />
        </g>

        {/* tilloppsrör — in från vänster */}
        <g {...outline} transform={`translate(${(1 - pipe) * -80} 0)`} opacity={pipe}>
          <rect x={62} y={150} width={12} height={98} rx={3} />
          <rect x={62} y={138} width={46} height={12} rx={3} />
          <rect x={54} y={190} width={28} height={18} rx={3} />
        </g>

        {DROPS.map((start, i) => {
          const l = frame - start;
          if (l < 0 || l > 26) return null;
          if (l <= 11) {
            const y = interpolate(l, [0, 11], [212, FLOOR_Y - 2], {
              easing: Easing.in(Easing.quad),
            });
            return (
              <ellipse
                key={i}
                cx={LEAK_X}
                cy={y}
                rx={3.4}
                ry={3.4 * interpolate(l, [0, 11], [1, 1.7])}
                fill={C.blue}
              />
            );
          }
          const rl = l - 11;
          return (
            <ellipse
              key={i}
              cx={LEAK_X}
              cy={FLOOR_Y}
              rx={interpolate(rl, [0, 15], [2, 22])}
              ry={interpolate(rl, [0, 15], [0.6, 6])}
              fill="none"
              stroke={C.blue}
              strokeWidth={1.6}
              opacity={interpolate(rl, [0, 15], [0.8, 0])}
            />
          );
        })}
      </svg>

      <div style={{marginTop: 4 * u}}>
        <KineticWords text="Vatten på golvet." delay={34} size={6.4} />
      </div>
    </Panel>
  );
};
