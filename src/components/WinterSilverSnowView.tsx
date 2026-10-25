import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Search,
  X,
  Palette,
  Menu,
  Check,
  Heart,
  Calendar as CalendarIcon,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Clock,
  Snowflake,
  BookOpen,
} from 'lucide-react';
import { cosmicAudio } from '../utils/audioSynth';
import {
  NOVEL_THEME_OPTIONS,
  getNovelThemeStyles,
  getRecentUpdatesCardStyles,
  NovelThemeId,
} from '../utils/themeStyles';
import { ClayThemeToggle } from './ClayThemeToggle';
import { getRecentReads, RecentReadRecord } from '../utils/recentReads';
import { getDirectImageUrl, handleCoverImageError } from '../utils/imageUtils';
import { safeStorage } from '../utils/safeStorage';
import { Novel } from '../types';
import { EntireWhiteLilyAzureWidget } from './EntireWhiteLilyAzureWidget';
import { EntireDarkLibraryWidget } from './EntireDarkLibraryWidget';

export interface WinterSilverSnowViewProps {
  onBackToNovels: () => void;
  novels?: Novel[];
  onSelectNovel?: (novel: Novel) => void;
  onOpenNovelToReadingPosition?: (novel: Novel, chapterNumber: number) => void;
  isAdmin?: boolean;
  theme?: string;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
  onOpenAdminAuth?: () => void;
  onOpenLightIntro?: () => void;
  onNavigateToGarden?: () => void;
  onNavigateToCandle?: () => void;
  onNavigateToPortfolio?: () => void;
}

// 31 Pure Romantic English Poems (No seasonal themes - purely love, devotion, soulmates, starlight & passion)
interface DailyRomanticPoem {
  day: number;
  lines: string[];
}

const ROMANTIC_POEMS: DailyRomanticPoem[] = [
  {
    day: 1,
    lines: [
      'My love for you shall know no fear nor end,',
      'My comrade, brother, soulmate, truest friend;',
      'Against the darkening skies we stand as one,',
      'Until the night is conquered by the sun.',
    ],
  },
  {
    day: 2,
    lines: [
      'My bounty is as boundless as the sea,',
      'My love as deep; the more I give to thee,',
      'The more I have, for both are infinite.',
    ],
  },
  {
    day: 3,
    lines: [
      'How do I love thee? Let me count the ways.',
      'I love thee to the depth and breadth and height',
      'My soul can reach, when feeling out of sight',
      'For the ends of being and ideal grace.',
    ],
  },
  {
    day: 4,
    lines: [
      'i carry your heart with me (i carry it in',
      'my heart) i am never without it',
      'here is the deepest secret nobody knows',
      'i carry your heart (i carry it in my heart).',
    ],
  },
  {
    day: 5,
    lines: [
      'Out of the night that covers me,',
      'Black as the pit from pole to pole,',
      'I find your hand beside my own,',
      'Unconquered heart, unbroken soul.',
    ],
  },
  {
    day: 6,
    lines: [
      'O my love is like a melody',
      'That’s boldly played in tune;',
      'As strong art thou, my steadfast soul,',
      'Through every storm and moon.',
    ],
  },
  {
    day: 7,
    lines: [
      'For the stars never rise, but I feel the bright eyes',
      'Of the soul that I love evermore;',
      'When the tempest is high, together we stand,',
      'On this unyielding shore.',
    ],
  },
  {
    day: 8,
    lines: [
      'The fountains mingle with the river',
      'And the rivers with the ocean,',
      'Two spirits bound in quiet strength,',
      'With deep and pure devotion.',
    ],
  },
  {
    day: 9,
    lines: [
      'My love shall ever grow',
      'Vaster than empires and more slow;',
      'Through bitter frost and searing flame,',
      'My lips shall praise your sacred name.',
    ],
  },
  {
    day: 10,
    lines: [
      'How many loved your moments of glad grace,',
      'And loved your beauty with love false or true,',
      'But one man loved the pilgrim soul in you,',
      'And loved the sorrows of your changing face.',
    ],
  },
  {
    day: 11,
    lines: [
      'Grow old along with me! The best is yet to be,',
      'The last of life, for which the first was made.',
      'Our times are in his hand, united firm we stand,',
      'Two beating hearts whom nothing shall dissuade.',
    ],
  },
  {
    day: 12,
    lines: [
      'If I know what love is, it is because of you.',
      'A quiet anchor when the world turns wild and cold,',
      'A golden thread of devotion woven true,',
      'A bond more precious than the finest gold.',
    ],
  },
  {
    day: 13,
    lines: [
      'I loved you first: but afterwards your love,',
      'Outsoaring mine, sang such a lofty song',
      'As drowned the world and turned the sky above,',
      'To where eternal faithful souls belong.',
    ],
  },
  {
    day: 14,
    lines: [
      'Doubt thou the stars are fire;',
      'Doubt that the sun doth move;',
      'Doubt truth to be a liar;',
      'But never doubt I love.',
    ],
  },
  {
    day: 15,
    lines: [
      'We loved with a love that was more than love—',
      'I and my dearest soul, my heart’s delight;',
      'With a love that the winged seraphs of Heaven',
      'Coveted both of us through the silver night.',
    ],
  },
  {
    day: 16,
    lines: [
      'Whatever our souls are made of, yours and mine are the same.',
      'Through shadows, storms, and the silent falling rain,',
      'I speak your name into the quiet dark,',
      'And find in you my sanctuary and my spark.',
    ],
  },
  {
    day: 17,
    lines: [
      'Yours is the light by which my spirit’s born:',
      'Yours is the darkness of my soul’s return—',
      'You are my sun, my moon, and all my stars,',
      'Beyond the reach of earthly wounds and scars.',
    ],
  },
  {
    day: 18,
    lines: [
      'He is more myself than I am.',
      'Whatever our spirits are made of, they are one;',
      'An unyielding flame that burns through every storm,',
      'A radiant light beneath a winter sun.',
    ],
  },
  {
    day: 19,
    lines: [
      'When I look at you, I am home.',
      'No journey too long, no burden too steep,',
      'Beside you my restless spirit rests calm,',
      'In a quiet devotion tender and deep.',
    ],
  },
  {
    day: 20,
    lines: [
      'I have crossed oceans of time to find you,',
      'My fierce companion, my enduring grace;',
      'Through centuries of silence and of stone,',
      'I find my haven only in your face.',
    ],
  },
  {
    day: 21,
    lines: [
      'In vain have I struggled. It will not do.',
      'My feelings will not be repressed.',
      'You must allow me to tell you how ardently',
      'I admire and love you above the rest.',
    ],
  },
  {
    day: 22,
    lines: [
      'You pierce my soul. I am half agony, half hope.',
      'Tell me not that I am too late,',
      'That such precious feelings are gone forever.',
      'I offer myself to you again with a heart more your own.',
    ],
  },
  {
    day: 23,
    lines: [
      'Take all my loves, my love, yea take them all;',
      'What hast thou then more than thou hadst before?',
      'No love, my love, that thou mayst true love call;',
      'All mine was thine, before thou hadst this more.',
    ],
  },
  {
    day: 24,
    lines: [
      'Shall I compare thee to a summer’s day?',
      'Thou art more lovely and more temperate:',
      'Rough winds do shake the darling buds of May,',
      'And summer’s lease hath all too short a date.',
    ],
  },
  {
    day: 25,
    lines: [
      'Let me not to the marriage of true minds',
      'Admit impediments. Love is not love',
      'Which alters when it alteration finds,',
      'Or bends with the remover to remove.',
    ],
  },
  {
    day: 26,
    lines: [
      'O, no! it is an ever-fixed mark',
      'That looks on tempests and is never shaken;',
      'It is the star to every wandering bark,',
      'Whose worth’s unknown, although his height be taken.',
    ],
  },
  {
    day: 27,
    lines: [
      'Love alters not with his brief hours and weeks,',
      'But bears it out even to the edge of doom.',
      'If this be error and upon me proved,',
      'I never writ, nor no man ever loved.',
    ],
  },
  {
    day: 28,
    lines: [
      'So long as men can breathe or eyes can see,',
      'So long lives this, and this gives life to thee.',
      'Together hand in hand through wind and frost,',
      'In you I found what I had thought was lost.',
    ],
  },
  {
    day: 29,
    lines: [
      'My heart is like a singing bird',
      'Whose nest is in a watered shoot;',
      'My heart is gladder than all these,',
      'Because my love is come to me.',
    ],
  },
  {
    day: 30,
    lines: [
      'If you live to be a hundred,',
      'I want to live to be a hundred minus one day,',
      'So I never have to live without you,',
      'Along this quiet and silver way.',
    ],
  },
  {
    day: 31,
    lines: [
      'For you, a thousand times over.',
      'Through every trial, through frost and night,',
      'Our love remains an unextinguished fire,',
      'Our silver sanctuary, our guiding light.',
    ],
  },
];

// Complex 6-Point Snowflake SVG Graphic with delicate, semi-translucent styling
const IntricateSnowflakeSVG: React.FC<{
  size?: number | string;
  className?: string;
  style?: React.CSSProperties;
  color?: string;
}> = ({ size = '100%', className = '', style, color = 'rgba(255, 255, 255, 0.85)' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 200 200"
    className={className}
    style={style}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Concentric subtle rings */}
    <circle cx="100" cy="100" r="88" stroke={color} strokeWidth="0.8" strokeDasharray="3 4" opacity="0.3" />
    <circle cx="100" cy="100" r="64" stroke={color} strokeWidth="0.8" opacity="0.35" />
    <circle cx="100" cy="100" r="38" stroke={color} strokeWidth="0.8" strokeDasharray="2 2" opacity="0.4" />
    <circle cx="100" cy="100" r="14" stroke={color} strokeWidth="1" opacity="0.55" />
    <circle cx="100" cy="100" r="4" fill={color} opacity="0.9" />

    {/* 6 Symmetrical Main Spokes with Ice Fractals */}
    {[0, 60, 120, 180, 240, 300].map((angle) => (
      <g key={angle} transform={`rotate(${angle} 100 100)`}>
        {/* Main spine stem */}
        <line x1="100" y1="100" x2="100" y2="12" stroke={color} strokeWidth="1.4" strokeLinecap="round" opacity="0.9" />
        {/* Diamond tip */}
        <polygon points="100,6 104,14 100,18 96,14" fill={color} opacity="0.9" />

        {/* Outer barb pair */}
        <line x1="100" y1="32" x2="84" y2="18" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.8" />
        <line x1="100" y1="32" x2="116" y2="18" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.8" />

        {/* Secondary branchlet on outer barb */}
        <line x1="90" y1="23" x2="88" y2="16" stroke={color} strokeWidth="0.8" strokeLinecap="round" opacity="0.65" />
        <line x1="110" y1="23" x2="112" y2="16" stroke={color} strokeWidth="0.8" strokeLinecap="round" opacity="0.65" />

        {/* Middle large barb pair with chevron cross */}
        <line x1="100" y1="52" x2="76" y2="34" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.85" />
        <line x1="100" y1="52" x2="124" y2="34" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.85" />

        <line x1="84" y1="40" x2="78" y2="46" stroke={color} strokeWidth="0.9" strokeLinecap="round" opacity="0.7" />
        <line x1="116" y1="40" x2="122" y2="46" stroke={color} strokeWidth="0.9" strokeLinecap="round" opacity="0.7" />

        {/* Inner chevron barb pair */}
        <line x1="100" y1="72" x2="86" y2="60" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.75" />
        <line x1="100" y1="72" x2="114" y2="60" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.75" />

        {/* Inner crystal star point */}
        <polygon points="100,84 103,90 100,94 97,90" fill={color} opacity="0.65" />
      </g>
    ))}
  </svg>
);

