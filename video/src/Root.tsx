import React from 'react';
import {Composition} from 'remotion';
import {FPS, TOTAL} from './theme';
import {Showreel} from './Showreel';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="Showreel"
      component={Showreel}
      durationInFrames={TOTAL}
      fps={FPS}
      width={1920}
      height={1080}
    />
    <Composition
      id="ShowreelVertikal"
      component={Showreel}
      durationInFrames={TOTAL}
      fps={FPS}
      width={1080}
      height={1920}
    />
  </>
);
