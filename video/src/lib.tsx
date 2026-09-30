import React from 'react';
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, fontFamily} from './theme';

/** vmin-enhet: samma textstorlek i liggande och stående format. */
export const useUnit = () => {
  const {width, height} = useVideoConfig();
  return Math.min(width, height) / 100;
};

/** Studs med översläng — det som gör att text slår in istället för att tona. */
export const slam = (frame: number, fps: number, delay = 0) =>
  spring({
    frame: frame - delay,
    fps,
    config: {damping: 13, mass: 0.6, stiffness: 140},
  });

/** Lugnare studs för grafik som ska landa, inte studsa. */
export const settle = (frame: number, fps: number, delay = 0) =>
  spring({
    frame: frame - delay,
    fps,
    config: {damping: 200, mass: 0.8},
    durationInFrames: 24,
  });

/** Svagt driftande band i bakgrunden — håller bilden i rörelse hela tiden.
 *  Korta segment på olika höjd: ett fullbrett band som driver i sidled ser stilla ut. */
const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const {width} = useVideoConfig();
  const u = useUnit();
  const bands = [
    {top: 14, len: 34, speed: 0.9, start: 0.05},
    {top: 38, len: 22, speed: 1.4, start: 0.55},
    {top: 63, len: 40, speed: 0.7, start: 0.3},
    {top: 86, len: 26, speed: 1.1, start: 0.75},
  ];
  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
      {bands.map((b, i) => {
        const span = width + b.len * u;
        const x = ((b.start * span + frame * b.speed * u * 0.35) % span) - b.len * u;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: `${b.top}%`,
              left: x,
              width: b.len * u,
              height: 1.4 * u,
              borderRadius: 999,
              background: C.blue,
              opacity: 0.06,
            }}
          />
        );
      })}
    </div>
  );
};

/**
 * Scenpanel som sveper in från höger och ut åt vänster.
 * Kantbandet leder svepet så att klippet syns även när två scener
 * har samma bakgrundsfärg.
 */
export const Panel: React.FC<{
  dur: number;
  children: React.ReactNode;
  background?: string;
  accent?: string;
  backdrop?: boolean;
  exitSlide?: boolean;
}> = ({
  dur,
  children,
  background = C.blue50,
  accent = C.blue,
  backdrop = true,
  exitSlide = true,
}) => {
  const frame = useCurrentFrame();
  const {fps, width} = useVideoConfig();
  const u = useUnit();

  const enter = settle(frame, fps);
  const exitFrom = dur - 14;
  const exit =
    !exitSlide || frame < exitFrom
      ? 0
      : interpolate(frame, [exitFrom, dur], [0, 1], {
          extrapolateRight: 'clamp',
          easing: Easing.in(Easing.cubic),
        });

  const x = (1 - enter) * width * 0.7 - exit * width * 0.3;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background,
        fontFamily,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `translateX(${x}px)`,
        opacity: 1 - exit * 0.7,
      }}
    >
      {backdrop ? <Backdrop /> : null}
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: -1.4 * u,
          width: 1.4 * u,
          background: accent,
          opacity: 1 - enter,
        }}
      />
      {children}
    </div>
  );
};

/** Ord som slår in ett i taget. */
export const KineticWords: React.FC<{
  text: string;
  delay?: number;
  size: number;
  weight?: number;
  color?: string;
  stagger?: number;
}> = ({text, delay = 0, size, weight = 800, color = C.deep, stagger = 3}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const u = useUnit();

  return (
    <div style={{display: 'flex', gap: 0.28 * size * u * 0.05 + 0.02 * u, flexWrap: 'nowrap'}}>
      {text.split(' ').map((word, i) => {
        const s = slam(frame, fps, delay + i * stagger);
        return (
          <span
            key={i}
            style={{
              fontSize: size * u,
              fontWeight: weight,
              color,
              letterSpacing: -0.02 * u,
              whiteSpace: 'pre',
              display: 'inline-block',
              transform: `translateY(${(1 - s) * 0.9 * size * u}px)`,
              opacity: Math.min(1, s * 1.6),
            }}
          >
            {word}
            {i < text.split(' ').length - 1 ? ' ' : ''}
          </span>
        );
      })}
    </div>
  );
};

/** Numrerad stegmarkör som slår in tillsammans med sin text. */
export const StepLabel: React.FC<{
  step: string;
  text: string;
  delay?: number;
  accent?: string;
}> = ({step, text, delay = 0, accent = C.hot}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const u = useUnit();
  const s = slam(frame, fps, delay);

  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 2 * u, marginTop: 4 * u}}>
      <div
        style={{
          width: 6.6 * u,
          height: 6.6 * u,
          borderRadius: '50%',
          background: accent,
          color: C.white,
          fontSize: 3.6 * u,
          fontWeight: 800,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transform: `scale(${s})`,
        }}
      >
        {step}
      </div>
      <KineticWords text={text} delay={delay + 3} size={5} />
    </div>
  );
};