// Small 4-Point Star Icon
const Small4PointStar: React.FC<{ size?: number; color?: string; className?: string }> = ({ size = 14, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5Z" />
  </svg>
);

// Exquisite 6-Point Crystal Snowflake SVG (Replacing 8-ray asterisk)
const CrystalSnowflake6Point: React.FC<{
  size?: number;
  className?: string;
  style?: React.CSSProperties;
  color?: string;
}> = ({ size = 22, className = '', style, color = 'white' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    className={className}
    style={style}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Central Hexagonal Core Star */}
    <circle cx="24" cy="24" r="3.5" stroke={color} strokeWidth="0.8" opacity="0.85" />
    <circle cx="24" cy="24" r="1.2" fill={color} />

    {/* 6 Intricate Symmetrical Arms with Dendritic Chevron Fractals */}
    {[0, 60, 120, 180, 240, 300].map((angle) => (
      <g key={angle} transform={`rotate(${angle} 24 24)`}>
        {/* Main Spine Arm */}
        <line x1="24" y1="24" x2="24" y2="3.5" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
        {/* Diamond Arrowhead Tip */}
        <polygon points="24,1.5 25.8,4.5 24,6 22.2,4.5" fill={color} />

        {/* Outer Chevron Barb */}
        <line x1="24" y1="9" x2="19.5" y2="4.5" stroke={color} strokeWidth="0.9" strokeLinecap="round" />
        <line x1="24" y1="9" x2="28.5" y2="4.5" stroke={color} strokeWidth="0.9" strokeLinecap="round" />

        {/* Outer Mini Sub-needles */}
        <line x1="21.5" y1="6.5" x2="20.5" y2="3.5" stroke={color} strokeWidth="0.65" strokeLinecap="round" />
        <line x1="26.5" y1="6.5" x2="27.5" y2="3.5" stroke={color} strokeWidth="0.65" strokeLinecap="round" />

        {/* Middle Chevron Barb with Cross-Needle */}
        <line x1="24" y1="14" x2="17.5" y2="8.5" stroke={color} strokeWidth="1" strokeLinecap="round" />
        <line x1="24" y1="14" x2="30.5" y2="8.5" stroke={color} strokeWidth="1" strokeLinecap="round" />

        {/* Barb Micro Diamond Accents */}
        <circle cx="17.5" cy="8.5" r="0.8" fill={color} />
        <circle cx="30.5" cy="8.5" r="0.8" fill={color} />

        {/* Inner Chevron Barb */}
        <line x1="24" y1="18.5" x2="20" y2="15" stroke={color} strokeWidth="0.85" strokeLinecap="round" />
        <line x1="24" y1="18.5" x2="28" y2="15" stroke={color} strokeWidth="0.85" strokeLinecap="round" />
      </g>
    ))}
  </svg>
);

// Alternative Snowflake Design for scattered light mode icons
const AlternativeSnowflakeSVG: React.FC<{
  size?: number;
  className?: string;
  style?: React.CSSProperties;
  color?: string;
}> = ({ size = 20, className = '', style, color = 'white' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 40 40"
    className={className}
    style={style}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="20" cy="20" r="3" stroke={color} strokeWidth="1" fill={color} fillOpacity="0.3" />
    {[0, 60, 120, 180, 240, 300].map((angle) => (
      <g key={angle} transform={`rotate(${angle} 20 20)`}>
        <line x1="20" y1="20" x2="20" y2="4" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
        <polygon points="20,2 22,6 20,9 18,6" fill={color} />
        <line x1="20" y1="9" x2="16" y2="6" stroke={color} strokeWidth="0.8" strokeLinecap="round" />
        <line x1="20" y1="9" x2="24" y2="6" stroke={color} strokeWidth="0.8" strokeLinecap="round" />
      </g>
    ))}
  </svg>
);

// Memo note color styles: dark mode = white note, light mode = pale lighter note, no borders
const getMemoNoteStyles = (themeId: string, isDark: boolean) => {
  if (isDark) {
    return {
      bg: 'rgba(255, 255, 255, 0.28)',
      border: 'none',
      text: '#ffffff',
      washi: 'rgba(255, 255, 255, 0.45)',
    };
  } else {
    switch (themeId) {
      case 'amethyst-haze':
        return {
          bg: 'linear-gradient(135deg, rgba(255, 255, 255, 0.85) 0%, rgba(248, 240, 255, 0.65) 100%)',
          border: 'none',
          text: '#4a306d',
          washi: 'rgba(255, 255, 255, 0.45)',
        };
      case 'sage':
        return {
          bg: 'linear-gradient(135deg, rgba(255, 255, 255, 0.85) 0%, rgba(240, 252, 244, 0.65) 100%)',
          border: 'none',
          text: '#20422c',
          washi: 'rgba(255, 255, 255, 0.45)',
        };
      case 'mocha':
        return {
          bg: 'linear-gradient(135deg, rgba(255, 255, 255, 0.85) 0%, rgba(254, 252, 245, 0.65) 100%)',
          border: 'none',
          text: '#5c3a21',
          washi: 'rgba(255, 255, 255, 0.45)',
        };
      case 'notebook':
        return {
          bg: 'linear-gradient(135deg, rgba(255, 255, 255, 0.85) 0%, rgba(250, 250, 252, 0.65) 100%)',
          border: 'none',
          text: '#27272a',
          washi: 'rgba(255, 255, 255, 0.45)',
        };
      case 'slate-haze':
      default:
        return {
          bg: 'linear-gradient(135deg, rgba(255, 255, 255, 0.85) 0%, rgba(240, 248, 255, 0.65) 100%)',
          border: 'none',
          text: '#1e3a5f',
          washi: 'rgba(255, 255, 255, 0.45)',
        };
    }
  }
};

// Delicate Translucent Crystal Orb (Trong suốt cao, không đường viền, ánh sáng mờ nhẹ tinh tế)
const CrystalOrb: React.FC<{
  size?: number;
  className?: string;
  style?: React.CSSProperties;
  glow?: boolean;
  bgGradient?: string;
  glowColor?: string;
}> = ({ size = 8, className = '', style, glow = true, bgGradient, glowColor }) => {
  const bg =
    bgGradient ||
    'radial-gradient(circle at 32% 32%, rgba(255, 255, 255, 0.45) 0%, rgba(220, 240, 255, 0.22) 40%, rgba(180, 215, 245, 0.10) 75%, rgba(255, 255, 255, 0.16) 100%)';
  const shadow = glowColor
    ? (glow ? `0 0 5px ${glowColor}, inset 0 0.5px 1px ${glowColor}` : `0 0 2.5px ${glowColor}`)
    : (glow ? '0 0 5px rgba(255, 255, 255, 0.35), inset 0 0.5px 1px rgba(255, 255, 255, 0.4)' : '0 0 2.5px rgba(255, 255, 255, 0.2)');

  return (
    <div
      className={`rounded-full shrink-0 select-none pointer-events-none ${className}`}
      style={{
        width: size,
        height: size,
        background: bg,
        border: 'none',
        boxShadow: shadow,
        backdropFilter: 'blur(1px)',
        ...style,
      }}
    />
  );
};

// Cấu hình màu bông tuyết và vòng tròn pha lê: Chế độ sáng đổi theo màu theme và giữ độ màu nhạt
const getThemeSnowflakeAndOrbStyles = (themeId: string, isDark: boolean) => {
  if (isDark) {
    return {
      snowflakeColor: 'white',
      snowflakeDropShadow: 'drop-shadow(0 0 6px rgba(255, 255, 255, 0.6))',
      orbBg:
        'radial-gradient(circle at 32% 32%, rgba(255, 255, 255, 0.45) 0%, rgba(220, 240, 255, 0.22) 40%, rgba(180, 215, 245, 0.10) 75%, rgba(255, 255, 255, 0.16) 100%)',
      orbGlow: 'rgba(255, 255, 255, 0.35)',
    };
  }

  switch (themeId) {
    case 'amethyst-haze':
      return {
        snowflakeColor: 'rgba(147, 85, 185, 0.52)',
        snowflakeDropShadow: 'drop-shadow(0 0 5px rgba(168, 85, 247, 0.25))',
        orbBg:
          'radial-gradient(circle at 32% 32%, rgba(233, 213, 255, 0.8) 0%, rgba(216, 180, 254, 0.45) 45%, rgba(192, 132, 252, 0.2) 75%, rgba(233, 213, 255, 0.4) 100%)',
        orbGlow: 'rgba(168, 85, 247, 0.28)',
      };
    case 'sage':
      return {
        snowflakeColor: 'rgba(60, 115, 65, 0.52)',
        snowflakeDropShadow: 'drop-shadow(0 0 5px rgba(74, 150, 85, 0.25))',
        orbBg:
          'radial-gradient(circle at 32% 32%, rgba(209, 250, 229, 0.8) 0%, rgba(167, 243, 208, 0.45) 45%, rgba(110, 231, 183, 0.2) 75%, rgba(209, 250, 229, 0.4) 100%)',
        orbGlow: 'rgba(52, 211, 153, 0.28)',
      };
    case 'mocha':
      return {
        snowflakeColor: 'rgba(155, 105, 75, 0.52)',
        snowflakeDropShadow: 'drop-shadow(0 0 5px rgba(180, 120, 80, 0.25))',
        orbBg:
          'radial-gradient(circle at 32% 32%, rgba(254, 243, 199, 0.8) 0%, rgba(253, 230, 138, 0.45) 45%, rgba(245, 158, 11, 0.2) 75%, rgba(254, 243, 199, 0.4) 100%)',
        orbGlow: 'rgba(217, 119, 6, 0.28)',
      };
    case 'notebook':
      return {
        snowflakeColor: 'rgba(115, 115, 115, 0.48)',
        snowflakeDropShadow: 'drop-shadow(0 0 5px rgba(115, 115, 115, 0.22))',
        orbBg:
          'radial-gradient(circle at 32% 32%, rgba(244, 244, 245, 0.85) 0%, rgba(228, 228, 231, 0.5) 45%, rgba(161, 161, 170, 0.22) 75%, rgba(244, 244, 245, 0.5) 100%)',
        orbGlow: 'rgba(161, 161, 170, 0.25)',
      };
    case 'lululemon':
      return {
        snowflakeColor: 'rgba(168, 60, 90, 0.52)',
        snowflakeDropShadow: 'drop-shadow(0 0 5px rgba(225, 29, 72, 0.25))',
        orbBg:
          'radial-gradient(circle at 32% 32%, rgba(255, 228, 235, 0.8) 0%, rgba(251, 207, 219, 0.45) 45%, rgba(244, 114, 142, 0.2) 75%, rgba(255, 228, 235, 0.4) 100%)',
        orbGlow: 'rgba(244, 114, 142, 0.28)',
      };
    case 'slate-haze':
    default:
      return {
        snowflakeColor: 'rgba(56, 130, 195, 0.52)',
        snowflakeDropShadow: 'drop-shadow(0 0 5px rgba(56, 189, 248, 0.28))',
        orbBg:
          'radial-gradient(circle at 32% 32%, rgba(224, 242, 254, 0.8) 0%, rgba(186, 230, 253, 0.45) 45%, rgba(125, 211, 252, 0.2) 75%, rgba(224, 242, 254, 0.4) 100%)',
        orbGlow: 'rgba(56, 189, 248, 0.28)',
      };
  }
};

// Days of the week abbreviations (English)
const WEEKDAY_NAMES = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

// Calendar day definition
interface CalendarGridDay {
  dayNumber: number;
  isCurrentMonth: boolean;
  dateKey: string;
}

// Complete color schemes for all 5 themes in both Dark Mode and Light Mode
// (Không thay đổi bất kỳ trang trí, chỉ đổi bảng màu phù hợp cho các theme chế độ sáng & tối)
interface LibraryThemeConfig {
  id: string;
  pageBg: string;
  gradient: string;
  textPrimary: string;
  textMuted: string;
  accentText: string;
  accentGlow: string;
  accentBorder: string;
  todayDot: string;
  progressGradient: string;
  menuCloud: string;
  menuHeart: string;
  dropdownBg: string;
  dropdownText: string;
  dropdownBorder: string;
  calendarSelectText: string;
  calendarSelectedBg: string;
  accentBtnBg: string;
  outerFrameBg: string;
  outerFrameBorder: string;
  innerCardBg: string;
  innerCardBorder: string;
  cardDivider: string;
  headerBorder: string;
  navBtnBg: string;
  navBtnBorder: string;
  recentCardBg: string;
  recentCardBorder: string;
  clockShadow: string;
  clockText: string;
  clockScriptText: string;
  wireColor: string;
  wireBorder: string;
  cornerTickColor: string;
  quoteColor: string;
  searchContainerBg: string;
  searchContainerBorder: string;
  searchInputBg: string;
  searchInputBorder: string;
}

const THEME_CONFIGS_DARK: Record<string, LibraryThemeConfig> = {
  'slate-haze': {
    id: 'slate-haze',
    pageBg: '#3D4755',
    gradient: 'linear-gradient(135deg, #485463 0%, #3B4654 40%, #2F3946 75%, #252D37 100%)',
    textPrimary: 'text-white',
    textMuted: 'text-white/70',
    accentText: 'text-cyan-200',
    accentGlow: 'rgba(103, 232, 249, 0.85)',
    accentBorder: 'border-cyan-300/40',
    todayDot: 'bg-cyan-300',
    progressGradient: 'from-cyan-400 via-sky-300 to-white',
    menuCloud: 'from-[#38bdf8]/30 via-[#1d4ed8]/25 to-[#0b131e]/20',
    menuHeart: '#38bdf8',
    dropdownBg: '#28323E',
    dropdownText: 'text-white',
    dropdownBorder: 'border-white/20',
    calendarSelectText: '#2C3540',
    calendarSelectedBg: '#ffffff',
    accentBtnBg: 'linear-gradient(to right, #0284c7, #38bdf8)',
    outerFrameBg: 'bg-white/[0.04]',
    outerFrameBorder: 'border-white/20',
    innerCardBg: 'bg-white/[0.08]',
    innerCardBorder: 'border-white/35',
    cardDivider: 'border-white/15',
    headerBorder: 'border-white/10',
    navBtnBg: 'bg-white/10 hover:bg-white/20 text-white',
    navBtnBorder: 'border-white/20',
    recentCardBg: 'bg-white/[0.06] hover:bg-white/[0.1]',
    recentCardBorder: 'border-white/20 hover:border-white/40',
    clockShadow: '0 0 20px rgba(255, 255, 255, 0.95), 0 0 40px rgba(216, 224, 234, 0.7), 0 2px 4px rgba(0, 0, 0, 0.6)',
    clockText: 'text-white',
    clockScriptText: 'text-white/95',
    wireColor: 'linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.22) 35%, rgba(210, 230, 255, 0.15) 70%, rgba(255, 255, 255, 0.45) 100%)',
    wireBorder: 'border-white/60',
    cornerTickColor: 'text-white/50',
    quoteColor: 'text-white/20',
    searchContainerBg: 'bg-[#1c2430]/95',
    searchContainerBorder: 'border-white/20',
    searchInputBg: 'bg-black/35',
    searchInputBorder: 'border-white/20',
  },
  'amethyst-haze': {
    id: 'amethyst-haze',
    pageBg: '#241836',
    gradient: 'linear-gradient(135deg, #32224c 0%, #26193b 40%, #1d122e 75%, #140b20 100%)',
    textPrimary: 'text-white',
    textMuted: 'text-purple-200/70',
    accentText: 'text-purple-300',
    accentGlow: 'rgba(216, 180, 254, 0.85)',
    accentBorder: 'border-purple-300/40',
    todayDot: 'bg-purple-300',
    progressGradient: 'from-purple-400 via-fuchsia-300 to-white',
    menuCloud: 'from-[#c084fc]/30 via-[#7e22ce]/25 to-[#160b24]/20',
    menuHeart: '#c084fc',
    dropdownBg: '#231735',
    dropdownText: 'text-white',
    dropdownBorder: 'border-purple-400/25',
    calendarSelectText: '#221236',
    calendarSelectedBg: '#ffffff',
    accentBtnBg: 'linear-gradient(to right, #7e22ce, #c084fc)',
    outerFrameBg: 'bg-white/[0.05]',
    outerFrameBorder: 'border-white/25',
    innerCardBg: 'bg-white/[0.1]',
    innerCardBorder: 'border-white/40',
    cardDivider: 'border-purple-300/15',
    headerBorder: 'border-purple-400/15',
    navBtnBg: 'bg-white/10 hover:bg-white/20 text-white',
    navBtnBorder: 'border-white/20',
    recentCardBg: 'bg-white/[0.06] hover:bg-white/[0.1]',
    recentCardBorder: 'border-purple-400/20 hover:border-purple-400/40',
    clockShadow: '0 0 20px rgba(216, 180, 254, 0.95), 0 0 40px rgba(168, 85, 247, 0.7), 0 2px 4px rgba(0, 0, 0, 0.6)',
    clockText: 'text-white',
    clockScriptText: 'text-white/95',
    wireColor: 'linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(216, 180, 254, 0.25) 50%, rgba(255, 255, 255, 0.5) 100%)',
    wireBorder: 'border-purple-300/60',
    cornerTickColor: 'text-purple-300/50',
    quoteColor: 'text-white/20',
    searchContainerBg: 'bg-[#1b1228]/95',
    searchContainerBorder: 'border-purple-400/25',
    searchInputBg: 'bg-black/35',
    searchInputBorder: 'border-white/20',
  },
  'sage': {
    id: 'sage',
    pageBg: '#1f2e24',
    gradient: 'linear-gradient(135deg, #2b3e32 0%, #203126 40%, #18261d 75%, #101a13 100%)',
    textPrimary: 'text-white',
    textMuted: 'text-emerald-100/70',
    accentText: 'text-emerald-300',
    accentGlow: 'rgba(110, 231, 183, 0.85)',
    accentBorder: 'border-emerald-300/40',
    todayDot: 'bg-emerald-300',
    progressGradient: 'from-emerald-400 via-teal-300 to-white',
    menuCloud: 'from-[#34d399]/30 via-[#059669]/25 to-[#0c1a11]/20',
    menuHeart: '#34d399',
    dropdownBg: '#1d2b20',
    dropdownText: 'text-white',
    dropdownBorder: 'border-emerald-400/25',
    calendarSelectText: '#132017',
    calendarSelectedBg: '#ffffff',
    accentBtnBg: 'linear-gradient(to right, #059669, #34d399)',
    outerFrameBg: 'bg-white/[0.05]',
    outerFrameBorder: 'border-white/25',
    innerCardBg: 'bg-white/[0.1]',
    innerCardBorder: 'border-white/40',
    cardDivider: 'border-emerald-300/15',
    headerBorder: 'border-emerald-400/15',
    navBtnBg: 'bg-white/10 hover:bg-white/20 text-white',
    navBtnBorder: 'border-white/20',
    recentCardBg: 'bg-white/[0.06] hover:bg-white/[0.1]',
    recentCardBorder: 'border-emerald-400/20 hover:border-emerald-400/40',
    clockShadow: '0 0 20px rgba(110, 231, 183, 0.95), 0 0 40px rgba(16, 185, 129, 0.7), 0 2px 4px rgba(0, 0, 0, 0.6)',
    clockText: 'text-white',
    clockScriptText: 'text-white/95',
    wireColor: 'linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(110, 231, 183, 0.25) 50%, rgba(255, 255, 255, 0.5) 100%)',
    wireBorder: 'border-emerald-300/60',
    cornerTickColor: 'text-emerald-300/50',
    quoteColor: 'text-white/20',
    searchContainerBg: 'bg-[#152219]/95',
    searchContainerBorder: 'border-emerald-400/25',
    searchInputBg: 'bg-black/35',
    searchInputBorder: 'border-white/20',
  },
  'mocha': {
    id: 'mocha',
    pageBg: '#33251f',
    gradient: 'linear-gradient(135deg, #44332b 0%, #35261f 40%, #2a1d17 75%, #1e130e 100%)',
    textPrimary: 'text-white',
    textMuted: 'text-amber-100/70',
    accentText: 'text-amber-200',
    accentGlow: 'rgba(253, 230, 138, 0.85)',
    accentBorder: 'border-amber-300/40',
    todayDot: 'bg-amber-300',
    progressGradient: 'from-amber-400 via-orange-300 to-white',
    menuCloud: 'from-[#fbbf24]/30 via-[#d97706]/25 to-[#1a110a]/20',
    menuHeart: '#fbbf24',
    dropdownBg: '#2b1f1a',
    dropdownText: 'text-white',
    dropdownBorder: 'border-amber-400/25',
    calendarSelectText: '#261610',
    calendarSelectedBg: '#ffffff',
    accentBtnBg: 'linear-gradient(to right, #d97706, #fbbf24)',
    outerFrameBg: 'bg-white/[0.05]',
    outerFrameBorder: 'border-white/25',
    innerCardBg: 'bg-white/[0.1]',
    innerCardBorder: 'border-white/40',
    cardDivider: 'border-amber-300/15',
    headerBorder: 'border-amber-400/15',
    navBtnBg: 'bg-white/10 hover:bg-white/20 text-white',
    navBtnBorder: 'border-white/20',
    recentCardBg: 'bg-white/[0.06] hover:bg-white/[0.1]',
    recentCardBorder: 'border-amber-400/20 hover:border-amber-400/40',
    clockShadow: '0 0 20px rgba(253, 230, 138, 0.95), 0 0 40px rgba(245, 158, 11, 0.7), 0 2px 4px rgba(0, 0, 0, 0.6)',
    clockText: 'text-white',
    clockScriptText: 'text-white/95',
    wireColor: 'linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(253, 230, 138, 0.25) 50%, rgba(255, 255, 255, 0.5) 100%)',
    wireBorder: 'border-amber-300/60',
    cornerTickColor: 'text-amber-300/50',
    quoteColor: 'text-white/20',
    searchContainerBg: 'bg-[#221814]/95',
    searchContainerBorder: 'border-amber-400/25',
    searchInputBg: 'bg-black/35',
    searchInputBorder: 'border-white/20',
  },
  'notebook': {
    id: 'notebook',
    pageBg: '#28282b',
    gradient: 'linear-gradient(135deg, #37373b 0%, #2a2a2e 40%, #202024 75%, #17171a 100%)',
    textPrimary: 'text-white',
    textMuted: 'text-zinc-300/70',
    accentText: 'text-zinc-200',
    accentGlow: 'rgba(228, 228, 231, 0.85)',
    accentBorder: 'border-zinc-300/40',
    todayDot: 'bg-zinc-200',
    progressGradient: 'from-zinc-300 via-slate-200 to-white',
    menuCloud: 'from-[#a1a1aa]/30 via-[#52525b]/25 to-[#18181b]/20',
    menuHeart: '#e4e4e7',
    dropdownBg: '#212124',
    dropdownText: 'text-white',
    dropdownBorder: 'border-zinc-500/25',
    calendarSelectText: '#18181b',
    calendarSelectedBg: '#ffffff',
    accentBtnBg: 'linear-gradient(to right, #52525b, #a1a1aa)',
    outerFrameBg: 'bg-white/[0.05]',
    outerFrameBorder: 'border-white/25',
    innerCardBg: 'bg-white/[0.1]',
    innerCardBorder: 'border-white/40',
    cardDivider: 'border-zinc-400/15',
    headerBorder: 'border-zinc-500/15',
    navBtnBg: 'bg-white/10 hover:bg-white/20 text-white',
    navBtnBorder: 'border-white/20',
    recentCardBg: 'bg-white/[0.06] hover:bg-white/[0.1]',
    recentCardBorder: 'border-zinc-400/20 hover:border-zinc-400/40',
    clockShadow: '0 0 20px rgba(255, 255, 255, 0.95), 0 0 40px rgba(212, 212, 216, 0.7), 0 2px 4px rgba(0, 0, 0, 0.6)',
    clockText: 'text-white',
    clockScriptText: 'text-white/95',
    wireColor: 'linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(212, 212, 216, 0.25) 50%, rgba(255, 255, 255, 0.5) 100%)',
    wireBorder: 'border-zinc-300/60',
    cornerTickColor: 'text-zinc-400/50',
    quoteColor: 'text-white/20',
    searchContainerBg: 'bg-[#1a1a1d]/95',
    searchContainerBorder: 'border-zinc-500/25',
    searchInputBg: 'bg-black/35',
    searchInputBorder: 'border-white/20',
  },
};

export const getThemeLightPageBackground = (th: string): string => {
  switch (th) {
    case 'slate-haze':
      return `
        radial-gradient(ellipse at 50% 20%, rgba(255, 255, 255, 0.95) 0%, rgba(235, 243, 253, 0.85) 40%, rgba(226, 238, 252, 0.60) 70%, rgba(240, 245, 252, 0.90) 100%),
        linear-gradient(to bottom, #F4F8FD 0%, #EBF2FA 50%, #F5F1FA 100%)
      `;
    case 'sage':
      return `
        radial-gradient(ellipse at 50% 20%, rgba(255, 255, 255, 0.95) 0%, rgba(240, 246, 238, 0.85) 40%, rgba(232, 242, 230, 0.60) 70%, rgba(244, 248, 243, 0.90) 100%),
        linear-gradient(to bottom, #F5F8F4 0%, #EBF3E9 50%, #F3F7F2 100%)
      `;
    case 'mocha':
      return `
        radial-gradient(ellipse at 50% 20%, rgba(255, 255, 255, 0.95) 0%, rgba(252, 248, 242, 0.85) 40%, rgba(247, 240, 230, 0.60) 70%, rgba(253, 249, 244, 0.90) 100%),
        linear-gradient(to bottom, #FBF8F3 0%, #F4ECE1 50%, #FAF3EA 100%)
      `;
    case 'notebook':
      return `
        radial-gradient(ellipse at 50% 20%, rgba(255, 255, 255, 0.98) 0%, rgba(248, 248, 250, 0.85) 40%, rgba(242, 242, 245, 0.60) 70%, rgba(250, 250, 252, 0.90) 100%),
        linear-gradient(to bottom, #FAFAFC 0%, #F1F1F4 50%, #F7F7FA 100%)
      `;
    case 'amethyst-haze':
    default:
      return `
        radial-gradient(ellipse at 50% 20%, rgba(255, 255, 255, 0.95) 0%, rgba(248, 243, 253, 0.85) 40%, rgba(242, 235, 252, 0.60) 70%, rgba(250, 245, 253, 0.90) 100%),
        linear-gradient(to bottom, #F8F4FC 0%, #EFE8FA 50%, #F7F0FA 100%)
      `;
  }
};

export const getThemeCardClass = (th: string): string => {
  switch (th) {
    case 'slate-haze': return 'frost-light-novel-card';
    case 'sage': return 'sage-light-novel-card';
    case 'mocha': return 'mocha-light-novel-card';
    case 'notebook': return 'notebook-light-novel-card';
    case 'amethyst-haze':
    default:
      return 'amethyst-light-novel-card';
  }
};

export const getThemeLightBtnClass = (th: string): string => {
  switch (th) {
    case 'slate-haze': return 'frost-light-btn font-bold !text-[#526982] hover:!text-[#0284c7]';
    case 'sage': return 'sage-light-btn font-bold !text-[#466244] hover:!text-[#274225]';
    case 'mocha': return 'mocha-light-btn font-bold !text-[#7a6256] hover:!text-[#a37764]';
    case 'notebook': return 'notebook-light-btn font-bold !text-[#525252] hover:!text-[#171717]';
    case 'amethyst-haze':
    default:
      return 'amethyst-light-btn font-bold !text-[#6b5887] hover:!text-[#7e58a6]';
  }
};

const THEME_CONFIGS_LIGHT: Record<string, LibraryThemeConfig> = {
  'slate-haze': {
    id: 'slate-haze',
    pageBg: '#f4f8fd',
    gradient: 'linear-gradient(to bottom, #F4F8FD 0%, #EBF2FA 50%, #F5F1FA 100%)',
    textPrimary: 'text-[#101723]',
    textMuted: 'text-[#64748b]',
    accentText: 'text-[#0284c7]',
    accentGlow: 'rgba(2, 132, 199, 0.4)',
    accentBorder: 'border-[#0284c7]/40',
    todayDot: 'bg-[#0284c7]',
    progressGradient: 'from-[#7dd3fc]/80 via-[#38bdf8]/75 to-[#60a5fa]/70',
    menuCloud: 'from-[#38bdf8]/20 via-[#0284c7]/15 to-[#dbeafe]/10',
    menuHeart: '#0284c7',
    dropdownBg: '#ffffff',
    dropdownText: 'text-[#101723]',
    dropdownBorder: 'border-[#d8dfe9]',
    calendarSelectText: '#ffffff',
    calendarSelectedBg: '#0284c7',
    accentBtnBg: 'linear-gradient(to right, #0284c7, #38bdf8)',
    outerFrameBg: 'bg-[#f9fcff]/90',
    outerFrameBorder: 'border-[#d8dfe9]',
    innerCardBg: 'bg-white/95',
    innerCardBorder: 'border-[#d8dfe9]',
    cardDivider: 'border-[#d8dfe9]',
    headerBorder: 'border-[#d8dfe9]/80',
    navBtnBg: 'bg-white/80 hover:bg-white text-[#101723]',
    navBtnBorder: 'border-[#d8dfe9]',
    recentCardBg: 'bg-white/90 hover:bg-white',
    recentCardBorder: 'border-[#d8dfe9] hover:border-[#87909d]',
    clockShadow: '0 0 20px rgba(2, 132, 199, 0.25), 0 2px 4px rgba(16, 23, 35, 0.1)',
    clockText: 'text-[#101723]',
    clockScriptText: 'text-[#0284c7]',
    wireColor: 'linear-gradient(135deg, rgba(135, 144, 157, 0.7) 0%, rgba(216, 223, 233, 0.5) 50%, rgba(255, 255, 255, 0.9) 100%)',
    wireBorder: 'border-[#87909d]/40',
    cornerTickColor: 'text-[#87909d]/60',
    quoteColor: 'text-[#87909d]/25',
    searchContainerBg: 'bg-white/95',
    searchContainerBorder: 'border-[#d8dfe9]',
    searchInputBg: 'bg-[#f3f7fc]',
    searchInputBorder: 'border-[#c4d2e2]',
  },
  'amethyst-haze': {
    id: 'amethyst-haze',
    pageBg: '#f8f4fc',
    gradient: 'linear-gradient(to bottom, #F8F4FC 0%, #EFE8FA 50%, #F7F0FA 100%)',
    textPrimary: 'text-[#211c2f]',
    textMuted: 'text-[#756e87]',
    accentText: 'text-[#7e58a6]',
    accentGlow: 'rgba(126, 88, 166, 0.35)',
    accentBorder: 'border-[#7e58a6]/40',
    todayDot: 'bg-[#7e58a6]',
    progressGradient: 'from-[#e9d5ff]/90 via-[#d8b4fe]/80 to-[#c084fc]/70',
    menuCloud: 'from-[#c084fc]/20 via-[#7e22ce]/15 to-[#f3e8ff]/10',
    menuHeart: '#7e58a6',
    dropdownBg: '#ffffff',
    dropdownText: 'text-[#211c2f]',
    dropdownBorder: 'border-[#ded8ea]',
    calendarSelectText: '#ffffff',
    calendarSelectedBg: '#7e58a6',
    accentBtnBg: 'linear-gradient(to right, #6a5b8a, #8d7ba8)',
    outerFrameBg: 'bg-[#faf8fd]/90',
    outerFrameBorder: 'border-[#ded8ea]',
    innerCardBg: 'bg-white/95',
    innerCardBorder: 'border-[#ded8ea]',
    cardDivider: 'border-[#cac6d6]',
    headerBorder: 'border-[#cac6d6]/80',
    navBtnBg: 'bg-white/80 hover:bg-white text-[#211c2f]',
    navBtnBorder: 'border-[#ded8ea]',
    recentCardBg: 'bg-white/90 hover:bg-white',
    recentCardBorder: 'border-[#ded8ea] hover:border-[#7e739f]',
    clockShadow: '0 0 20px rgba(126, 88, 166, 0.25), 0 2px 4px rgba(40, 25, 60, 0.1)',
    clockText: 'text-[#211c2f]',
    clockScriptText: 'text-[#7e58a6]',
    wireColor: 'linear-gradient(135deg, rgba(126, 88, 166, 0.7) 0%, rgba(202, 198, 214, 0.5) 50%, rgba(255, 255, 255, 0.9) 100%)',
    wireBorder: 'border-[#9f94b8]/40',
    cornerTickColor: 'text-[#9f94b8]/60',
    quoteColor: 'text-[#9f94b8]/25',
    searchContainerBg: 'bg-white/95',
    searchContainerBorder: 'border-[#ded8ea]',
    searchInputBg: 'bg-[#f8f7fa]',
    searchInputBorder: 'border-[#c0b9ce]',
  },
  'sage': {
    id: 'sage',
    pageBg: '#f5f8f4',
    gradient: 'linear-gradient(to bottom, #F5F8F4 0%, #EBF3E9 50%, #F3F7F2 100%)',
    textPrimary: 'text-[#1c291e]',
    textMuted: 'text-[#678064]',
    accentText: 'text-[#3f573d]',
    accentGlow: 'rgba(63, 87, 61, 0.35)',
    accentBorder: 'border-[#3f573d]/40',
    todayDot: 'bg-[#3f573d]',
    progressGradient: 'from-[#678564]/75 via-[#4f6b4d]/70 to-[#3f573d]/65',
    menuCloud: 'from-[#34d399]/20 via-[#059669]/15 to-[#ecfdf5]/10',
    menuHeart: '#3f573d',
    dropdownBg: '#ffffff',
    dropdownText: 'text-[#1c291e]',
    dropdownBorder: 'border-[#cad8c6]',
    calendarSelectText: '#ffffff',
    calendarSelectedBg: '#3f573d',
    accentBtnBg: 'linear-gradient(to right, #3f573d, #678564)',
    outerFrameBg: 'bg-[#f7faf6]/90',
    outerFrameBorder: 'border-[#cad8c6]',
    innerCardBg: 'bg-white/95',
    innerCardBorder: 'border-[#cad8c6]',
    cardDivider: 'border-[#cad8c6]',
    headerBorder: 'border-[#cad8c6]/80',
    navBtnBg: 'bg-white/80 hover:bg-white text-[#1c291e]',
    navBtnBorder: 'border-[#cad8c6]',
    recentCardBg: 'bg-white/90 hover:bg-white',
    recentCardBorder: 'border-[#cad8c6] hover:border-[#678564]',
    clockShadow: '0 0 20px rgba(63, 87, 61, 0.25), 0 2px 4px rgba(28, 41, 30, 0.1)',
    clockText: 'text-[#1c291e]',
    clockScriptText: 'text-[#3f573d]',
    wireColor: 'linear-gradient(135deg, rgba(63, 87, 61, 0.7) 0%, rgba(202, 216, 198, 0.5) 50%, rgba(255, 255, 255, 0.9) 100%)',
    wireBorder: 'border-[#cad8c6]',
    cornerTickColor: 'text-[#678064]/60',
    quoteColor: 'text-[#678064]/25',
    searchContainerBg: 'bg-white/95',
    searchContainerBorder: 'border-[#cad8c6]',
    searchInputBg: 'bg-[#f0f4ef]',
    searchInputBorder: 'border-[#b9ccb6]',
  },
  'mocha': {
    id: 'mocha',
    pageBg: '#fbf8f3',
    gradient: 'linear-gradient(to bottom, #FBF8F3 0%, #F4ECE1 50%, #FAF3EA 100%)',
    textPrimary: 'text-[#3A2A2A]',
    textMuted: 'text-[#8C7A6E]',
    accentText: 'text-[#A37764]',
    accentGlow: 'rgba(163, 119, 100, 0.35)',
    accentBorder: 'border-[#A37764]/40',
    todayDot: 'bg-[#A37764]',
    progressGradient: 'from-[#a37764]/75 via-[#8a6353]/70 to-[#735142]/65',
    menuCloud: 'from-[#fbbf24]/20 via-[#d97706]/15 to-[#fef3c7]/10',
    menuHeart: '#A37764',
    dropdownBg: '#ffffff',
    dropdownText: 'text-[#3A2A2A]',
    dropdownBorder: 'border-[#E4D9BC]',
    calendarSelectText: '#ffffff',
    calendarSelectedBg: '#A37764',
    accentBtnBg: 'linear-gradient(to right, #A37764, #c29887)',
    outerFrameBg: 'bg-[#F8F4EE]/90',
    outerFrameBorder: 'border-[#E4D9BC]',
    innerCardBg: 'bg-white/95',
    innerCardBorder: 'border-[#E4D9BC]',
    cardDivider: 'border-[#E4D9BC]',
    headerBorder: 'border-[#E4D9BC]/80',
    navBtnBg: 'bg-white/80 hover:bg-white text-[#3A2A2A]',
    navBtnBorder: 'border-[#E4D9BC]',
    recentCardBg: 'bg-white/90 hover:bg-white',
    recentCardBorder: 'border-[#E4D9BC] hover:border-[#A37764]',
    clockShadow: '0 0 20px rgba(163, 119, 100, 0.25), 0 2px 4px rgba(58, 42, 42, 0.1)',
    clockText: 'text-[#3A2A2A]',
    clockScriptText: 'text-[#A37764]',
    wireColor: 'linear-gradient(135deg, rgba(163, 119, 100, 0.7) 0%, rgba(228, 217, 188, 0.5) 50%, rgba(255, 255, 255, 0.9) 100%)',
    wireBorder: 'border-[#E4D9BC]',
    cornerTickColor: 'text-[#8C7A6E]/60',
    quoteColor: 'text-[#8C7A6E]/25',
    searchContainerBg: 'bg-white/95',
    searchContainerBorder: 'border-[#E4D9BC]',
    searchInputBg: 'bg-[#f5f1e6]',
    searchInputBorder: 'border-[#d8cbb0]',
  },
  'notebook': {
    id: 'notebook',
    pageBg: '#fafafc',
    gradient: 'linear-gradient(to bottom, #FAFAFC 0%, #F1F1F4 50%, #F7F7FA 100%)',
    textPrimary: 'text-[#171717]',
    textMuted: 'text-[#737373]',
    accentText: 'text-[#404040]',
    accentGlow: 'rgba(64, 64, 64, 0.25)',
    accentBorder: 'border-neutral-400/50',
    todayDot: 'bg-[#404040]',
    progressGradient: 'from-[#f5f5f5] via-[#e5e5e5] to-[#d4d4d4]',
    menuCloud: 'from-[#737373]/20 via-[#525252]/15 to-[#f4f4f5]/10',
    menuHeart: '#404040',
    dropdownBg: '#ffffff',
    dropdownText: 'text-[#171717]',
    dropdownBorder: 'border-neutral-300',
    calendarSelectText: '#ffffff',
    calendarSelectedBg: '#262626',
    accentBtnBg: 'linear-gradient(to right, #52525b, #737373)',
    outerFrameBg: 'bg-white/95',
    outerFrameBorder: 'border-neutral-300',
    innerCardBg: 'bg-[#fafafa]/95',
    innerCardBorder: 'border-neutral-200',
    cardDivider: 'border-neutral-200',
    headerBorder: 'border-neutral-200',
    navBtnBg: 'bg-neutral-100 hover:bg-neutral-200 text-[#171717]',
    navBtnBorder: 'border-neutral-300',
    recentCardBg: 'bg-white hover:bg-[#fafafa]',
    recentCardBorder: 'border-neutral-200 hover:border-neutral-400',
    clockShadow: '0 0 20px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.08)',
    clockText: 'text-[#171717]',
    clockScriptText: 'text-[#404040]',
    wireColor: 'linear-gradient(135deg, rgba(82, 82, 82, 0.7) 0%, rgba(229, 229, 229, 0.5) 50%, rgba(255, 255, 255, 0.9) 100%)',
    wireBorder: 'border-neutral-300',
    cornerTickColor: 'text-neutral-400',
    quoteColor: 'text-neutral-400/25',
    searchContainerBg: 'bg-white/95',
    searchContainerBorder: 'border-neutral-300',
    searchInputBg: 'bg-neutral-100/90',
    searchInputBorder: 'border-neutral-300',
  },
};

export const WinterSilverSnowView: React.FC<WinterSilverSnowViewProps> = ({
  onBackToNovels,
  novels = [],
  onSelectNovel,
  onOpenNovelToReadingPosition,
  isAdmin = false,
  theme: initialTheme,
  isDarkMode: propIsDarkMode,
  onToggleDarkMode: propOnToggleDarkMode,
  onOpenAdminAuth,
  onOpenLightIntro,
}) => {
  // Theme state: Hỗ trợ cả 5 theme (Frost, Purple, Sage, Linen, White) ở cả 2 chế độ Sáng và Tối
  const [activeThemeId, setActiveThemeId] = useState<string>(() => {
    return initialTheme || safeStorage.getItem('cosmo_novel_theme') || 'slate-haze';
  });

  const [localIsDarkMode, setLocalIsDarkMode] = useState<boolean>(() => {
    if (propIsDarkMode !== undefined) return propIsDarkMode;
    const stored = safeStorage.getItem('cosmo_darkmode');
    return stored !== null ? stored === 'true' : false;
  });

  const isDarkMode = propIsDarkMode !== undefined ? propIsDarkMode : localIsDarkMode;

  useEffect(() => {
    const handleStorage = () => {
      const storedTheme = safeStorage.getItem('cosmo_novel_theme');
      if (storedTheme) {
        queueMicrotask(() => setActiveThemeId(storedTheme));
      }
      const storedDark = safeStorage.getItem('cosmo_darkmode');
      if (storedDark !== null && propIsDarkMode === undefined) {
        const isDark = storedDark === 'true';
        queueMicrotask(() => setLocalIsDarkMode(isDark));
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [propIsDarkMode]);

  const handleToggleDarkMode = () => {
    cosmicAudio.playChime('sparkle');
    if (propOnToggleDarkMode) {
      propOnToggleDarkMode();
    } else {
      const next = !isDarkMode;
      setLocalIsDarkMode(next);
      safeStorage.setItem('cosmo_darkmode', JSON.stringify(next));
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      try {
        window.dispatchEvent(new Event('storage'));
      } catch {}
    }
  };

  const isCosmic = activeThemeId === 'cosmic';
  const isDarkEffective = isCosmic || isDarkMode;
  const tStyles = useMemo(() => getNovelThemeStyles(activeThemeId as NovelThemeId, isDarkEffective), [activeThemeId, isDarkEffective]);
  const snowStyles = useMemo(() => getThemeSnowflakeAndOrbStyles(activeThemeId, isDarkMode), [activeThemeId, isDarkMode]);
  const recentUpdatesStyles = useMemo(
    () => getRecentUpdatesCardStyles(activeThemeId as NovelThemeId, isDarkEffective),
    [activeThemeId, isDarkEffective]
  );
  const menuThemeStyles = useMemo(() => {
    switch (activeThemeId) {
      case 'amethyst-haze':
        return {
          cloudGradient: isDarkEffective
            ? 'from-[#3a205a]/85 via-[#271440]/90 to-[#1c0d30]/85'
            : 'from-[#eddcf8]/90 via-white/85 to-[#e6d0f7]/75',
          columnClass: isDarkEffective ? 'sugar-column-amethyst-dark' : 'sugar-column-amethyst',
          btnConvex: isDarkEffective ? 'sugar-btn-convex-amethyst-dark' : 'sugar-btn-convex-amethyst',
          btnInset: isDarkEffective ? 'sugar-btn-inset-amethyst-dark' : 'sugar-btn-inset-amethyst',
          badge: isDarkEffective
            ? 'bg-[#2b1942] text-[#d4b9f5] border border-white/5'
            : 'bg-[#f0e4fc] text-[#5c3a85] border border-white/40 shadow-xs',
          heartColor: isDarkEffective ? '#c084fc' : '#9333ea',
        };
      case 'notebook':
        return {
          cloudGradient: isDarkEffective
            ? 'from-[#30333d]/85 via-[#22252c]/90 to-[#17191e]/85'
            : 'from-[#f1f3f7]/90 via-white/85 to-[#e5e7eb]/75',
          columnClass: isDarkEffective ? 'sugar-column-notebook-dark' : 'sugar-column-notebook',
          btnConvex: isDarkEffective ? 'sugar-btn-convex-notebook-dark' : 'sugar-btn-convex-notebook',
          btnInset: isDarkEffective ? 'sugar-btn-inset-notebook-dark' : 'sugar-btn-inset-notebook',
          badge: isDarkEffective
            ? 'bg-[#292c34] text-[#d1d5db] border border-white/5'
            : 'bg-[#e5e7eb] text-[#374151] border border-white/40 shadow-xs',
          heartColor: isDarkEffective ? '#e5e7eb' : '#4b5563',
        };
      case 'sage':
        return {
          cloudGradient: isDarkEffective
            ? 'from-[#233825]/85 via-[#18271a]/90 to-[#101c12]/85'
            : 'from-[#dce8db]/90 via-white/85 to-[#d1e2cf]/75',
          columnClass: isDarkEffective ? 'sugar-column-sage-dark' : 'sugar-column-sage',
          btnConvex: isDarkEffective ? 'sugar-btn-convex-sage-dark' : 'sugar-btn-convex-sage',
          btnInset: isDarkEffective ? 'sugar-btn-inset-sage-dark' : 'sugar-btn-inset-sage',
          badge: isDarkEffective
            ? 'bg-[#1b2b1d] text-[#b4d6b1] border border-white/5'
            : 'bg-[#deecdc] text-[#2c4e2a] border border-white/40 shadow-xs',
          heartColor: isDarkEffective ? '#86efac' : '#16a34a',
        };
      case 'mocha':
        return {
          cloudGradient: isDarkEffective
            ? 'from-[#3b2c23]/85 via-[#281e18]/90 to-[#1c1510]/85'
            : 'from-[#ebdcd1]/90 via-white/85 to-[#e2cebe]/75',
          columnClass: isDarkEffective ? 'sugar-column-mocha-dark' : 'sugar-column-mocha',
          btnConvex: isDarkEffective ? 'sugar-btn-convex-mocha-dark' : 'sugar-btn-convex-mocha',
          btnInset: isDarkEffective ? 'sugar-btn-inset-mocha-dark' : 'sugar-btn-inset-mocha',
          badge: isDarkEffective
            ? 'bg-[#31251e] text-[#e0c2b2] border border-white/5'
            : 'bg-[#eee1d6] text-[#5c4232] border border-white/40 shadow-xs',
          heartColor: isDarkEffective ? '#fcd34d' : '#b45309',
        };
      case 'slate-haze':
      default:
        return {
          cloudGradient: isDarkEffective
            ? 'from-[#38bdf8]/30 via-[#1d4ed8]/25 to-[#0b131e]/20'
            : 'from-[#cbe5fb]/90 via-white/85 to-[#dbeafc]/75',
          columnClass: isDarkEffective ? 'sugar-column-frost-dark' : 'sugar-column-frost',
          btnConvex: isDarkEffective ? 'sugar-btn-convex-frost-dark' : 'sugar-btn-convex',
          btnInset: isDarkEffective ? 'sugar-btn-inset-frost-dark' : 'sugar-btn-inset',
          badge: isDarkEffective
            ? 'bg-[#172435] text-[#8ea9c7] border border-white/5'
            : 'bg-[#dbeafc] text-[#1e4a78] border border-white/40 shadow-xs',
          heartColor: isDarkEffective ? '#38bdf8' : '#0284c7',
        };
    }
  }, [activeThemeId, isDarkEffective]);

  const themeConfig = useMemo(() => {
    const configs = isDarkMode ? THEME_CONFIGS_DARK : THEME_CONFIGS_LIGHT;
    return configs[activeThemeId] || configs['slate-haze'];
  }, [activeThemeId, isDarkMode]);

  const currentThemeOption = useMemo(() => {
    return NOVEL_THEME_OPTIONS.find((t) => t.id === activeThemeId) || NOVEL_THEME_OPTIONS[2]; // Default frost
  }, [activeThemeId]);

  // Snowfall toggle state (Top right switch: SNOWFALL)
  const [isSnowingActive, setIsSnowingActive] = useState<boolean>(false);

  // Interactive snowflake color state for Little Library footer
  const [snowflakeColorState, setSnowflakeColorState] = useState<string>(() => snowStyles.snowflakeColor);
  useEffect(() => {
    setSnowflakeColorState(snowStyles.snowflakeColor);
  }, [snowStyles.snowflakeColor]);

  // Search state
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Theme & Menu Dropdown states
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState<boolean>(false);
  const [isMainMenuOpen, setIsMainMenuOpen] = useState<boolean>(false);
  const themeMenuRef = useRef<HTMLDivElement>(null);
  const mainMenuRef = useRef<HTMLDivElement>(null);

  // Lấy lịch sử truyện đọc gần đây thực tế từ người dùng
  const realRecentReads = useMemo(() => {
    return getRecentReads(novels);
  }, [novels]);

  // Click outside listener for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as Node)) {
        setIsThemeMenuOpen(false);
      }
      if (mainMenuRef.current && !mainMenuRef.current.contains(event.target as Node)) {
        setIsMainMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Current real date state (Dynamic current day, month, year)
  const today = useMemo(() => new Date(), []);
  const currentRealYear = today.getFullYear();
  const currentRealMonth = today.getMonth(); // 0 - 11
  const currentRealDate = today.getDate(); // 1 - 31

  const MONTH_NAMES = useMemo(
    () => [
      'JANUARY',
      'FEBRUARY',
      'MARCH',
      'APRIL',
      'MAY',
      'JUNE',
      'JULY',
      'AUGUST',
      'SEPTEMBER',
      'OCTOBER',
      'NOVEMBER',
      'DECEMBER',
    ],
    []
  );

  const currentMonthName = MONTH_NAMES[currentRealMonth];

  // Live real-time clock state (Hours:Minutes & Day of Week updated every second)
  const [currentTime, setCurrentTime] = useState<string>(() => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  });
  const [currentDayName, setCurrentDayName] = useState<string>(() => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date().getDay()];
  });
  const [currentDayIndex, setCurrentDayIndex] = useState<number>(() => new Date().getDay());

  // Selected calendar day (1 to 31, defaults to current real date)
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<number>(() => {
    const d = new Date().getDate();
    return d >= 1 && d <= 31 ? d : 1;
  });

  // Current active romantic poem for the selected day (1 day 1 poem!)
  const currentPoem = useMemo(() => {
    const poem = ROMANTIC_POEMS.find((p) => p.day === selectedCalendarDay);
    return poem || ROMANTIC_POEMS[(selectedCalendarDay - 1) % ROMANTIC_POEMS.length] || ROMANTIC_POEMS[0];
  }, [selectedCalendarDay]);

  // Dynamically build calendar days for the current real month and year:
  const calendarDays: CalendarGridDay[] = useMemo(() => {
    const days: CalendarGridDay[] = [];
    const firstDayOfWeek = new Date(currentRealYear, currentRealMonth, 1).getDay(); // 0 is Sunday
    const daysInCurrentMonth = new Date(currentRealYear, currentRealMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentRealYear, currentRealMonth, 0).getDate();

    // Previous month overflow days (to start on Sunday)
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      days.push({ dayNumber: dayNum, isCurrentMonth: false, dateKey: `prev-${dayNum}` });
    }

    // Current month days (1 .. daysInCurrentMonth)
    for (let d = 1; d <= daysInCurrentMonth; d++) {
      days.push({ dayNumber: d, isCurrentMonth: true, dateKey: `cur-${d}` });
    }

    // Next month overflow days (fill standard 35 cells, or 42 cells if month spans 6 weeks)
    const targetLength = days.length > 35 ? 42 : 35;
    const remaining = targetLength - days.length;
    for (let d = 1; d <= remaining; d++) {
      days.push({ dayNumber: d, isCurrentMonth: false, dateKey: `next-${d}` });
    }

    return days;
  }, [currentRealYear, currentRealMonth]);

  // Filter novels for search across all available novels
  const filteredNovels = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return novels.filter(
      (n) =>
        (n.title || '').toLowerCase().includes(q) ||
        (n.author?.name || '').toLowerCase().includes(q) ||
        n.genres?.some((g: string) => g.toLowerCase().includes(q))
    );
  }, [searchQuery, novels]);

  // Update live clock every second to keep hours:minutes and weekday completely accurate
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);

      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      setCurrentDayName(days[now.getDay()]);
      setCurrentDayIndex(now.getDay());
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Select Calendar Day (and view that day's romantic poem!)
  const handleSelectDay = (day: number, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return;
    cosmicAudio.playWinterCrystalChime();
    setSelectedCalendarDay(day);
  };

  // Navigate to previous day's poem
  const handlePrevDayPoem = () => {
    cosmicAudio.playWinterCrystalChime();
    setSelectedCalendarDay((prev) => (prev <= 1 ? 31 : prev - 1));
  };

  // Navigate to next day's poem
  const handleNextDayPoem = () => {
    cosmicAudio.playWinterCrystalChime();
    setSelectedCalendarDay((prev) => (prev >= 31 ? 1 : prev + 1));
  };

  // Shuffle / Random Poem
  const handleRandomPoem = () => {
    cosmicAudio.playSnowCrunch();
    const randomDay = Math.floor(Math.random() * 31) + 1;
    setSelectedCalendarDay(randomDay);
  };

  // Format relative reading time
  const formatTimeDiff = (updatedAt: number) => {
    const diff = Date.now() - (updatedAt || Date.now());
    const mins = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days > 0) return `${days} ngày trước`;
    if (hours > 0) return `${hours} giờ trước`;
    if (mins > 0) return `${mins} phút trước`;
    return 'Vừa xong';
  };

  return (
    <div
      className={`relative min-h-screen w-full ${themeConfig.textPrimary} flex flex-col justify-between overflow-x-hidden select-none font-sans pb-12 transition-colors duration-500`}
      style={!isDarkMode ? { background: getThemeLightPageBackground(activeThemeId) } : { backgroundColor: themeConfig.pageBg }}
    >
      {/* Custom Auto-Hiding 1px Scrollbar Style for Mobile Poetry */}
      <style>{`
        .poem-scrollbar-1px {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .poem-scrollbar-1px:hover,
        .poem-scrollbar-1px:active,
        .poem-scrollbar-1px:focus {
          scrollbar-width: thin;
          scrollbar-color: ${isDarkMode ? 'rgba(255, 255, 255, 0.45)' : 'rgba(0, 0, 0, 0.35)'} transparent;
        }
        .poem-scrollbar-1px::-webkit-scrollbar {
          width: 1px;
          height: 1px;
        }
        .poem-scrollbar-1px::-webkit-scrollbar-track {
          background: transparent;
        }
        .poem-scrollbar-1px::-webkit-scrollbar-thumb {
          background: transparent;
          border-radius: 9999px;
          transition: background 0.25s ease;
        }
        .poem-scrollbar-1px:hover::-webkit-scrollbar-thumb,
        .poem-scrollbar-1px:active::-webkit-scrollbar-thumb {
          background: ${isDarkMode ? 'rgba(255, 255, 255, 0.45)' : 'rgba(0, 0, 0, 0.35)'};
        }
        .poem-scrollbar-1px:hover::-webkit-scrollbar-thumb:hover {
          background: ${themeConfig.accentGlow};
        }
      `}</style>

      {/* BACKGROUND LAYER: WINTER MIST, FROST, BOKEH ORBS & FALLING SNOW */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      >
        {/* Dynamic Deep Winter Mist Gradient per theme (Matches homepage in light mode) */}
        <div
          className="absolute inset-0 transition-all duration-700"
          style={!isDarkMode ? { background: getThemeLightPageBackground(activeThemeId) } : { background: themeConfig.gradient }}
        />

        {/* Thư viện chế độ sáng: Bông tuyết tĩnh nằm nghiêng ngẫu nhiên, sát góc bị cắt ngang */}
        {!isDarkMode && (
          <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            <div className="absolute -top-8 -left-8 opacity-25 filter blur-[1px] select-none" style={{ transform: 'rotate(25deg)' }}>
              <IntricateSnowflakeSVG size={130} color={snowStyles.snowflakeColor} />
            </div>
            <div className="absolute -top-10 -right-10 opacity-22 filter blur-[1.5px] select-none" style={{ transform: 'rotate(-42deg)' }}>
              <IntricateSnowflakeSVG size={150} color={snowStyles.snowflakeColor} />
            </div>
            <div className="absolute -bottom-12 -left-10 opacity-20 filter blur-[1px] select-none" style={{ transform: 'rotate(18deg)' }}>
              <IntricateSnowflakeSVG size={140} color={snowStyles.snowflakeColor} />
            </div>
            <div className="absolute -bottom-8 -right-8 opacity-25 filter blur-[1px] select-none" style={{ transform: 'rotate(-28deg)' }}>
              <IntricateSnowflakeSVG size={120} color={snowStyles.snowflakeColor} />
            </div>
          </div>
        )}



        {/* Nền thư viện chế độ sáng: 5 khối cầu màu với bộ lọc mờ blur-[35px] */}
        {!isDarkMode && [
          { x: '14%', y: '22%', size: 170, opacity: 0.35, dur: 10 },
          { x: '75%', y: '30%', size: 210, opacity: 0.30, dur: 13 },
          { x: '82%', y: '72%', size: 140, opacity: 0.28, dur: 9 },
          { x: '22%', y: '78%', size: 180, opacity: 0.32, dur: 11 },
          { x: '48%', y: '12%', size: 120, opacity: 0.38, dur: 8 },
        ].map((orb, i) => (
          <motion.div
            key={`light-bokeh-${i}`}
            className="absolute rounded-full blur-[35px]"
            style={{
              left: orb.x,
              top: orb.y,
              width: orb.size,
              height: orb.size,
              opacity: orb.opacity,
              background: snowStyles.orbBg,
            }}
            animate={{
              y: [0, -15, 0],
              x: [0, i % 2 === 0 ? 10 : -10, 0],
              scale: [1, 1.08, 1],
            }}
            transition={{
              repeat: Infinity,
              duration: orb.dur,
              ease: 'easeInOut',
            }}
          />
        ))}

        {/* Atmospheric Winter Bokeh Orbs */}
        {isDarkMode && [
          { x: '18%', y: '35%', size: 140, opacity: 0.18, dur: 9 },
          { x: '68%', y: '42%', size: 180, opacity: 0.22, dur: 11 },
          { x: '82%', y: '68%', size: 110, opacity: 0.15, dur: 8 },
          { x: '35%', y: '78%', size: 160, opacity: 0.16, dur: 10 },
          { x: '52%', y: '20%', size: 90, opacity: 0.25, dur: 7 },
        ].map((orb, i) => (
          <motion.div
            key={`bokeh-${i}`}
            className="absolute rounded-full bg-white blur-[35px]"
            style={{
              left: orb.x,
              top: orb.y,
              width: orb.size,
              height: orb.size,
              opacity: orb.opacity,
            }}
            animate={{
              y: [0, -18, 0],
              x: [0, i % 2 === 0 ? 12 : -12, 0],
              opacity: [orb.opacity * 0.7, orb.opacity * 1.3, orb.opacity * 0.7],
            }}
            transition={{
              repeat: Infinity,
              duration: orb.dur,
              ease: 'easeInOut',
            }}
          />
        ))}

        {/* Real-time Animated Falling Snow Particles: CHỈ CHẠY Ở CHẾ ĐỘ TỐI (Bỏ hiệu ứng tuyết rơi ở chế độ sáng theo yêu cầu) */}
        {isSnowingActive && isDarkMode && (
          <div className="absolute inset-0">
            {Array.from({ length: 42 }).map((_, idx) => {
              const size = Math.random() * 4 + 2;
              const left = Math.random() * 100;
              const duration = Math.random() * 6 + 5;
              const delay = Math.random() * 5;
              const opacity = Math.random() * 0.7 + 0.3;
              return (
                <motion.div
                  key={`snow-${idx}`}
                  className="absolute rounded-full bg-white"
                  style={{
                    left: `${left}%`,
                    top: '-10px',
                    width: size,
                    height: size,
                    opacity,
                    boxShadow: '0 0 6px rgba(255, 255, 255, 0.8)',
                  }}
                  animate={{
                    y: ['0vh', '105vh'],
                    x: [0, (idx % 2 === 0 ? 1 : -1) * (Math.random() * 30 + 15)],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration,
                    delay,
                    ease: 'linear',
                  }}
                />
              );
            })}
          </div>
        )}

        {/* Frosted Film Grain / Noise */}
        <div
          className="absolute inset-0 opacity-[0.045] pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(rgba(255, 255, 255, 0.3) 1px, transparent 1px)',
            backgroundSize: '4px 4px',
          }}
        />
      </div>

      {/* TOP HEADER: Giữ lại nút mũi tên, nút tìm kiếm, tạo nút theme và nút menu giống trang chủ */}
      <nav
        className={`relative z-40 w-full px-3 sm:px-6 md:px-8 py-3 flex items-center justify-between text-xs font-['Open_Sans'] border-b backdrop-blur-md transition-colors duration-300 ${themeConfig.headerBorder} ${themeConfig.textMuted}`}
      >
        {/* Left: Nút mũi tên quay lại */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBackToNovels}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border backdrop-blur-md transition-all cursor-pointer hover:scale-105 text-xs font-['Open_Sans'] font-semibold shadow-xs ${
              !isDarkMode
                ? getThemeLightBtnClass(activeThemeId)
                : `${themeConfig.navBtnBg} ${themeConfig.navBtnBorder}`
            }`}
            title="Quay về Tủ Truyện"
          >
            <ArrowLeft className="w-4 h-4 text-current" />
            <span className="hidden sm:inline">Quay lại</span>
          </button>
        </div>

        {/* Right: Nút tìm kiếm, Nút Theme & Nút Menu (Đồng bộ hoàn toàn với trang chủ) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Nút Tìm kiếm */}
          <button
            type="button"
            onClick={() => {
              setIsSearchOpen((prev) => !prev);
              setTimeout(() => {
                searchInputRef.current?.focus();
              }, 100);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-['Open_Sans'] font-semibold border transition-all cursor-pointer shadow-xs ${
              !isDarkMode
                ? `${getThemeLightBtnClass(activeThemeId)} ${isSearchOpen ? 'ring-2 ring-current/25' : ''}`
                : isSearchOpen
                ? 'bg-white/25 border-white text-white shadow-xs'
                : `${themeConfig.navBtnBg} ${themeConfig.navBtnBorder}`
            }`}
            title="Tìm kiếm truyện"
            aria-label="Tìm kiếm truyện"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tìm kiếm</span>
          </button>

          {/* Nút Theme (Theme Selector Popover 5 Gam Màu + Chuyển Chế Độ Sáng/Tối) */}
          <div className="relative" ref={themeMenuRef}>
            <button
              type="button"
              onClick={() => {
                setIsThemeMenuOpen(!isThemeMenuOpen);
                setIsMainMenuOpen(false);
              }}
              className={`p-2 sm:px-3 sm:py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer shadow-xs flex items-center gap-1.5 ${tStyles.themeSelectorBtn}`}
              title="Thay đổi màu giao diện & chế độ sáng tối"
              aria-label="Thay đổi màu giao diện & chế độ sáng tối"
            >
              <Palette className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{currentThemeOption.name}</span>
            </button>

            {isThemeMenuOpen && (
              <div className="absolute right-0 mt-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                {!isDarkMode ? (
                  <div
                    className="p-[2.5px] rounded-2xl transition-all duration-300 shadow-2xl"
                    style={recentUpdatesStyles.outerStyle}
                  >
                    <div
                      className="w-56 sm:w-64 p-2.5 rounded-[13.5px] backdrop-blur-xl text-zinc-900"
                      style={recentUpdatesStyles.innerStyle}
                    >
                      <div className="px-2 py-1 border-b border-zinc-500/20 flex items-center justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                        <span>Màu Giao Diện</span>
                        <span className="text-[9px] font-normal normal-case opacity-70">5 Gam Màu</span>
                      </div>
                      <div className="mt-1 space-y-0.5">
                        {NOVEL_THEME_OPTIONS.map((opt) => {
                          const isSelected = activeThemeId === opt.id;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => {
                                setActiveThemeId(opt.id);
                                safeStorage.setItem('cosmo_novel_theme', opt.id);
                                setIsThemeMenuOpen(false);
                              }}
                              className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-left text-xs transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-zinc-100 text-zinc-900 font-bold ring-1 ring-zinc-300'
                                  : 'hover:bg-zinc-50/80 text-zinc-700'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <div className="flex items-center -space-x-1 shrink-0">
                                  {opt.dots.map((d, i) => (
                                    <span
                                      key={i}
                                      className="w-3 h-3 rounded-full border border-black/20 shadow-xs"
                                      style={{ backgroundColor: d }}
                                    />
                                  ))}
                                </div>
                                <div className="font-semibold text-[11px] sm:text-xs">
                                  <span>{opt.name}</span>
                                </div>
                              </div>
                              {isSelected && <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 ml-1" />}
                            </button>
                          );
                        })}
                      </div>

                      {/* NÚT TOGGLE CHUYỂN CHẾ ĐỘ TỐI Ở DƯỚI CÙNG VỚI ClayThemeToggle */}
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={handleToggleDarkMode}
                        onKeyDown={(e) => {
                          if (e.key === ' ' || e.key === 'Enter') {
                            e.preventDefault();
                            handleToggleDarkMode();
                          }
                        }}
                        className="mt-2 pt-2 border-t border-zinc-500/20 flex items-center justify-between px-2 py-1.5 cursor-pointer hover:bg-black/5 rounded-lg transition-colors select-none"
                        title="Nhấp để chuyển sang chế độ tối"
                      >
                        <span className="text-xs font-semibold select-none cursor-pointer">
                          Chế độ tối
                        </span>
                        <ClayThemeToggle
                          id="clay-toggle-library"
                          isOn={isDarkMode}
                          onToggle={handleToggleDarkMode}
                          theme={activeThemeId as NovelThemeId}
                          title="Gạt để chuyển sang chế độ tối"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className="w-56 sm:w-64 p-2.5 rounded-2xl text-zinc-100 shadow-2xl border border-white/20 opacity-100"
                    style={{ backgroundColor: '#0a0d14', background: '#0a0d14', backdropFilter: 'none', WebkitBackdropFilter: 'none' }}
                  >
                    <div className="px-2 py-1 border-b border-zinc-500/20 flex items-center justify-between text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                      <span>Màu Giao Diện</span>
                      <span className="text-[9px] font-normal normal-case opacity-70">5 Gam Màu</span>
                    </div>
                    <div className="mt-1 space-y-0.5">
                      {NOVEL_THEME_OPTIONS.map((opt) => {
                        const isSelected = activeThemeId === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => {
                              setActiveThemeId(opt.id);
                              safeStorage.setItem('cosmo_novel_theme', opt.id);
                              setIsThemeMenuOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-left text-xs transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-zinc-800 text-white font-bold'
                                : 'hover:bg-zinc-800/60 text-zinc-300'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <div className="flex items-center -space-x-1 shrink-0">
                                {opt.dots.map((d, i) => (
                                  <span
                                    key={i}
                                    className="w-3 h-3 rounded-full border border-black/20 shadow-xs"
                                    style={{ backgroundColor: d }}
                                  />
                                ))}
                              </div>
                              <div className="font-semibold text-[11px] sm:text-xs">
                                <span>{opt.name}</span>
                              </div>
                            </div>
                            {isSelected && <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 ml-1" />}
                          </button>
                        );
                      })}
                    </div>

                    {/* Tắt/bật Hiệu ứng nền tuyết rơi của chế độ tối */}
                    <div className="mt-1.5 pt-1.5 border-t border-zinc-500/20">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          cosmicAudio.playSnowCrunch();
                          setIsSnowingActive(!isSnowingActive);
                        }}
                        className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-left text-xs transition-all cursor-pointer hover:bg-zinc-800/60 text-zinc-200"
                        title={isSnowingActive ? 'Nhấn để tắt hiệu ứng tuyết rơi' : 'Nhấn để bật hiệu ứng tuyết rơi'}
                      >
                        <div className="flex items-center">
                          <span className="font-medium text-[11px] sm:text-xs">Hiệu ứng nền</span>
                        </div>
                        <span
                          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full transition-all select-none ${
                            isSnowingActive
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-400/40'
                              : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                          }`}
                        >
                          {isSnowingActive ? 'Bật' : 'Tắt'}
                        </span>
                      </button>
                    </div>

                    {/* NÚT TOGGLE CHUYỂN CHẾ ĐỘ SÁNG Ở DƯỚI CÙNG VỚI ClayThemeToggle */}
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={handleToggleDarkMode}
                      onKeyDown={(e) => {
                        if (e.key === ' ' || e.key === 'Enter') {
                          e.preventDefault();
                          handleToggleDarkMode();
                        }
                      }}
                      className="mt-2 pt-2 border-t border-zinc-500/20 flex items-center justify-between px-2 py-1.5 cursor-pointer hover:bg-white/5 rounded-lg transition-colors select-none"
                      title="Nhấp để chuyển sang chế độ sáng"
                    >
                      <span className="text-xs font-semibold select-none cursor-pointer">
                        Chế độ tối
                      </span>
                      <ClayThemeToggle
                        id="clay-toggle-library"
                        isOn={isDarkMode}
                        onToggle={handleToggleDarkMode}
                        theme={activeThemeId as NovelThemeId}
                        title="Gạt để chuyển sang chế độ sáng"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Nút Menu (Dropdown Menu ☰ hoàn toàn đồng bộ với trang chủ) */}
          <div className="relative" ref={mainMenuRef}>
            <button
              type="button"
              onClick={() => {
                setIsMainMenuOpen(!isMainMenuOpen);
                setIsThemeMenuOpen(false);
              }}
              className={`flex items-center gap-1.5 p-2 sm:px-3 sm:py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer shadow-xs ${tStyles.themeSelectorBtn}`}
              title="Menu điều hướng (Trang chủ, Thư viện, Tìm kiếm, Giới thiệu)"
              aria-label="Menu điều hướng"
            >
              <Menu className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline font-sans font-semibold">Menu</span>
            </button>

            {isMainMenuOpen && (
              <div className="absolute right-0 mt-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                {/* Lớp mây màu loang nhạt phía sau dropdown menu */}
                <div
                  aria-hidden="true"
                  className={`absolute inset-0 rounded-[1.35rem] bg-gradient-to-br ${menuThemeStyles.cloudGradient} blur-xl pointer-events-none -z-10`}
                />

                {!isDarkMode ? (
                  <div
                    className="p-[2.5px] rounded-[1.35rem] transition-all duration-300 shadow-2xl"
                    style={recentUpdatesStyles.outerStyle}
                  >
                    <div
                      className="flex flex-col justify-between w-52 sm:w-64 p-3 sm:p-4 rounded-[1.2rem] backdrop-blur-xl relative z-10"
                      style={recentUpdatesStyles.innerStyle}
                    >
                      <div className="space-y-1.5 sm:space-y-2">
                        {/* 1. Trang chủ */}
                        <button
                          type="button"
                          onClick={() => {
                            cosmicAudio.playChime('sparkle');
                            setIsMainMenuOpen(false);
                            onBackToNovels();
                          }}
                          className={`w-full px-3 py-1.5 sm:px-4 sm:py-2.5 rounded-full flex items-center justify-between transition-all duration-300 cursor-pointer ${menuThemeStyles.btnConvex}`}
                        >
                          <div className="flex items-center gap-1.5 sm:gap-2.5 text-[10px] sm:text-[13px] font-serif tracking-wider">
                            <span>Trang chủ</span>
                          </div>
                        </button>

                        {/* 2. Thư viện (Đang active) */}
                        <button
                          type="button"
                          onClick={() => {
                            cosmicAudio.playChime('sparkle');
                            setIsMainMenuOpen(false);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className={`w-full px-3 py-1.5 sm:px-4 sm:py-2.5 rounded-full flex items-center justify-between transition-all duration-300 cursor-pointer ${menuThemeStyles.btnInset}`}
                        >
                          <div className="flex items-center gap-1.5 sm:gap-2.5 text-[10px] sm:text-[13px] font-serif tracking-wider">
                            <span>Thư viện</span>
                            <span className={`text-[7.5px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full font-['Open_Sans'] font-medium ${menuThemeStyles.badge}`}>
                              Lịch sử đọc
                            </span>
                          </div>
                          <Heart
                            className="w-3.5 h-3.5 animate-pulse drop-shadow-xs shrink-0 pointer-events-none"
                            style={{
                              color: menuThemeStyles.heartColor,
                              fill: menuThemeStyles.heartColor,
                            }}
                          />
                        </button>

                        {/* 3. Tìm kiếm */}
                        <button
                          type="button"
                          onClick={() => {
                            cosmicAudio.playChime('sparkle');
                            setIsMainMenuOpen(false);
                            setIsSearchOpen(true);
                            setTimeout(() => {
                              searchInputRef.current?.focus();
                            }, 100);
                          }}
                          className={`w-full px-3 py-1.5 sm:px-4 sm:py-2.5 rounded-full flex items-center justify-between transition-all duration-300 cursor-pointer ${
                            isSearchOpen ? menuThemeStyles.btnInset : menuThemeStyles.btnConvex
                          }`}
                        >
                          <div className="flex items-center gap-1.5 sm:gap-2.5 text-[10px] sm:text-[13px] font-serif tracking-wider">
                            <span>Tìm kiếm</span>
                          </div>
                          {isSearchOpen && (
                            <Heart
                              className="w-3.5 h-3.5 animate-pulse drop-shadow-xs shrink-0 pointer-events-none"
                              style={{
                                color: menuThemeStyles.heartColor,
                                fill: menuThemeStyles.heartColor,
                              }}
                            />
                          )}
                        </button>

                        {/* 4. Giới thiệu về web */}
                        <button
                          type="button"
                          onClick={() => {
                            cosmicAudio.playChime('sparkle');
                            setIsMainMenuOpen(false);
                            if (onOpenLightIntro) {
                              onOpenLightIntro();
                            } else {
                              window.dispatchEvent(new CustomEvent('open-novel-intro'));
                            }
                          }}
                          className={`w-full px-3 py-1.5 sm:px-4 sm:py-2.5 rounded-full flex items-center justify-between transition-all duration-300 cursor-pointer ${menuThemeStyles.btnConvex}`}
                        >
                          <div className="flex items-center gap-1.5 sm:gap-2.5 text-[10px] sm:text-[13px] font-serif tracking-wider">
                            <span>Giới thiệu về web</span>
                          </div>
                        </button>

                        {/* 5. Quản trị */}
                        <button
                          type="button"
                          onClick={() => {
                            cosmicAudio.playChime('sparkle');
                            setIsMainMenuOpen(false);
                            onOpenAdminAuth?.();
                          }}
                          className={`w-full px-3 py-1.5 sm:px-4 sm:py-2.5 rounded-full flex items-center justify-between transition-all duration-300 cursor-pointer ${menuThemeStyles.btnConvex}`}
                          title={isAdmin ? 'Quản trị viên' : 'Đăng nhập tài khoản quản trị'}
                        >
                          <div className="flex items-center gap-1.5 sm:gap-2.5 text-[10px] sm:text-[13px] font-serif tracking-wider">
                            <span>{isAdmin ? 'Quản trị (Admin)' : 'Quản trị'}</span>
                          </div>
                          {isAdmin && (
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className="flex flex-col justify-between w-52 sm:w-64 p-3 sm:p-4 rounded-[1.35rem] relative z-10 shadow-2xl border border-white/20 opacity-100"
                    style={{ backgroundColor: '#0a0d14', background: '#0a0d14', backdropFilter: 'none', WebkitBackdropFilter: 'none' }}
                  >
                    <div className="space-y-1.5 sm:space-y-2">
                      {/* 1. Trang chủ */}
                      <button
                        type="button"
                        onClick={() => {
                          cosmicAudio.playChime('sparkle');
                          setIsMainMenuOpen(false);
                          onBackToNovels();
                        }}
                        className={`w-full px-3 py-1.5 sm:px-4 sm:py-2.5 rounded-full flex items-center justify-between transition-all duration-300 cursor-pointer ${menuThemeStyles.btnConvex}`}
                      >
                        <div className="flex items-center gap-1.5 sm:gap-2.5 text-[10px] sm:text-[13px] font-serif tracking-wider">
                          <span>Trang chủ</span>
                        </div>
                      </button>

                      {/* 2. Thư viện (Đang xem) */}
                      <button
                        type="button"
                        onClick={() => {
                          cosmicAudio.playChime('sparkle');
                          setIsMainMenuOpen(false);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`w-full px-3 py-1.5 sm:px-4 sm:py-2.5 rounded-full flex items-center justify-between transition-all duration-300 cursor-pointer ${menuThemeStyles.btnInset}`}
                      >
                        <div className="flex items-center gap-1.5 sm:gap-2.5 text-[10px] sm:text-[13px] font-serif tracking-wider">
                          <span>Thư viện</span>
                          <span className={`text-[7.5px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full font-['Open_Sans'] font-medium ${menuThemeStyles.badge}`}>
                            Lịch sử đọc
                          </span>
                        </div>
                        <Heart
                          className="w-3.5 h-3.5 animate-pulse drop-shadow-xs shrink-0 pointer-events-none"
                          style={{
                            color: menuThemeStyles.heartColor,
                            fill: menuThemeStyles.heartColor,
                          }}
                        />
                      </button>

                      {/* 3. Tìm kiếm */}
                      <button
                        type="button"
                        onClick={() => {
                          cosmicAudio.playChime('sparkle');
                          setIsMainMenuOpen(false);
                          setIsSearchOpen(true);
                          setTimeout(() => {
                            searchInputRef.current?.focus();
                          }, 100);
                        }}
                        className={`w-full px-3 py-1.5 sm:px-4 sm:py-2.5 rounded-full flex items-center justify-between transition-all duration-300 cursor-pointer ${
                          isSearchOpen ? menuThemeStyles.btnInset : menuThemeStyles.btnConvex
                        }`}
                      >
                        <div className="flex items-center gap-1.5 sm:gap-2.5 text-[10px] sm:text-[13px] font-serif tracking-wider">
                          <span>Tìm kiếm</span>
                        </div>
                        {isSearchOpen && (
                          <Heart
                            className="w-3.5 h-3.5 animate-pulse drop-shadow-xs shrink-0 pointer-events-none"
                            style={{
                              color: menuThemeStyles.heartColor,
                              fill: menuThemeStyles.heartColor,
                            }}
                          />
                        )}
                      </button>

                      {/* 4. Giới thiệu về web */}
                      <button
                        type="button"
                        onClick={() => {
                          cosmicAudio.playChime('sparkle');
                          setIsMainMenuOpen(false);
                          if (onOpenLightIntro) {
                            onOpenLightIntro();
                          } else {
                            window.dispatchEvent(new CustomEvent('open-novel-intro'));
                          }
                        }}
                        className={`w-full px-3 py-1.5 sm:px-4 sm:py-2.5 rounded-full flex items-center justify-between transition-all duration-300 cursor-pointer ${menuThemeStyles.btnConvex}`}
                      >
                        <div className="flex items-center gap-1.5 sm:gap-2.5 text-[10px] sm:text-[13px] font-serif tracking-wider">
                          <span>Giới thiệu về web</span>
                        </div>
                      </button>

                      {/* 5. Quản trị */}
                      <button
                        type="button"
                        onClick={() => {
                          cosmicAudio.playChime('sparkle');
                          setIsMainMenuOpen(false);
                          onOpenAdminAuth?.();
                        }}
                        className={`w-full px-3 py-1.5 sm:px-4 sm:py-2.5 rounded-full flex items-center justify-between transition-all duration-300 cursor-pointer ${menuThemeStyles.btnConvex}`}
                        title={isAdmin ? 'Quản trị viên' : 'Đăng nhập tài khoản quản trị'}
                      >
                        <div className="flex items-center gap-1.5 sm:gap-2.5 text-[10px] sm:text-[13px] font-serif tracking-wider">
                          <span>{isAdmin ? 'Quản trị (Admin)' : 'Quản trị'}</span>
                        </div>
                        {isAdmin && (
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* SEARCH BAR (Hiển thị khi nhấn nút Tìm kiếm trên Header) */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -8 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -8 }}
            className="relative z-30 w-full max-w-lg mx-auto px-3 sm:px-6 my-2 sm:my-3 overflow-visible"
          >
            <div
              className={`relative w-full rounded-full border backdrop-blur-md shadow-md transition-all ${themeConfig.searchContainerBg} ${themeConfig.searchContainerBorder}`}
            >
              <div className="flex items-center px-3.5 py-1.5 sm:py-2 gap-2 text-xs font-['Open_Sans']">
                <Search className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${themeConfig.accentText}`} />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  placeholder="Tìm kiếm tiểu thuyết, tác giả, thể loại..."
                  className={`w-full bg-transparent border-none outline-none text-[11px] sm:text-xs font-sans ${themeConfig.textPrimary} placeholder-opacity-60`}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="p-0.5 rounded-full hover:bg-black/10 text-current opacity-70 hover:opacity-100 transition-all cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className={`text-[10px] font-['Open_Sans'] px-1.5 py-0.5 rounded border ${themeConfig.cardDivider} ${themeConfig.textMuted}`}
                >
                  Đóng
                </button>
              </div>
            </div>

            {/* Quick Search Results Dropdown */}
            {searchQuery.trim().length > 0 && isSearchFocused && (
              <div
                className={`absolute top-full left-3 right-3 sm:left-6 sm:right-6 mt-1.5 rounded-xl border backdrop-blur-xl shadow-2xl p-2 z-50 max-h-60 overflow-y-auto ${themeConfig.dropdownBorder} ${themeConfig.dropdownText}`}
                style={{ backgroundColor: themeConfig.dropdownBg }}
              >
                <div className={`text-[10px] font-['Open_Sans'] px-2 py-1 flex items-center justify-between border-b ${themeConfig.cardDivider}`}>
                  <span className={themeConfig.accentText}>KẾT QUẢ TÌM KIẾM ({filteredNovels.length})</span>
                  <button
                    type="button"
                    onClick={() => setIsSearchFocused(false)}
                    className={`text-[9px] ${themeConfig.textMuted} hover:opacity-100`}
                  >
                    Đóng
                  </button>
                </div>
                <div className="space-y-1 mt-1">
                  {filteredNovels.length === 0 ? (
                    <div className={`text-center py-3 text-xs font-['Open_Sans'] ${themeConfig.textMuted}`}>
                      Không tìm thấy kết quả phù hợp
                    </div>
                  ) : (
                    filteredNovels.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          setIsSearchFocused(false);
                          if (onSelectNovel) {
                            onSelectNovel(n);
                          } else {
                            onBackToNovels();
                          }
                        }}
                        className={`flex items-center gap-2.5 p-1.5 rounded-lg transition-colors cursor-pointer text-left ${
                          isDarkMode ? 'hover:bg-white/10' : 'hover:bg-black/5'
                        }`}
                      >
                        <img
                          src={getDirectImageUrl(n.coverImage, n.id || n.title)}
                          alt={n.title}
                          onError={(e) => handleCoverImageError(e, n.id || n.title)}
                          className={`w-8 h-10 rounded object-cover border shrink-0 ${themeConfig.cardDivider}`}
                        />
                        <div className="min-w-0 flex-1">
                          <div className={`font-serif font-bold text-xs truncate ${themeConfig.textPrimary}`}>
                            {n.title}
                          </div>
                          <div className={`text-[9px] font-['Open_Sans'] truncate ${themeConfig.textMuted}`}>
                            {typeof n.author === 'string' ? n.author : n.author?.name} · {n.totalChaptersCount || n.chapters?.length || n.totalChapters || 1} chương
                          </div>
                        </div>
                        <span className={`text-[9px] shrink-0 ${themeConfig.accentText}`}>Đọc →</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* THE MAIN DASHBOARD: 3 COLUMNS IN 1 ROW (DỜI XUỐNG DƯỚI VỚI pt-6 sm:pt-9 md:pt-12) */}
      <main className="relative z-10 w-full max-w-6xl mx-auto px-2 sm:px-4 md:px-6 pt-6 sm:pt-9 md:pt-12 pb-4 sm:pb-6 flex flex-col items-center justify-center">
        {!isDarkMode ? (
          <EntireWhiteLilyAzureWidget
            themeId={activeThemeId}
            recentNovel={realRecentReads[0]?.novel || novels?.[0] || null}
            onSelectNovel={onSelectNovel}
            onOpenReading={() => {
              const rec = realRecentReads[0];
              if (rec && onOpenNovelToReadingPosition) {
                onOpenNovelToReadingPosition(rec.novel, rec.record?.chapterNumber || 1);
              } else if (rec?.novel && onSelectNovel) {
                onSelectNovel(rec.novel);
              } else if (novels?.[0] && onSelectNovel) {
                onSelectNovel(novels[0]);
              }
            }}
          />
        ) : (
          <EntireDarkLibraryWidget
            themeId={activeThemeId}
            recentNovel={realRecentReads[0]?.novel || novels?.[0] || null}
            onSelectNovel={onSelectNovel}
            onOpenReading={() => {
              const rec = realRecentReads[0];
              if (rec && onOpenNovelToReadingPosition) {
                onOpenNovelToReadingPosition(rec.novel, rec.record?.chapterNumber || 1);
              } else if (rec?.novel && onSelectNovel) {
                onSelectNovel(rec.novel);
              } else if (novels?.[0] && onSelectNovel) {
                onSelectNovel(novels[0]);
              }
            }}
          />
        )}
      </main>

      {/* READING NOVELS LIBRARY: ĐỒNG BỘ VỚI TRUYỆN NGƯỜI DÙNG ĐANG ĐỌC GẦN ĐÂY */}
      <section className="relative z-10 w-full max-w-6xl mx-auto px-3 sm:px-6 mt-6 sm:mt-8">
        <div className={`w-full pb-2 sm:pb-3 mb-3 sm:mb-4 border-b flex items-center justify-between ${themeConfig.cardDivider}`}>
          <div>
            <h2 className={`text-sm sm:text-lg font-serif font-bold tracking-wide ${themeConfig.textPrimary}`}>
              THƯ VIỆN CÁC BỘ TRUYỆN ĐÃ ĐỌC
            </h2>
            <p className={`text-[10px] sm:text-xs font-['Open_Sans'] mt-0.5 ${themeConfig.textMuted}`}>
              Lịch sử đọc gần đây ({realRecentReads.length})
            </p>
          </div>
        </div>

        {realRecentReads.length === 0 ? (
          <div className={`w-full text-center py-12 px-4 rounded-xl border backdrop-blur-md ${themeConfig.innerCardBg} ${themeConfig.innerCardBorder}`}>
            <BookOpen className={`w-8 h-8 mx-auto mb-2.5 ${themeConfig.textMuted}`} />
            <p className={`text-sm font-serif font-semibold ${themeConfig.textPrimary}`}>Chưa có lịch sử đọc truyện nào gần đây</p>
            <p className={`text-xs font-['Open_Sans'] mt-1 ${themeConfig.textMuted}`}>Các bộ truyện bạn đã mở đọc sẽ tự động xuất hiện tại đây</p>
            <button
              type="button"
              onClick={onBackToNovels}
              className={`mt-4 px-5 py-2.5 rounded-full text-xs font-serif font-bold transition-all cursor-pointer shadow-md hover:scale-105 ${
                !isDarkMode
                  ? getThemeLightBtnClass(activeThemeId)
                  : 'text-white'
              }`}
              style={isDarkMode ? { background: themeConfig.accentBtnBg } : undefined}
            >
              Khám phá Tủ Truyện →
            </button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
          >
            {realRecentReads.map(({ novel, record }, idx) => {
              const currentChapterNum = record.chapterNumber || 1;
              const totalChapters = novel.totalChaptersCount || novel.chapters?.length || novel.totalChapters || 1;
              const progressPercent = record.progressPercent || Math.min(100, Math.max(1, Math.round((currentChapterNum / totalChapters) * 100)));
              const coverUrl = getDirectImageUrl(novel.coverImage, novel.id || novel.title);
              const authorName = typeof novel.author === 'string' ? novel.author : novel.author?.name || 'Tác giả';
              const lastReadTime = formatTimeDiff(record.updatedAt);

              const handleOpenNovel = () => {
                cosmicAudio.playChime('sparkle');
                if (onOpenNovelToReadingPosition) {
                  onOpenNovelToReadingPosition(novel, currentChapterNum);
                } else if (onSelectNovel) {
                  onSelectNovel(novel);
                } else {
                  onBackToNovels();
                }
              };

              return (
                <motion.div
                  key={novel.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (idx % 6) * 0.06, duration: 0.45 }}
                  whileHover={{ y: -3, scale: 1.01 }}
                  onClick={handleOpenNovel}
                  className={`group relative flex flex-row items-center gap-3 p-2.5 sm:p-3 rounded-xl border transition-all overflow-hidden text-left cursor-pointer ${
                    !isDarkMode
                      ? `${getThemeCardClass(activeThemeId)} shadow-sm hover:shadow-md`
                      : `backdrop-blur-md shadow-md ${themeConfig.recentCardBg} ${themeConfig.recentCardBorder}`
                  }`}
                >
                  <div className={`relative w-20 h-28 sm:w-24 sm:h-34 md:w-28 md:h-40 rounded-lg overflow-hidden shrink-0 shadow-md border ${
                    !isDarkMode ? 'border-black/10 bg-black/5' : `${themeConfig.cardDivider} bg-black/20`
                  }`}>
                    <img
                      src={coverUrl}
                      alt={novel.title}
                      onError={(e) => handleCoverImageError(e, novel.id || novel.title)}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-0.5">
                    <div>
                      {/* Khoảng trống cố định thay cho 2 tags thể loại đã bỏ, giữ nguyên vị trí tên truyện không bị nhích lên */}
                      <div aria-hidden="true" className="h-[21px] sm:h-[23px] mb-1 pointer-events-none select-none" />

                      <h3
                        className={`font-serif font-bold text-xs sm:text-sm leading-tight line-clamp-1 group-hover:underline transition-colors ${themeConfig.textPrimary}`}
                        title={novel.title}
                      >
                        {novel.title}
                      </h3>
                      <p className={`text-[10px] font-['Open_Sans'] mt-0.5 truncate ${themeConfig.textMuted}`}>
                        Tác giả: {authorName}
                      </p>
                    </div>

                    <div className="my-1.5">
                      <div className="flex items-center justify-between text-[10px] font-['Open_Sans'] mb-1">
                        <span className={`font-semibold truncate ${themeConfig.textPrimary}`}>
                          Chương {currentChapterNum}/{totalChapters}
                        </span>
                        <span className={`font-bold shrink-0 ${themeConfig.accentText}`}>
                          {progressPercent}%
                        </span>
                      </div>

                      {/* Thanh tiến độ nhạt hơn và nhẹ nhàng ở chế độ sáng */}
                      <div className={`w-full h-1.5 rounded-full overflow-hidden p-[0.5px] ${isDarkMode ? 'bg-white/15' : 'bg-black/5'}`}>
                        <motion.div
                          className={`h-full rounded-full bg-gradient-to-r ${themeConfig.progressGradient} shadow-xs`}
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPercent}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                        />
                      </div>
                    </div>

                    <div className={`flex items-center justify-between pt-1 border-t text-[9px] font-['Open_Sans'] ${
                      !isDarkMode ? 'border-black/10 text-zinc-500' : `${themeConfig.cardDivider} ${themeConfig.textMuted}`
                    }`}>
                      <span className="flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        <span>{lastReadTime}</span>
                      </span>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenNovel();
                        }}
                        className={`flex items-center gap-1 font-bold transition-all cursor-pointer group-hover:translate-x-0.5 ${
                          !isDarkMode
                            ? `px-2.5 py-1 rounded-full text-[10px] ${getThemeLightBtnClass(activeThemeId)}`
                            : `${themeConfig.accentText} hover:opacity-80`
                        }`}
                      >
                        <span>Đọc tiếp</span>
                        <span>→</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </section>
    </div>
  );
};

export const InternalBeyondView = WinterSilverSnowView;
export default WinterSilverSnowView;
