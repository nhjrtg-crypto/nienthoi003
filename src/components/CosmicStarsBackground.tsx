import React, { useMemo } from 'react';
import { NovelThemeId } from '../utils/themeStyles';
import { DarkBackgroundOption } from '../types';

export interface CosmicStarsBackgroundProps {
  theme?: NovelThemeId;
  isDarkMode?: boolean;
  darkBgOption?: DarkBackgroundOption;
  bgSeed?: number;
  purpleBgEffectsEnabled?: boolean;
}

interface SnowThemePalette {
  bg: string;
  sky: string;
  hills: string;
  fog: string;
  flake: string;
  heroBg: string;
  heroShadow: string;
}

function getSnowThemePalette(theme: NovelThemeId): SnowThemePalette {
  switch (theme) {
    case 'lululemon': // Berry / Plum
      return {
        bg: '#150d10',
        sky: 'linear-gradient(180deg, #130b0e 0%, #1e1016 54%, #2b141f 100%)',
        hills: 'radial-gradient(70% 130% at 18% 100%, #2e1622 0 52%, transparent 54%), radial-gradient(64% 118% at 56% 100%, #24111a 0 52%, transparent 54%), radial-gradient(80% 140% at 92% 100%, #351827 0 52%, transparent 54%)',
        fog: 'linear-gradient(transparent, rgba(132, 51, 75, 0.08) 62%, rgba(186, 56, 89, 0.16))',
        flake: '#fdf2f4',
        heroBg: 'radial-gradient(circle at 34% 30%, #ffffff 0 40%, rgba(253, 242, 244, 0.75) 70%, rgba(234, 212, 215, 0.2))',
        heroShadow: '0 0 10px -1px rgba(255, 255, 255, 0.65)',
      };

    case 'slate-haze': // Frost / Arctic Slate
      return {
        bg: '#0b1118',
        sky: 'linear-gradient(180deg, #090e15 0%, #101824 54%, #162436 100%)',
        hills: 'radial-gradient(70% 130% at 18% 100%, #1b2c40 0 52%, transparent 54%), radial-gradient(64% 118% at 56% 100%, #142131 0 52%, transparent 54%), radial-gradient(80% 140% at 92% 100%, #20344c 0 52%, transparent 54%)',
        fog: 'linear-gradient(transparent, rgba(56, 189, 248, 0.08) 62%, rgba(14, 165, 233, 0.16))',
        flake: '#f0f6fc',
        heroBg: 'radial-gradient(circle at 34% 30%, #ffffff 0 40%, rgba(240, 246, 252, 0.75) 70%, rgba(56, 189, 248, 0.2))',
        heroShadow: '0 0 10px -1px rgba(255, 255, 255, 0.65)',
      };

    case 'sage': // Deep Forest Sage
      return {
        bg: '#0d1710',
        sky: 'linear-gradient(180deg, #0a130d 0%, #112016 54%, #182e20 100%)',
        hills: 'radial-gradient(70% 130% at 18% 100%, #1d3626 0 52%, transparent 54%), radial-gradient(64% 118% at 56% 100%, #15271c 0 52%, transparent 54%), radial-gradient(80% 140% at 92% 100%, #22402d 0 52%, transparent 54%)',
        fog: 'linear-gradient(transparent, rgba(74, 222, 128, 0.06) 62%, rgba(34, 197, 94, 0.14))',
        flake: '#f0f7f2',
        heroBg: 'radial-gradient(circle at 34% 30%, #ffffff 0 40%, rgba(240, 247, 242, 0.75) 70%, rgba(140, 179, 145, 0.2))',
        heroShadow: '0 0 10px -1px rgba(255, 255, 255, 0.65)',
      };

    case 'mocha': // Warm Linen / Roasted Espresso
      return {
        bg: '#17110e',
        sky: 'linear-gradient(180deg, #130d0b 0%, #1e1511 54%, #2b1d17 100%)',
        hills: 'radial-gradient(70% 130% at 18% 100%, #30211a 0 52%, transparent 54%), radial-gradient(64% 118% at 56% 100%, #251914 0 52%, transparent 54%), radial-gradient(80% 140% at 92% 100%, #3a2820 0 52%, transparent 54%)',
        fog: 'linear-gradient(transparent, rgba(217, 119, 6, 0.06) 62%, rgba(180, 83, 9, 0.14))',
        flake: '#fbf8f5',
        heroBg: 'radial-gradient(circle at 34% 30%, #ffffff 0 40%, rgba(251, 248, 245, 0.75) 70%, rgba(196, 159, 143, 0.2))',
        heroShadow: '0 0 10px -1px rgba(255, 255, 255, 0.65)',
      };

    case 'notebook': // White Dark Mode / Obsidian Monochrome
      return {
        bg: '#121214',
        sky: 'linear-gradient(180deg, #0e0e10 0%, #161619 54%, #1f1f24 100%)',
        hills: 'radial-gradient(70% 130% at 18% 100%, #24242a 0 52%, transparent 54%), radial-gradient(64% 118% at 56% 100%, #1c1c21 0 52%, transparent 54%), radial-gradient(80% 140% at 92% 100%, #2c2c34 0 52%, transparent 54%)',
        fog: 'linear-gradient(transparent, rgba(255, 255, 255, 0.05) 62%, rgba(255, 255, 255, 0.12))',
        flake: '#ffffff',
        heroBg: 'radial-gradient(circle at 34% 30%, #ffffff 0 40%, rgba(255, 255, 255, 0.75) 70%, rgba(200, 200, 200, 0.2))',
        heroShadow: '0 0 10px -1px rgba(255, 255, 255, 0.65)',
      };

    case 'amethyst-haze': // Purple (Default)
    case 'cosmic':
    default:
      return {
        bg: '#060818',
        sky: 'linear-gradient(180deg, #060818 0%, #100b26 54%, #180f38 100%)',
        hills: 'radial-gradient(70% 130% at 18% 100%, #1a1038 0 52%, transparent 54%), radial-gradient(64% 118% at 56% 100%, #140b2e 0 52%, transparent 54%), radial-gradient(80% 140% at 92% 100%, #1f1244 0 52%, transparent 54%)',
        fog: 'linear-gradient(transparent, rgba(168, 85, 247, 0.08) 62%, rgba(147, 51, 234, 0.18))',
        flake: '#f5eeff',
        heroBg: 'radial-gradient(circle at 34% 30%, #ffffff 0 40%, rgba(245, 238, 255, 0.75) 70%, rgba(192, 132, 252, 0.2))',
        heroShadow: '0 0 10px -1px rgba(255, 255, 255, 0.65)',
      };
  }
}

