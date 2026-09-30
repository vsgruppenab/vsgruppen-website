import {loadFont} from '@remotion/google-fonts/Poppins';

// Samma tokens som css/style.css på sajten
export const C = {
  blue: '#1535cb',
  blueDark: '#0e2490',
  deep: '#0a1650',
  blue50: '#f0f3fe',
  blue100: '#dfe6fc',
  blue200: '#becdf8',
  hot: '#e8452f',
  orange: '#f97316',
  ink: '#131c33',
  inkSoft: '#4d5a75',
  white: '#ffffff',
} as const;

export const {fontFamily} = loadFont('normal', {
  weights: ['400', '600', '800'],
  subsets: ['latin', 'latin-ext'],
});

export const FPS = 30;
export const TOTAL = 600; // 20,0 s

// Scenerna överlappar 14 frames så att panelsvepet aldrig visar en tom ruta.
export const SCENES = {
  open: {from: 0, dur: 110},
  leak: {from: 96, dur: 130},
  shutoff: {from: 212, dur: 130},
  call: {from: 328, dur: 145},
  outro: {from: 459, dur: 141},
} as const;

export const TEL = '076 882 70 70';
