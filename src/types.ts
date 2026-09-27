export interface Project {
  id: string;
  title: string;
  category: 'web' | 'creative' | 'uiux' | 'saas';
  categoryLabel: string;
  tagline: string;
  description: string;
  fullOverview: string;
  image: string;
  tags: string[];
  metrics?: { label: string; value: string }[];
  demoUrl?: string;
  githubUrl?: string;
  featured?: boolean;
}

export interface SkillCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  skills: {
    name: string;
    level: number; // 1-100
    icon?: string;
    experience: string;
    highlight?: string;
  }[];
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  type: string;
  description: string;
  highlights: string[];
  technologies: string[];
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar: string;
}

// NOVEL PLATFORM TYPES
export type NovelStatus = 'ongoing' | 'completed' | 'hiatus';

export interface NovelChapter {
  id: string;
  chapterNumber: number;
  title: string;
  wordCount: number;
  views?: number;
  publishedAt: string;
  content: string;
  isVip?: boolean;
  isExtra?: boolean;
}

export interface NovelComment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  createdAt: string;
  likes: number;
  badge?: string;
  rating?: number;
  truyenId?: string;
  ngayTao?: string;
  chapterNumber?: number;
  chapterTitle?: string;
}

export interface Novel {
  id: string;
  title: string;
  coverImage: string;
  coverImageUrl?: string;
  bannerImage?: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    title: string;
    totalNovels: number;
    followers: number;
  };
  translator?: string;
  editor?: string;
  badgeLabel?: string;
  totalChaptersCount?: number;
  tags?: string[];
  isHotTrend?: boolean;
  uploaderNote?: string;
  synopsis: string;
  worldLore?: string;
  genres: string[];
  status: NovelStatus;
  rating: number; // 1.0 - 5.0
  ratingCount: number;
  views: number;
  bookmarks: number;
  monthlyVotes: number;
  totalWords: number;
  latestChapter: {
    number: number;
    title: string;
    updatedAt: string;
  };
  chapters: NovelChapter[];
  comments: NovelComment[];
  featured?: boolean;
  rankingScore?: number;
  trangThai?: 'nhap' | 'daDang';
  isFirestore?: boolean;
  adminUid?: string;
  updatedAt?: string;
  createdAt?: string;
  totalChapters?: number;
}

export interface ReadingHistory {
  novelId: string;
  lastReadChapterNumber: number;
  updatedAt: string;
}

export interface NovelGenre {
  id: string;
  name: string;
  iconName: string;
  description: string;
  count: number;
  gradient: string;
}

export type DarkBackgroundOption =
  | 'horizon-vaults'
  | 'clay-spheres'
  | 'cover-halo';

export interface DarkBgOptionItem {
  id: DarkBackgroundOption;
  name: string;
  shortDesc: string;
  tag: string;
  iconName?: string;
}

export const DARK_BG_OPTIONS: DarkBgOptionItem[] = [
  {
    id: 'horizon-vaults',
    name: 'Hiệu ứng khối cầu',
    shortDesc: 'Khối cầu tán sắc 4 nấc viền khí quyển Fresnel, đối trọng chéo giải phóng trung tâm',
    tag: 'Spheres Effect',
  },
  {
    id: 'cover-halo',
    name: 'Hào Quang Bìa Truyện',
    shortDesc: 'Đĩa sáng thấu kính 3 góc lấy cảm hứng từ ảnh bìa truyện',
    tag: 'Cover Poster',
  },
];

