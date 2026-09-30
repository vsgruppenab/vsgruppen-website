import React from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C} from '../theme';
import {Panel, StepLabel, settle, slam, useUnit} from '../lib';

const TURN = 46; // spaken slår om

export const ShutOff: React.FC<{dur: number}> = ({dur}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const u = useUnit();

  const pipeIn = settle(frame, fps, 0);
  const valveIn = settle(frame, fps, 12);

  // Översläng i studsen gör att spaken smäller fast, inte glider.
  const angle = Math.min(100, 90 * slam(frame, fps, TURN));
  const closed = frame >= TURN + 4;

  const flowFrame = closed ? TURN + 4 : frame;
  const dashOffset = -flowFrame * 6;
  const downstream = interpolate(frame, [TURN + 4, TURN + 20], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Litet ryck i hela bilden när spaken slår i.
  const punch =
    frame >= TURN + 3
      ? 1 +
        0.035 *
          interpolate(frame, [TURN + 3, TURN + 12], [1, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.out(Easing.cubic),
          })
      : 1;

  const water = (x: number, width: number, o: number) => (
    <g opacity={o}>
      <rect x={x} y={71.5} width={width} height={27} fill={C.blue} />
      <line
        x1={x}
        y1={85}
        x2={x + width}
        y2={85}
        stroke={C.white}
        strokeWidth={5}
        strokeLinecap="round"
        strokeDasharray="26 40"
        strokeDashoffset={dashOffset}
        opacity={0.35}
      />
    </g>
  );

  return (
    <Panel dur={dur} accent={C.hot}>
      <svg
        width={66 * u}
        viewBox="0 0 400 128"
        style={{overflow: 'visible', transform: `scale(${punch})`}}
      >
        <defs>
          <clipPath id="pipeInner">
            <rect x={11.4} y={71.4} width={377.2} height={27.2} rx={5} />
          </clipPath>
        </defs>

        <g transform={`translate(${(1 - pipeIn) * -440} 0)`}>
          <g clipPath="url(#pipeInner)">
            {water(0, 200, 1)}
            {water(200, 200, downstream)}
          </g>
          <rect
            x={10}
            y={70}
            width={380}
            height={30}
            rx={6}
            fill="none"
            stroke={C.deep}
            strokeWidth={2.8}
          />
        </g>

        <g transform={`translate(0 ${(1 - valveIn) * -120})`} opacity={valveIn}>
          <rect x={184} y={60} width={32} height={50} rx={5} fill={C.deep} />
          <g transform={`rotate(${angle} 200 62)`}>
            <rect x={196} y={18} width={8} height={44} rx={4} fill={C.hot} />
            <circle cx={200} cy={20} r={7} fill={C.hot} />
          </g>
        </g>
      </svg>

      <StepLabel step="1" text="Stäng av huvudkranen" delay={TURN + 4} />
    </Panel>
  );
};