const CosmicStarsBackgroundComponent: React.FC<CosmicStarsBackgroundProps> = ({
  theme = 'amethyst-haze',
  isDarkMode = true,
  purpleBgEffectsEnabled = false,
}) => {
  const isCosmic = theme === 'cosmic' || (theme === 'amethyst-haze' && isDarkMode);
  const isDarkEffective = isDarkMode || isCosmic;

  const palette = useMemo(() => getSnowThemePalette(theme), [theme]);

  if (!isDarkEffective || !purpleBgEffectsEnabled) {
    return null;
  }

  const snowStyle: React.CSSProperties = {
    ['--bga-25-bg' as any]: palette.bg,
    ['--bga-25-sky' as any]: palette.sky,
    ['--bga-25-hills' as any]: palette.hills,
    ['--bga-25-fog' as any]: palette.fog,
    ['--bga-25-flake' as any]: palette.flake,
    ['--bga-25-hero-bg' as any]: palette.heroBg,
    ['--bga-25-hero-shadow' as any]: palette.heroShadow,
    ['--bga-25-op' as any]: 1,
    ['--bga-25-spd' as any]: 1,
  };

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none transition-opacity duration-500 opacity-100"
      style={{ transform: 'translate3d(0, 0, 0)', backfaceVisibility: 'hidden' }}
      aria-hidden="true"
    >
      <section className="bga-25" style={snowStyle} aria-label="Falling snow weather background">
        <div className="bga-25__sky" aria-hidden="true" />
        <div className="bga-25__hills" aria-hidden="true" />
        <div className="bga-25__fog" aria-hidden="true" />

        <div className="bga-25__layer bga-25__layer--far" aria-hidden="true" />
        <div className="bga-25__layer bga-25__layer--mid" aria-hidden="true" />
        <div className="bga-25__layer bga-25__layer--near" aria-hidden="true" />

        <div className="bga-25__hero" aria-hidden="true">
          <span style={{ ['--bga-25-x' as any]: '9%', ['--bga-25-t' as any]: '11s', ['--bga-25-s' as any]: '9px', ['--bga-25-d' as any]: '-2s' }} />
          <span style={{ ['--bga-25-x' as any]: '21%', ['--bga-25-t' as any]: '15s', ['--bga-25-s' as any]: '6px', ['--bga-25-d' as any]: '-7s' }} />
          <span style={{ ['--bga-25-x' as any]: '34%', ['--bga-25-t' as any]: '9s', ['--bga-25-s' as any]: '11px', ['--bga-25-d' as any]: '-4s' }} />
          <span style={{ ['--bga-25-x' as any]: '48%', ['--bga-25-t' as any]: '13s', ['--bga-25-s' as any]: '7px', ['--bga-25-d' as any]: '-9s' }} />
          <span style={{ ['--bga-25-x' as any]: '59%', ['--bga-25-t' as any]: '17s', ['--bga-25-s' as any]: '10px', ['--bga-25-d' as any]: '-1s' }} />
          <span style={{ ['--bga-25-x' as any]: '71%', ['--bga-25-t' as any]: '10s', ['--bga-25-s' as any]: '8px', ['--bga-25-d' as any]: '-6s' }} />
          <span style={{ ['--bga-25-x' as any]: '84%', ['--bga-25-t' as any]: '14s', ['--bga-25-s' as any]: '12px', ['--bga-25-d' as any]: '-11s' }} />
          <span style={{ ['--bga-25-x' as any]: '94%', ['--bga-25-t' as any]: '12s', ['--bga-25-s' as any]: '7px', ['--bga-25-d' as any]: '-3s' }} />
        </div>
      </section>
    </div>
  );
};

export const CosmicStarsBackground = React.memo(CosmicStarsBackgroundComponent);
