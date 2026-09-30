import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {C, SCENES} from './theme';
import {Open} from './scenes/Open';
import {Leak} from './scenes/Leak';
import {ShutOff} from './scenes/ShutOff';
import {Call} from './scenes/Call';
import {Outro} from './scenes/Outro';

export const Showreel: React.FC = () => (
  <AbsoluteFill style={{background: C.blue50}}>
    <Sequence from={SCENES.open.from} durationInFrames={SCENES.open.dur}>
      <Open dur={SCENES.open.dur} />
    </Sequence>
    <Sequence from={SCENES.leak.from} durationInFrames={SCENES.leak.dur}>
      <Leak dur={SCENES.leak.dur} />
    </Sequence>
    <Sequence from={SCENES.shutoff.from} durationInFrames={SCENES.shutoff.dur}>
      <ShutOff dur={SCENES.shutoff.dur} />
    </Sequence>
    <Sequence from={SCENES.call.from} durationInFrames={SCENES.call.dur}>
      <Call dur={SCENES.call.dur} />
    </Sequence>
    <Sequence from={SCENES.outro.from} durationInFrames={SCENES.outro.dur}>
      <Outro dur={SCENES.outro.dur} />
    </Sequence>
  </AbsoluteFill>
);
