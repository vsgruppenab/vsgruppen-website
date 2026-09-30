import React from 'react';
import {Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, TEL} from '../theme';
import {KineticWords, Panel, slam, useUnit} from '../lib';

export const Outro: React.FC<{dur: number}> = ({dur}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const u = useUnit();

  const logo = slam(frame, fps, 6);
  const line = interpolate(frame, [20, 42], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const web = interpolate(frame, [58, 72], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <Panel dur={dur} background={C.deep} accent={C.hot} backdrop={false} exitSlide={false}>
      <Img
        src={staticFile('vs-logo-vit.png')}
        style={{width: 42 * u, transform: `scale(${0.7 + 0.3 * logo})`, opacity: logo}}
      />

      <div
        style={{
          width: 42 * u * line,
          height: 0.4 * u,
          background: C.hot,
          borderRadius: 999,
          marginTop: 3 * u,
        }}
      />

      <div style={{marginTop: 3.2 * u}}>
        <KineticWords
          text="Rörmokare i Linköping · Dygnet runt"
          delay={26}
          size={4}
          weight={600}
          color={C.white}
          stagger={2}
        />
      </div>

      <div style={{marginTop: 1 * u}}>
        <KineticWords text={TEL} delay={40} size={7.4} color={C.white} stagger={3} />
      </div>

      <div
        style={{
          marginTop: 1.6 * u,
          fontSize: 3.4 * u,
          color: C.blue200,
          opacity: web,
        }}
      >
        vsgruppen.se
      </div>
    </Panel>
  );
};
