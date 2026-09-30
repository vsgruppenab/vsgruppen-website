import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {C} from '../theme';
import {KineticWords, Panel, useUnit} from '../lib';

const HIT = 14; // droppen träffar
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const Open: React.FC<{dur: number}> = ({dur}) => {
  const frame = useCurrentFrame();
  const u = useUnit();

  const dropY = interpolate(frame, [0, HIT], [-30, 150], {
    ...clamp,
    easing: Easing.in(Easing.quad),
  });
  const stretch = interpolate(frame, [0, HIT], [1.2, 1.9], clamp);
  const puddle = interpolate(frame, [HIT, HIT + 40], [0, 96], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });

  return (
    <Panel dur={dur} accent={C.hot}>
      <svg width={34 * u} viewBox="0 0 200 200" style={{overflow: 'visible'}}>
        <ellipse cx={100} cy={152} rx={puddle} ry={puddle * 0.16} fill={C.blue} opacity={0.2} />

        {frame < HIT + 2 ? (
          <ellipse cx={100} cy={dropY} rx={7} ry={7 * stretch} fill={C.blue} />
        ) : null}

        {/* ringar som exploderar utåt */}
        {[0, 6, 12].map((off) => {
          const l = frame - HIT - off;
          if (l < 0 || l > 34) return null;
          const r = interpolate(l, [0, 34], [4, 90], {easing: Easing.out(Easing.cubic)});
          return (
            <ellipse
              key={off}
              cx={100}
              cy={152}
              rx={r}
              ry={r * 0.16}
              fill="none"
              stroke={C.blue}
              strokeWidth={2.4}
              opacity={interpolate(l, [0, 34], [0.8, 0])}
            />
          );
        })}

        {/* stänk som skjuter upp */}
        {[-1, -0.5, 0.5, 1].map((dir) => {
          const l = frame - HIT;
          if (l < 0 || l > 22) return null;
          const t = l / 22;
          const x = 100 + dir * 40 * t;
          const y = 152 - 44 * Math.sin(Math.PI * t) * (1 - Math.abs(dir) * 0.3);
          return <circle key={dir} cx={x} cy={y} r={3.2 * (1 - t * 0.6)} fill={C.blue} />;
        })}
      </svg>

      <KineticWords text="DET LÄCKER." delay={HIT + 4} size={13} />
      <div style={{marginTop: 1.4 * u}}>
        <KineticWords
          text="Hemma. Just nu."
          delay={HIT + 30}
          size={4.6}
          weight={600}
          color={C.inkSoft}
          stagger={4}
        />
      </div>
    </Panel>
  );
};
