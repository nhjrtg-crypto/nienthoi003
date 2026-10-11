import React, { useState, useMemo } from 'react';
import {
  Heart,
  BookOpen,
  Bookmark,
  FileText,
  ListOrdered,
  Search,
  ArrowUpDown,
  MessageSquare,
  Send,
  Reply,
  Tag,
  CheckCircle2,
  Trash2,
  Star,
} from 'lucide-react';
import { Novel, NovelChapter, NovelComment } from '../types';
import { getDirectImageUrl, handleCoverImageError } from '../utils/imageUtils';
import { NovelThemeId, getChapterDisplayParts, getCommentChapterBadgeStyle } from '../utils/themeStyles';
import { normalizeCommentDate } from '../utils/dateUtils';

interface SpiralThemeStyles {
  themeName: string;
  bannerBadge: string;
  bannerBadgeIcon: string;
  bannerTitle: string;
  bannerDivider: string;
  coverBg: string;
  coverBorder: string;
  coverShadow: string;
  outerCoverStyle?: React.CSSProperties;
  innerPaperStyle?: React.CSSProperties;
  ringsGradient: string;
  ringsBorder: string;
  holesBg: string;
  holesBorder: string;
  spineBg: string;
  spineDashedBorder: string;
  spineShadow: string;
  spineHoleBorder: string;
  spineHoleBg: string;
  spineHoleCenterBg: string;
  paperBg: string;
  paperBorder: string;
  paperText: string;
  dashedBorder: string;
  plannerBadgeBg: string;
  plannerBadgeText: string;
  plannerBadgeBorder: string;
  dateText: string;
  rulerText: string;
  rulerBg: string;
  rulerBorder: string;
  overviewBg: string;
  overviewBorder: string;
  binderClip: string;
  statusBadge: string;
  cardInnerBg: string;
  cardInnerBorder: string;
  authorEditorBoxBg: string;
  iconAccent: string;
  subIconAccent: string;
  tagPill: string;
  primaryBtn: string;
  bookmarkBtn: string;
  likeBtn: string;
  synopsisHeaderIcon: string;
  synopsisHeaderText: string;
  synopsisBorderLeft: string;
  loreBoxBg: string;
  loreBoxBorder: string;
  loreTitleText: string;
  loreIconText: string;
  loreBodyText: string;
  chaptersHeaderIcon: string;
  chaptersHeaderText: string;
  chaptersBadge: string;
  inputBg: string;
  inputBorder: string;
  inputFocus: string;
  inputText: string;
  chapterCardBg: string;
  chapterCardBorder: string;
  chapterCardHoverBorder: string;
  chapterCardHoverText: string;
  chapterReadArrow: string;
  extraChapterBadge: string;
  commentsHeaderIcon: string;
  commentsHeaderText: string;
  commentsBadge: string;
  commentFormBg: string;
  commentFormBorder: string;
  commentInputBg: string;
  commentInputBorder: string;
  commentBtn: string;
  commentItemBg: string;
  commentItemBorder: string;
  commentAvatarBg: string;
  editorNoteBg: string;
  editorNoteBorder: string;
  editorNoteTitle: string;
  editorNoteIcon: string;
  relatedHeaderIcon: string;
  relatedHeaderText: string;
  relatedCardBg: string;
  relatedCardBorder: string;
  relatedCardHoverBorder: string;
  relatedCardHoverTitle: string;
  relatedLinkText: string;
  footerBorder: string;
  footerText: string;
  washiTape: string;
  washiBgPattern: string;
  washiBorder: string;
  synopsisLineColor: string;
  heartIcon: string;
  chapterScrollbar: string;
  paperClipClass?: string;
}

function getSpiralThemeStyles(theme: NovelThemeId, isDark: boolean): SpiralThemeStyles {
  // 1. COSMIC THEME
  if (theme === 'cosmic') {
    if (!isDark) {
      // Light mode Cosmic (Dựa trên theme White, màu trắng chủ đạo, vật thể bên trong hợp theme, nút đọc trầm nhạt hơn)
      return {
        themeName: 'CỰC QUANG NGÂN HÀ PASTEL',
        outerCoverStyle: {
          border: '1px solid transparent',
          background: `
            linear-gradient(135deg, 
              rgba(250, 246, 255, 0.85) 0%, 
              rgba(253, 248, 255, 0.80) 18%, 
              rgba(255, 255, 255, 0.92) 32%, 
              rgba(255, 255, 255, 0.92) 68%, 
              rgba(250, 246, 255, 0.80) 82%, 
              rgba(250, 246, 255, 0.85) 100%
            ) padding-box,
            linear-gradient(to bottom, 
              rgba(186, 150, 235, 0.35) 0%, 
              rgba(168, 125, 222, 0.38) 40%, 
              rgba(147, 95, 210, 0.32) 100%
            ) border-box
          `,
          boxShadow: '4px 4px 14px rgba(170, 135, 215, 0.12), -3px -3px 12px rgba(255, 255, 255, 0.95), inset 0 1px 1px rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
        },
        innerPaperStyle: {
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 1)',
        },
        bannerBadge: 'cosmic-light-novel-tag font-semibold',
        bannerBadgeIcon: 'text-[#9333ea] fill-[#f3e8ff]',
        bannerTitle: 'text-[#282548]',
        bannerDivider: 'bg-gradient-to-r from-transparent via-[#c084fc] to-transparent',
        coverBg: 'bg-white/80 backdrop-blur-2xl',
        coverBorder: 'border-transparent',
        coverShadow: '',
        ringsGradient: 'bg-gradient-to-r from-[#d9c4f0] via-[#fbf7ff] to-[#f0c8e4]',
        ringsBorder: 'border-[#caa7e8]',
        holesBg: 'bg-[#ecdcf7]',
        holesBorder: 'border-[#d8c4ee]',
        spineBg: 'bg-gradient-to-b from-[#f5ebfc] via-[#eedcf9] to-[#e4ccf5]',
        spineDashedBorder: 'border-[#d6b7f3]',
        spineShadow: 'shadow-[inset_-2px_0_10px_rgba(147,51,234,0.10)]',
        spineHoleBorder: 'border-[#caa2ee]',
        spineHoleBg: 'bg-[#faf5ff]',
        spineHoleCenterBg: 'bg-[#c89ef0]',
        paperBg: 'bg-[#ffffff]',
        paperBorder: 'border border-[#e9d5ff]/80',
        paperText: 'text-[#282548]',
        dashedBorder: 'border-[#e9d5ff]',
        plannerBadgeBg: 'bg-[#f3e8ff]',
        plannerBadgeText: 'text-[#5d3f82]',
        plannerBadgeBorder: 'border border-[#d8c4ee]',
        dateText: 'text-[#7c3aed]',
        rulerText: 'text-[#7c3aed]',
        rulerBg: 'bg-[#fbf7ff]',
        rulerBorder: 'border-[#e9d5ff]',
        overviewBg: 'bg-white/95',
        overviewBorder: 'border border-[#e9d5ff]',
        binderClip: 'bg-gradient-to-r from-[#9333ea] to-[#c084fc] border-[#5d3f82] shadow-md',
        statusBadge: 'bg-[#f3e8ff] text-[#5d3f82] border border-[#d8c4ee] shadow-xs font-semibold',
        cardInnerBg: 'bg-white/95',
        cardInnerBorder: 'border border-[#e9d5ff]',
        authorEditorBoxBg: 'bg-[#f4ecfc]',
        iconAccent: 'text-[#7c3aed]',
        subIconAccent: 'text-[#a855f7]',
        tagPill: 'cosmic-light-novel-tag font-medium',
        primaryBtn: 'cosmic-light-btn-active font-bold shadow-xs',
        bookmarkBtn: 'cosmic-light-btn',
        likeBtn: 'cosmic-light-btn',
        synopsisHeaderIcon: 'text-[#7c3aed]',
        synopsisHeaderText: 'text-[#282548] font-bold',
        synopsisBorderLeft: 'border-[#9333ea]',
        loreBoxBg: 'bg-white/95',
        loreBoxBorder: 'border border-[#e9d5ff]',
        loreTitleText: 'text-[#282548] font-semibold',
        loreIconText: 'text-[#7c3aed]',
        loreBodyText: 'text-[#413e63]',
        chaptersHeaderIcon: 'text-[#7c3aed]',
        chaptersHeaderText: 'text-[#282548] font-bold',
        chaptersBadge: 'bg-[#f3e8ff] text-[#5d3f82] border border-[#d8c4ee] font-semibold',
        inputBg: 'bg-white',
        inputBorder: 'border-[#e9d5ff]',
        inputFocus: 'focus:border-[#9333ea] focus:ring-2 focus:ring-[#9333ea]/20',
        inputText: 'text-[#282548]',
        chapterCardBg: 'bg-[#faf5ff]/90',
        chapterCardBorder: 'border border-[#e9d5ff]',
        chapterCardHoverBorder: 'hover:border-[#c084fc] hover:shadow-md hover:shadow-[#9333ea]/10',
        chapterCardHoverText: 'group-hover:text-[#7c3aed]',
        chapterReadArrow: 'text-[#7c3aed]',
        extraChapterBadge: 'bg-[#f3e8ff] text-[#5d3f82] border border-[#d8c4ee]',
        commentsHeaderIcon: 'text-[#7c3aed]',
        commentsHeaderText: 'text-[#282548] font-bold',
        commentsBadge: 'text-[#7c3aed]',
        commentFormBg: 'bg-[#faf5ff]/90',
        commentFormBorder: 'border border-[#e9d5ff]',
        commentInputBg: 'bg-[#f3edf9]',
        commentInputBorder: 'border-[#dfd0f2]',
        commentBtn: 'cosmic-light-btn-active font-bold shadow-xs',
        commentItemBg: 'bg-[#faf5ff]/90',
        commentItemBorder: 'border border-[#e9d5ff]/80',
        commentAvatarBg: 'bg-gradient-to-br from-[#9333ea] to-[#c084fc] text-white font-bold shadow-sm',
        editorNoteBg: 'bg-[#faf5ff]/90',
        editorNoteBorder: 'border border-[#e9d5ff]',
        editorNoteTitle: 'text-[#282548] font-semibold',
        editorNoteIcon: 'text-[#7c3aed]',
        relatedHeaderIcon: 'text-[#7c3aed]',
        relatedHeaderText: 'text-[#282548] font-bold',
        relatedCardBg: 'bg-[#faf5ff]/90',
        relatedCardBorder: 'border border-[#e9d5ff]',
        relatedCardHoverBorder: 'hover:border-[#c084fc]',
        relatedCardHoverTitle: 'group-hover:text-[#7c3aed]',
        relatedLinkText: 'text-[#7c3aed]',
        footerBorder: 'border-[#e9d5ff]',
        footerText: 'text-[#8a87b5]',
        washiTape: 'bg-[#edf0fc]/90 border-[#d4daf7]',
        washiBgPattern: 'repeating-linear-gradient(45deg, #edf0fc 0px, #edf0fc 6px, #ffffff 6px, #ffffff 12px)',
        washiBorder: '1px solid rgba(212, 218, 247, 0.7)',
        synopsisLineColor: 'rgba(185, 192, 230, 0.05)',
        heartIcon: 'text-[#9333ea] fill-[#e4e7fa]/60',
        chapterScrollbar: '[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-[#f4f5fd] [&::-webkit-scrollbar-thumb]:bg-[#cfd5f6]/60 hover:[&::-webkit-scrollbar-thumb]:bg-[#9333ea]/80 [&::-webkit-scrollbar-thumb]:rounded-full [scrollbar-color:rgba(207,213,246,0.6)_transparent] [scrollbar-width:thin]',
        paperClipClass: 'text-[#b49fe8]',
      };
    }
    // Dark mode Cosmic (Starry Galaxy Glassmorphism)
    return {
      themeName: 'VŨ TRỤ HUYỀN ẢO',
      bannerBadge: 'text-purple-200 bg-white/[0.08] backdrop-blur-xl border border-white/15 shadow-xs',
      bannerBadgeIcon: 'text-indigo-400 fill-purple-400/50',
      bannerTitle: 'text-purple-100 drop-shadow-md',
      bannerDivider: 'bg-gradient-to-r from-indigo-500/80 via-purple-400/80 to-pink-500/80',
      coverBg: 'bg-[#090c20]/40 backdrop-blur-2xl',
      coverBorder: 'border-purple-400/20',
      coverShadow: 'shadow-[0_25px_60px_rgba(0,0,0,0.65)]',
      ringsGradient: 'bg-gradient-to-r from-indigo-400 via-purple-200 to-pink-400',
      ringsBorder: 'border-indigo-400/50',
      holesBg: 'bg-black/50 backdrop-blur-md',
      holesBorder: 'border-purple-900/60',
      spineBg: 'bg-[#10142e]/75 backdrop-blur-xl',
      spineDashedBorder: 'border-purple-400/30',
      spineShadow: 'shadow-[inset_-2px_0_10px_rgba(0,0,0,0.45)]',
      spineHoleBorder: 'border-purple-400/25',
      spineHoleBg: 'bg-black/70',
      spineHoleCenterBg: 'bg-purple-400/35',
      paperBg: 'bg-[#060818]/45 backdrop-blur-2xl',
      paperBorder: 'border-white/[0.08]',
      paperText: 'text-purple-100',
      dashedBorder: 'border-white/[0.08]',
      plannerBadgeBg: 'bg-white/[0.08] backdrop-blur-xl',
      plannerBadgeText: 'text-purple-200',
      plannerBadgeBorder: 'border-transparent',
      dateText: 'text-purple-300/80',
      rulerText: 'text-purple-300/80',
      rulerBg: 'bg-white/[0.04] backdrop-blur-xl',
      rulerBorder: 'border-transparent',
      overviewBg: 'bg-white/[0.035] backdrop-blur-2xl',
      overviewBorder: 'border-transparent',
      binderClip: 'bg-purple-500 border-purple-400 shadow-md',
      statusBadge: 'bg-white/[0.08] backdrop-blur-xl text-purple-200 border border-white/15 shadow-xs',
      cardInnerBg: 'bg-white/[0.04] backdrop-blur-xl',
      cardInnerBorder: 'border-transparent',
      authorEditorBoxBg: 'bg-white/[0.06]',
      iconAccent: 'text-purple-400',
      subIconAccent: 'text-pink-400',
      tagPill: 'bg-white/[0.05] backdrop-blur-md text-purple-200 border border-transparent hover:bg-white/[0.1] hover:border-white/15 transition-colors',
      primaryBtn: 'bg-gradient-to-r from-indigo-600/90 via-purple-600/90 to-pink-600/90 backdrop-blur-xl text-white shadow-[0_8px_25px_rgba(147,51,234,0.35)] border border-white/20 hover:border-white/35',
      bookmarkBtn: 'bg-white/[0.06] backdrop-blur-xl text-stone-200 border border-white/15 hover:bg-white/[0.12]',
      likeBtn: 'bg-white/[0.06] backdrop-blur-xl text-rose-300 border border-white/15 hover:border-rose-400/40',
      synopsisHeaderIcon: 'text-purple-400',
      synopsisHeaderText: 'text-purple-300',
      synopsisBorderLeft: 'border-purple-500/80',
      loreBoxBg: 'bg-white/[0.035] backdrop-blur-2xl',
      loreBoxBorder: 'border border-purple-500/20 border-l-2 border-l-purple-400/80',
      loreTitleText: 'text-purple-200',
      loreIconText: 'text-purple-400',
      loreBodyText: 'text-purple-100/90',
      chaptersHeaderIcon: 'text-purple-400',
      chaptersHeaderText: 'text-purple-300',
      chaptersBadge: 'bg-white/[0.06] backdrop-blur-md text-purple-200 border-transparent',
      inputBg: 'bg-white/[0.05] backdrop-blur-xl',
      inputBorder: 'border-white/15',
      inputFocus: 'focus:border-purple-400/80 focus:bg-white/[0.09]',
      inputText: 'text-purple-100 placeholder-purple-300/40',
      chapterCardBg: 'bg-white/[0.035] backdrop-blur-xl',
      chapterCardBorder: 'border-transparent',
      chapterCardHoverBorder: 'hover:bg-white/[0.08] hover:border-white/10',
      chapterCardHoverText: 'group-hover:text-purple-200',
      chapterReadArrow: 'text-purple-400',
      extraChapterBadge: 'bg-purple-500/20 backdrop-blur-md text-purple-200 border-transparent',
      commentsHeaderIcon: 'text-purple-400',
      commentsHeaderText: 'text-purple-300',
      commentsBadge: 'text-purple-300/70',
      commentFormBg: 'bg-white/[0.035] backdrop-blur-2xl',
      commentFormBorder: 'border-transparent',
      commentInputBg: 'bg-white/[0.05] backdrop-blur-xl',
      commentInputBorder: 'border-white/15',
      commentBtn: 'bg-gradient-to-r from-purple-600/90 via-purple-500/90 to-pink-600/90 backdrop-blur-xl hover:opacity-95 text-white shadow-sm border border-white/20',
      commentItemBg: 'bg-white/[0.035] backdrop-blur-xl',
      commentItemBorder: 'border-transparent',
      commentAvatarBg: 'bg-purple-600/80 backdrop-blur-md text-white border border-white/20 shadow-sm',
      editorNoteBg: 'bg-white/[0.035] backdrop-blur-2xl',
      editorNoteBorder: 'border-transparent',
      editorNoteTitle: 'text-purple-300',
      editorNoteIcon: 'text-purple-400',
      relatedHeaderIcon: 'text-purple-400',
      relatedHeaderText: 'text-purple-300',
      relatedCardBg: 'bg-white/[0.035] backdrop-blur-xl',
      relatedCardBorder: 'border-transparent',
      relatedCardHoverBorder: 'hover:bg-white/[0.08] hover:border-white/10',
      relatedCardHoverTitle: 'group-hover:text-purple-200',
      relatedLinkText: 'text-purple-400',
      footerBorder: 'border-white/[0.08]',
      footerText: 'text-purple-300/60',
      washiTape: 'bg-white/[0.12] backdrop-blur-md border-white/20',
      washiBgPattern: 'repeating-linear-gradient(45deg, rgba(147,51,234,0.35) 0px, rgba(147,51,234,0.35) 6px, rgba(255,255,255,0.12) 6px, rgba(255,255,255,0.12) 12px)',
      washiBorder: '1px solid rgba(255, 255, 255, 0.25)',
      synopsisLineColor: 'transparent',
      heartIcon: 'text-purple-400 fill-purple-400/50',
      chapterScrollbar: '[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-white/[0.02] [&::-webkit-scrollbar-thumb]:bg-purple-500/50 hover:[&::-webkit-scrollbar-thumb]:bg-purple-400/80 [&::-webkit-scrollbar-thumb]:rounded-full [scrollbar-color:rgba(168,85,247,0.5)_transparent] [scrollbar-width:thin]',
      paperClipClass: 'text-[#7e61a8]',
    };
  }

  // 2. NOTEBOOK / WHITE THEME
  if (theme === 'notebook') {
    if (isDark) {
      return {
        themeName: 'MONOCHROME GRAPHITE',
        bannerBadge: 'text-zinc-200 bg-white/[0.06] backdrop-blur-md border border-white/15 shadow-xs',
        bannerBadgeIcon: 'text-zinc-400 fill-zinc-500/40',
        bannerTitle: 'text-zinc-100 drop-shadow-sm',
        bannerDivider: 'bg-gradient-to-r from-zinc-500 via-zinc-200 to-zinc-500',
        coverBg: 'bg-[#121215]/50 backdrop-blur-2xl',
        coverBorder: 'border-zinc-700/40',
        coverShadow: 'shadow-[0_25px_60px_rgba(0,0,0,0.65)]',
        ringsGradient: 'bg-gradient-to-r from-zinc-500/80 via-zinc-200/80 to-zinc-500/80',
        ringsBorder: 'border-zinc-400/50',
        holesBg: 'bg-black/60 backdrop-blur-sm',
        holesBorder: 'border-zinc-700/60',
        spineBg: 'bg-[#18181d]/75 backdrop-blur-lg',
        spineDashedBorder: 'border-zinc-600/40',
        spineShadow: 'shadow-[inset_-2px_0_10px_rgba(0,0,0,0.45)]',
        spineHoleBorder: 'border-zinc-500/25',
        spineHoleBg: 'bg-black/70',
        spineHoleCenterBg: 'bg-white/[0.12]',
        paperBg: 'bg-[#0a0a0d]/55 backdrop-blur-2xl',
        paperBorder: 'border-zinc-700/40',
        paperText: 'text-zinc-100',
        dashedBorder: 'border-white/[0.08]',
        plannerBadgeBg: 'bg-white/[0.08] backdrop-blur-md',
        plannerBadgeText: 'text-zinc-200',
        plannerBadgeBorder: 'border-transparent',
        dateText: 'text-zinc-400',
        rulerText: 'text-zinc-400',
        rulerBg: 'bg-white/[0.04] backdrop-blur-md',
        rulerBorder: 'border-transparent',
        overviewBg: 'bg-white/[0.035] backdrop-blur-xl',
        overviewBorder: 'border-transparent',
        binderClip: 'bg-zinc-400 border-zinc-300',
        statusBadge: 'bg-white/[0.08] backdrop-blur-md text-zinc-100 border border-white/15',
        cardInnerBg: 'bg-white/[0.04] backdrop-blur-md',
        cardInnerBorder: 'border-transparent',
        authorEditorBoxBg: 'bg-white/[0.06]',
        iconAccent: 'text-zinc-300',
        subIconAccent: 'text-zinc-400',
        tagPill: 'bg-white/[0.05] backdrop-blur-sm text-zinc-200 border border-transparent hover:bg-white/[0.1] hover:border-white/15 transition-colors',
        primaryBtn: 'bg-gradient-to-r from-zinc-200 via-white to-zinc-200 text-zinc-950 font-bold shadow-md hover:opacity-95 border border-white/20',
        bookmarkBtn: 'bg-white/[0.06] backdrop-blur-md text-zinc-200 border border-white/15 hover:bg-white/[0.12]',
        likeBtn: 'bg-white/[0.06] backdrop-blur-md text-rose-400 border border-white/15 hover:border-rose-500/40',
        synopsisHeaderIcon: 'text-zinc-300',
        synopsisHeaderText: 'text-zinc-200',
        synopsisBorderLeft: 'border-zinc-400',
        loreBoxBg: 'bg-white/[0.035] backdrop-blur-xl',
        loreBoxBorder: 'border border-white/10 border-l-2 border-l-zinc-400/80',
        loreTitleText: 'text-zinc-200',
        loreIconText: 'text-zinc-400',
        loreBodyText: 'text-zinc-300',
        chaptersHeaderIcon: 'text-zinc-300',
        chaptersHeaderText: 'text-zinc-200',
        chaptersBadge: 'bg-white/[0.06] backdrop-blur-sm text-zinc-200 border-transparent',
        inputBg: 'bg-white/[0.04] backdrop-blur-md',
        inputBorder: 'border-white/15',
        inputFocus: 'focus:border-zinc-300 focus:bg-white/[0.08]',
        inputText: 'text-zinc-100 placeholder-zinc-400',
        chapterCardBg: 'bg-white/[0.035] backdrop-blur-md',
        chapterCardBorder: 'border-transparent',
        chapterCardHoverBorder: 'hover:bg-white/[0.08] hover:border-white/10',
        chapterCardHoverText: 'group-hover:text-white',
        chapterReadArrow: 'text-zinc-300 group-hover:text-white',
        extraChapterBadge: 'bg-white/[0.08] backdrop-blur-xs text-zinc-200 border-transparent',
        commentsHeaderIcon: 'text-zinc-300',
        commentsHeaderText: 'text-zinc-200',
        commentsBadge: 'text-zinc-400',
        commentFormBg: 'bg-white/[0.035] backdrop-blur-xl',
        commentFormBorder: 'border-transparent',
        commentInputBg: 'bg-white/[0.05] backdrop-blur-md',
        commentInputBorder: 'border-white/15',
        commentBtn: 'bg-gradient-to-r from-zinc-200 to-zinc-300 hover:opacity-95 text-zinc-950 font-bold border border-white/20',
        commentItemBg: 'bg-white/[0.035] backdrop-blur-md',
        commentItemBorder: 'border-transparent',
        commentAvatarBg: 'bg-zinc-300 text-zinc-950 font-bold shadow-sm',
        editorNoteBg: 'bg-white/[0.035] backdrop-blur-xl',
        editorNoteBorder: 'border-transparent',
        editorNoteTitle: 'text-zinc-200',
        editorNoteIcon: 'text-zinc-400',
        relatedHeaderIcon: 'text-zinc-300',
        relatedHeaderText: 'text-zinc-200',
        relatedCardBg: 'bg-white/[0.035] backdrop-blur-md',
        relatedCardBorder: 'border-transparent',
        relatedCardHoverBorder: 'hover:bg-white/[0.08] hover:border-white/10',
        relatedCardHoverTitle: 'group-hover:text-white',
        relatedLinkText: 'text-zinc-300',
        footerBorder: 'border-zinc-700/40',
        footerText: 'text-zinc-400',
        washiTape: 'bg-white/[0.08] backdrop-blur-xs border-white/20',
        washiBgPattern: 'repeating-linear-gradient(45deg, #27272a 0px, #27272a 6px, #18181b 6px, #18181b 12px)',
        washiBorder: '1px solid rgba(228, 228, 231, 0.3)',
        synopsisLineColor: 'transparent',
        heartIcon: 'text-zinc-400 fill-zinc-500/50',
        chapterScrollbar: '[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-white/[0.02] [&::-webkit-scrollbar-thumb]:bg-zinc-600/50 hover:[&::-webkit-scrollbar-thumb]:bg-zinc-500/80 [&::-webkit-scrollbar-thumb]:rounded-full [scrollbar-color:rgba(161,161,170,0.5)_transparent] [scrollbar-width:thin]',
        paperClipClass: 'text-[#5a6678]',
      };
    }
    // Light mode White (Áp dụng hiệu ứng, đường viền, màu sắc mục Tiểu thuyết đã hoàn - Chuẩn tone trắng sáng bạc, không ám vàng)
    return {
      themeName: 'TRẮNG TINH KHÔI',
      outerCoverStyle: {
        border: '1px solid transparent',
        background: `
          linear-gradient(135deg, 
            rgba(248, 250, 252, 0.85) 0%, 
            rgba(252, 253, 255, 0.80) 18%, 
            rgba(255, 255, 255, 0.92) 32%, 
            rgba(255, 255, 255, 0.92) 68%, 
            rgba(252, 253, 255, 0.80) 82%, 
            rgba(248, 250, 252, 0.85) 100%
          ) padding-box,
          linear-gradient(to bottom, 
            rgba(160, 174, 192, 0.40) 0%, 
            rgba(135, 152, 172, 0.35) 40%, 
            rgba(110, 128, 152, 0.30) 100%
          ) border-box
        `,
        boxShadow: '4px 4px 14px rgba(140, 155, 175, 0.12), -3px -3px 12px rgba(255, 255, 255, 0.95), inset 0 1px 1px rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
      },
      innerPaperStyle: {
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 1)',
      },
      bannerBadge: 'notebook-light-novel-tag font-bold',
      bannerBadgeIcon: 'text-[#64748b] fill-[#f1f5f9]',
      bannerTitle: 'text-[#0f172a]',
      bannerDivider: 'bg-gradient-to-r from-transparent via-[#94a3b8] to-transparent',
      coverBg: 'bg-white/80 backdrop-blur-2xl',
      coverBorder: 'border-transparent',
      coverShadow: '',
      ringsGradient: 'bg-gradient-to-r from-slate-300 via-slate-100 to-slate-300',
      ringsBorder: 'border-slate-300/80',
      holesBg: 'bg-slate-200',
      holesBorder: 'border-slate-300',
      spineBg: 'bg-gradient-to-b from-[#f1f5f9] via-[#e8eff5] to-[#dde5ed]',
      spineDashedBorder: 'border-[#cbd5e1]',
      spineShadow: 'shadow-[inset_-2px_0_10px_rgba(100,116,139,0.10)]',
      spineHoleBorder: 'border-[#b0bec5]',
      spineHoleBg: 'bg-[#f8fafc]',
      spineHoleCenterBg: 'bg-[#94a3b8]',
      paperBg: 'bg-[#ffffff]',
      paperBorder: 'border border-[#e2e8f0]',
      paperText: 'text-[#0f172a]',
      dashedBorder: 'border-[#e2e8f0]',
      plannerBadgeBg: 'notebook-light-novel-tag',
      plannerBadgeText: 'text-[#0f172a]',
      plannerBadgeBorder: 'border-[#e2e8f0]',
      dateText: 'text-[#64748b]',
      rulerText: 'text-[#64748b]',
      rulerBg: 'bg-[#f8fafc]',
      rulerBorder: 'border-[#e2e8f0]',
      overviewBg: 'bg-white/95',
      overviewBorder: 'border border-[#e2e8f0]',
      binderClip: 'bg-[#64748b] border-[#475569] shadow-md',
      statusBadge: 'bg-[#f8fafc] text-[#0f172a] border border-[#e2e8f0] shadow-xs font-semibold',
      cardInnerBg: 'bg-white/95',
      cardInnerBorder: 'border border-[#e2e8f0]',
      authorEditorBoxBg: 'bg-[#f1f5f9]',
      iconAccent: 'text-[#64748b]',
      subIconAccent: 'text-[#94a3b8]',
      tagPill: 'notebook-light-novel-tag font-medium',
      primaryBtn: 'notebook-light-btn-active font-black shadow-md',
      bookmarkBtn: 'notebook-light-btn',
      likeBtn: 'notebook-light-btn',
      synopsisHeaderIcon: 'text-[#64748b]',
      synopsisHeaderText: 'text-[#0f172a] font-bold',
      synopsisBorderLeft: 'border-[#64748b]',
      loreBoxBg: 'bg-white/95',
      loreBoxBorder: 'border border-[#e2e8f0]',
      loreTitleText: 'text-[#0f172a] font-semibold',
      loreIconText: 'text-[#64748b]',
      loreBodyText: 'text-[#334155]',
      chaptersHeaderIcon: 'text-[#64748b]',
      chaptersHeaderText: 'text-[#0f172a] font-bold',
      chaptersBadge: 'bg-[#f8fafc] text-[#0f172a] border border-[#e2e8f0] font-semibold',
      inputBg: 'bg-white',
      inputBorder: 'border-[#e2e8f0]',
      inputFocus: 'focus:border-[#64748b] focus:ring-2 focus:ring-[#64748b]/20',
      inputText: 'text-[#0f172a]',
      chapterCardBg: 'bg-[#f8fafc]/90',
      chapterCardBorder: 'border border-[#e2e8f0]',
      chapterCardHoverBorder: 'hover:border-[#64748b] hover:shadow-md hover:shadow-slate-500/10',
      chapterCardHoverText: 'group-hover:text-[#0f172a]',
      chapterReadArrow: 'text-[#64748b]',
      extraChapterBadge: 'bg-[#f8fafc] text-[#0f172a] border border-[#e2e8f0]',
      commentsHeaderIcon: 'text-[#64748b]',
      commentsHeaderText: 'text-[#0f172a] font-bold',
      commentsBadge: 'text-[#64748b]',
      commentFormBg: 'bg-[#f8fafc]/90',
      commentFormBorder: 'border border-[#e2e8f0]',
      commentInputBg: 'bg-[#f1f5f9]',
      commentInputBorder: 'border-[#cbd5e1]',
      commentBtn: 'notebook-light-btn-active font-bold shadow-md',
      commentItemBg: 'bg-[#f8fafc]/90',
      commentItemBorder: 'border border-[#e2e8f0]',
      commentAvatarBg: 'bg-[#64748b] text-white font-bold shadow-sm',
      editorNoteBg: 'bg-[#f8fafc]/90',
      editorNoteBorder: 'border border-[#e2e8f0]',
      editorNoteTitle: 'text-[#0f172a] font-semibold',
      editorNoteIcon: 'text-[#64748b]',
      relatedHeaderIcon: 'text-[#64748b]',
      relatedHeaderText: 'text-[#0f172a] font-bold',
      relatedCardBg: 'bg-[#f8fafc]/90',
      relatedCardBorder: 'border border-[#e2e8f0]',
      relatedCardHoverBorder: 'hover:border-[#64748b]',
      relatedCardHoverTitle: 'group-hover:text-[#0f172a]',
      relatedLinkText: 'text-[#64748b]',
      footerBorder: 'border-[#e2e8f0]',
      footerText: 'text-[#64748b]',
      washiTape: 'bg-[#f1f5f9]/90 border-[#cbd5e1]',
      washiBgPattern: 'repeating-linear-gradient(45deg, #f1f5f9 0px, #f1f5f9 6px, #ffffff 6px, #ffffff 12px)',
      washiBorder: '1px solid rgba(203, 213, 225, 0.7)',
      synopsisLineColor: 'rgba(148, 163, 184, 0.04)',
      heartIcon: 'text-[#64748b] fill-[#e2e8f0]/60',
      chapterScrollbar: '[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-[#f8fafc] [&::-webkit-scrollbar-thumb]:bg-[#cbd5e1]/60 hover:[&::-webkit-scrollbar-thumb]:bg-[#64748b]/80 [&::-webkit-scrollbar-thumb]:rounded-full [scrollbar-color:rgba(203,213,225,0.6)_transparent] [scrollbar-width:thin]',
      paperClipClass: 'text-[#94a3b8]',
    };
  }

  // 3. SLATE-HAZE / FROST THEME
  if (theme === 'slate-haze') {
    if (isDark) {
      return {
        themeName: 'XANH BĂNG FROST',
        bannerBadge: 'text-[#dce7f0] bg-white/[0.06] backdrop-blur-md border border-white/15 shadow-xs',
        bannerBadgeIcon: 'text-[#8bb0cf] fill-[#4d6a85]/30',
        bannerTitle: 'text-[#f0f5fa] drop-shadow-sm',
        bannerDivider: 'bg-gradient-to-r from-[#3e566d]/80 via-[#4d6a85]/80 to-[#5d7e9d]/80',
        coverBg: 'bg-[#0a121c]/50 backdrop-blur-2xl',
        coverBorder: 'border-[#4d6a85]/35',
        coverShadow: 'shadow-[0_25px_60px_rgba(0,0,0,0.65)]',
        ringsGradient: 'bg-gradient-to-r from-[#4d6a85]/80 via-[#b0c8dc]/70 to-[#5d7e9d]/80',
        ringsBorder: 'border-[#4d6a85]/50',
        holesBg: 'bg-black/60 backdrop-blur-sm',
        holesBorder: 'border-[#4d6a85]/60',
        spineBg: 'bg-[#0f1925]/75 backdrop-blur-lg',
        spineDashedBorder: 'border-[#4d6a85]/40',
        spineShadow: 'shadow-[inset_-2px_0_10px_rgba(0,0,0,0.45)]',
        spineHoleBorder: 'border-[#4d6a85]/30',
        spineHoleBg: 'bg-black/70',
        spineHoleCenterBg: 'bg-[#4d6a85]/40',
        paperBg: 'bg-[#060c13]/55 backdrop-blur-2xl',
        paperBorder: 'border-[#4d6a85]/25',
        paperText: 'text-[#f0f5fa]',
        dashedBorder: 'border-white/[0.08]',
        plannerBadgeBg: 'bg-white/[0.08] backdrop-blur-md',
        plannerBadgeText: 'text-[#dce7f0]',
        plannerBadgeBorder: 'border-transparent',
        dateText: 'text-[#8bb0cf]',
        rulerText: 'text-[#8bb0cf]',
        rulerBg: 'bg-white/[0.04] backdrop-blur-md',
        rulerBorder: 'border-transparent',
        overviewBg: 'bg-white/[0.035] backdrop-blur-xl',
        overviewBorder: 'border-transparent',
        binderClip: 'bg-[#4d6a85] border-[#5d7e9d]',
        statusBadge: 'bg-white/[0.08] backdrop-blur-md text-[#dce7f0] border border-white/15',
        cardInnerBg: 'bg-white/[0.04] backdrop-blur-md',
        cardInnerBorder: 'border-transparent',
        authorEditorBoxBg: 'bg-[#182535]/70',
        iconAccent: 'text-[#8bb0cf]',
        subIconAccent: 'text-[#a6c2d8]',
        tagPill: 'bg-white/[0.05] backdrop-blur-sm text-[#dce7f0] border border-transparent hover:bg-white/[0.1] hover:border-white/15 transition-colors',
        primaryBtn: 'bg-gradient-to-r from-[#3e566d] via-[#4d6a85] to-[#5d7e9d] text-white shadow-md font-bold border border-white/20',
        bookmarkBtn: 'bg-white/[0.06] backdrop-blur-md text-stone-200 border border-white/15 hover:bg-white/[0.12]',
        likeBtn: 'bg-white/[0.06] backdrop-blur-md text-rose-400 border border-white/15 hover:border-rose-500/40',
        synopsisHeaderIcon: 'text-[#8bb0cf]',
        synopsisHeaderText: 'text-[#dce7f0]',
        synopsisBorderLeft: 'border-[#4d6a85]',
        loreBoxBg: 'bg-white/[0.035] backdrop-blur-xl',
        loreBoxBorder: 'border border-[#8bb0cf]/20 border-l-2 border-l-[#8bb0cf]/80',
        loreTitleText: 'text-[#dce7f0]',
        loreIconText: 'text-[#8bb0cf]',
        loreBodyText: 'text-stone-300',
        chaptersHeaderIcon: 'text-[#8bb0cf]',
        chaptersHeaderText: 'text-[#dce7f0]',
        chaptersBadge: 'bg-white/[0.06] backdrop-blur-sm text-[#dce7f0] border-transparent',
        inputBg: 'bg-white/[0.04] backdrop-blur-md',
        inputBorder: 'border-white/15',
        inputFocus: 'focus:border-[#8bb0cf] focus:bg-white/[0.08]',
        inputText: 'text-[#f0f5fa] placeholder-[#8bb0cf]/50',
        chapterCardBg: 'bg-white/[0.035] backdrop-blur-md',
        chapterCardBorder: 'border-transparent',
        chapterCardHoverBorder: 'hover:bg-white/[0.08] hover:border-white/10',
        chapterCardHoverText: 'group-hover:text-[#dce7f0]',
        chapterReadArrow: 'text-[#8bb0cf]',
        extraChapterBadge: 'bg-white/[0.08] backdrop-blur-xs text-[#dce7f0] border-transparent',
        commentsHeaderIcon: 'text-[#8bb0cf]',
        commentsHeaderText: 'text-[#dce7f0]',
        commentsBadge: 'text-stone-400',
        commentFormBg: 'bg-white/[0.035] backdrop-blur-xl',
        commentFormBorder: 'border-transparent',
        commentInputBg: 'bg-white/[0.05] backdrop-blur-md',
        commentInputBorder: 'border-white/15',
        commentBtn: 'bg-gradient-to-r from-[#3e566d] via-[#4d6a85] to-[#5d7e9d] hover:opacity-95 text-white font-bold border border-white/20',
        commentItemBg: 'bg-white/[0.035] backdrop-blur-md',
        commentItemBorder: 'border-transparent',
        commentAvatarBg: 'bg-[#4d6a85] text-white shadow-sm',
        editorNoteBg: 'bg-white/[0.035] backdrop-blur-xl',
        editorNoteBorder: 'border-transparent',
        editorNoteTitle: 'text-[#dce7f0]',
        editorNoteIcon: 'text-[#8bb0cf]',
        relatedHeaderIcon: 'text-[#8bb0cf]',
        relatedHeaderText: 'text-[#dce7f0]',
        relatedCardBg: 'bg-white/[0.035] backdrop-blur-md',
        relatedCardBorder: 'border-transparent',
        relatedCardHoverBorder: 'hover:bg-white/[0.08] hover:border-white/10',
        relatedCardHoverTitle: 'group-hover:text-[#dce7f0]',
        relatedLinkText: 'text-[#8bb0cf]',
        footerBorder: 'border-white/[0.08]',
        footerText: 'text-stone-400',
        washiTape: 'bg-white/[0.08] backdrop-blur-xs border-white/20',
        washiBgPattern: 'repeating-linear-gradient(45deg, #14202c 0px, #14202c 6px, #0b1117 6px, #0b1117 12px)',
        washiBorder: '1px solid rgba(77, 106, 133, 0.3)',
        synopsisLineColor: 'transparent',
        heartIcon: 'text-[#8bb0cf] fill-[#8bb0cf]/40',
        chapterScrollbar: '[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-white/[0.02] [&::-webkit-scrollbar-thumb]:bg-[#4d6a85]/50 hover:[&::-webkit-scrollbar-thumb]:bg-[#5d7e9d]/80 [&::-webkit-scrollbar-thumb]:rounded-full [scrollbar-color:rgba(77,106,133,0.5)_transparent] [scrollbar-width:thin]',
        paperClipClass: 'text-[#486785]',
      };
    }
    // Light mode Frost (Dựa trên theme White, màu trắng chủ đạo, vật thể bên trong hợp theme, nút đọc trầm nhạt hơn)
    return {
      themeName: 'XANH MÂY BABY PASTEL',
      bannerBadge: 'frost-light-novel-tag font-semibold',
      bannerBadgeIcon: 'text-[#526982] fill-[#d7e6f5]',
      bannerTitle: 'text-[#334b66] font-extrabold tracking-tight drop-shadow-xs',
      bannerDivider: 'bg-gradient-to-r from-transparent via-[#b6cde2] to-transparent',
      coverBg: 'bg-white/80 backdrop-blur-2xl',
      coverBorder: 'border-transparent',
      coverShadow: '',
      outerCoverStyle: {
        border: '1px solid transparent',
        background: `
          linear-gradient(135deg, 
            rgba(248, 250, 254, 0.85) 0%, 
            rgba(251, 253, 255, 0.80) 18%, 
            rgba(255, 255, 255, 0.92) 32%, 
            rgba(255, 255, 255, 0.92) 68%, 
            rgba(248, 250, 254, 0.80) 82%, 
            rgba(248, 250, 254, 0.85) 100%
          ) padding-box,
          linear-gradient(to bottom, 
            rgba(155, 180, 205, 0.40) 0%, 
            rgba(130, 160, 188, 0.35) 40%, 
            rgba(105, 138, 168, 0.30) 100%
          ) border-box
        `,
        boxShadow: '4px 4px 14px rgba(145, 170, 195, 0.12), -3px -3px 12px rgba(255, 255, 255, 0.95), inset 0 1px 1px rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
      },
      innerPaperStyle: {
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 1)',
      },
      ringsGradient: 'bg-gradient-to-r from-[#b6cde2] via-[#ffffff] to-[#b6cde2]',
      ringsBorder: 'border-[#98bbdb]',
      holesBg: 'bg-[#d7e6f5]',
      holesBorder: 'border-[#b6cde2]',
      spineBg: 'bg-gradient-to-b from-[#e8f1fa] via-[#dbe8f5] to-[#cee0ef]',
      spineDashedBorder: 'border-[#96b8d9]',
      spineShadow: 'shadow-[inset_-2px_0_10px_rgba(77,106,133,0.12)]',
      spineHoleBorder: 'border-[#96b8d9]',
      spineHoleBg: 'bg-[#f0f6fc]',
      spineHoleCenterBg: 'bg-[#789dbb]',
      paperBg: 'bg-[#ffffff]',
      paperBorder: 'border border-[#d7e6f5]',
      paperText: 'text-[#1e293b]',
      dashedBorder: 'border-[#c6dcee]',
      plannerBadgeBg: 'bg-[#eaf2fd]',
      plannerBadgeText: 'text-[#526982]',
      plannerBadgeBorder: 'border border-[#b6cde2]/70',
      dateText: 'text-[#526982]',
      rulerText: 'text-[#526982]',
      rulerBg: 'bg-[#f8fafc]',
      rulerBorder: 'border-[#c6dcee]',
      overviewBg: 'bg-white/95',
      overviewBorder: 'border border-[#d7e6f5]',
      binderClip: 'bg-gradient-to-r from-[#526982] to-[#7d99b8] border-[#334b66] shadow-md',
      statusBadge: 'bg-[#eaf2fd] text-[#526982] border border-[#b6cde2] shadow-xs font-semibold',
      cardInnerBg: 'bg-white/95',
      cardInnerBorder: 'border border-[#d7e6f5]',
      authorEditorBoxBg: 'bg-[#eaf1f8]',
      iconAccent: 'text-[#526982]',
      subIconAccent: 'text-[#7d99b8]',
      tagPill: 'frost-light-novel-tag font-medium',
      primaryBtn: 'frost-light-btn-active font-bold shadow-xs',
      bookmarkBtn: 'frost-light-btn',
      likeBtn: 'frost-light-btn',
      synopsisHeaderIcon: 'text-[#526982]',
      synopsisHeaderText: 'text-[#334b66] font-bold',
      synopsisBorderLeft: 'border-[#526982]',
      loreBoxBg: 'bg-white/95',
      loreBoxBorder: 'border border-[#d7e6f5]',
      loreTitleText: 'text-[#334b66] font-semibold',
      loreIconText: 'text-[#526982]',
      loreBodyText: 'text-[#475569]',
      chaptersHeaderIcon: 'text-[#526982]',
      chaptersHeaderText: 'text-[#334b66] font-bold',
      chaptersBadge: 'bg-[#eaf2fd] text-[#526982] border border-[#b6cde2] font-semibold',
      inputBg: 'bg-white',
      inputBorder: 'border-[#c6dcee]',
      inputFocus: 'focus:border-[#526982] focus:ring-2 focus:ring-[#526982]/20',
      inputText: 'text-[#1e293b]',
      chapterCardBg: 'bg-[#f0f7fc]/90',
      chapterCardBorder: 'border border-[#c6dcee]',
      chapterCardHoverBorder: 'hover:border-[#526982] hover:shadow-md hover:shadow-[#526982]/10',
      chapterCardHoverText: 'group-hover:text-[#526982]',
      chapterReadArrow: 'text-[#526982]',
      extraChapterBadge: 'bg-[#eaf2fd] text-[#526982] border border-[#b6cde2]',
      commentsHeaderIcon: 'text-[#526982]',
      commentsHeaderText: 'text-[#334b66] font-bold',
      commentsBadge: 'text-[#526982]',
      commentFormBg: 'bg-[#f0f7fc]/90',
      commentFormBorder: 'border border-[#c6dcee]',
      commentInputBg: 'bg-[#e8f1f8]',
      commentInputBorder: 'border-[#bcd3e6]',
      commentBtn: 'frost-light-btn-active font-bold shadow-xs',
      commentItemBg: 'bg-[#f4f8fd]/90',
      commentItemBorder: 'border border-[#d7e6f5]',
      commentAvatarBg: 'bg-gradient-to-br from-[#526982] to-[#7d99b8] text-white font-bold shadow-sm',
      editorNoteBg: 'bg-[#f4f8fd]/90',
      editorNoteBorder: 'border border-[#d7e6f5]',
      editorNoteTitle: 'text-[#334b66] font-semibold',
      editorNoteIcon: 'text-[#526982]',
      relatedHeaderIcon: 'text-[#526982]',
      relatedHeaderText: 'text-[#334b66] font-bold',
      relatedCardBg: 'bg-[#f0f7fc]/90',
      relatedCardBorder: 'border border-[#c6dcee]',
      relatedCardHoverBorder: 'hover:border-[#526982] hover:shadow-md',
      relatedCardHoverTitle: 'group-hover:text-[#526982]',
      relatedLinkText: 'text-[#526982]',
      footerBorder: 'border-[#c6dcee]',
      footerText: 'text-[#64748b]',
      washiTape: 'bg-[#d7e6f5]/80 border border-[#b6cde2]/80 shadow-xs',
      washiBgPattern: 'repeating-linear-gradient(45deg, #eaf2fd 0px, #eaf2fd 6px, #ffffff 6px, #ffffff 12px)',
      washiBorder: '1px solid rgba(182, 205, 226, 0.8)',
      synopsisLineColor: 'rgba(82, 105, 130, 0.04)',
      heartIcon: 'text-[#526982] fill-[#d7e6f5]/60',
      chapterScrollbar: '[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-[#f0f5fa] [&::-webkit-scrollbar-thumb]:bg-[#b6cde2]/70 hover:[&::-webkit-scrollbar-thumb]:bg-[#526982]/80 [&::-webkit-scrollbar-thumb]:rounded-full [scrollbar-color:rgba(182,205,226,0.7)_transparent] [scrollbar-width:thin]',
      paperClipClass: 'text-[#7ca5c9]',
    };
  }

  // 4. SAGE THEME
  if (theme === 'sage') {
    if (isDark) {
      // Chế độ tối Sage: Điều chỉnh màu sắc dịu nhẹ, bớt chói, êm mắt tông thảo mộc
      return {
        themeName: 'XANH SAGE BOTANICAL',
        bannerBadge: 'text-[#d7e6d9] bg-[#152317]/70 border border-[#4d6f53]/30 shadow-xs',
        bannerBadgeIcon: 'text-[#8cb391] fill-[#4d6f53]/30',
        bannerTitle: 'text-[#eaf2eb]',
        bannerDivider: 'bg-gradient-to-r from-[#3e5b43] via-[#4d6f53] to-[#5e8264]',
        coverBg: 'bg-[#0e1711]',
        coverBorder: 'border-[#4d6f53]/30',
        coverShadow: 'shadow-[0_20px_60px_rgba(77,111,83,0.22)]',
        ringsGradient: 'bg-gradient-to-r from-[#4d6f53]/80 via-[#98b89a]/70 to-[#5e8264]/80',
        ringsBorder: 'border-[#4d6f53]/50',
        holesBg: 'bg-[#060c08]',
        holesBorder: 'border-[#4d6f53]/50',
        spineBg: 'bg-[#101b13]/75',
        spineDashedBorder: 'border-[#4d6f53]/40',
        spineShadow: 'shadow-[inset_-2px_0_10px_rgba(0,0,0,0.45)]',
        spineHoleBorder: 'border-[#4d6f53]/40',
        spineHoleBg: 'bg-[#030604]/80',
        spineHoleCenterBg: 'bg-[#4d6f53]/40',
        paperBg: 'bg-[#0a120d]',
        paperBorder: 'border-[#4d6f53]/25',
        paperText: 'text-[#eaf2eb]',
        dashedBorder: 'border-[#4d6f53]/25',
        plannerBadgeBg: 'bg-[#152317]/80',
        plannerBadgeText: 'text-[#d7e6d9]',
        plannerBadgeBorder: 'border-transparent',
        dateText: 'text-[#8cb391]',
        rulerText: 'text-[#8cb391]',
        rulerBg: 'bg-[#152317]/50',
        rulerBorder: 'border-transparent',
        overviewBg: 'bg-[#101b13]',
        overviewBorder: 'border-transparent',
        binderClip: 'bg-[#4d6f53] border-[#5e8264]',
        statusBadge: 'bg-[#152317]/90 text-[#d7e6d9]',
        cardInnerBg: 'bg-[#111c14]',
        cardInnerBorder: 'border-transparent',
        authorEditorBoxBg: 'bg-[#18271b]',
        iconAccent: 'text-[#8cb391]',
        subIconAccent: 'text-[#9db6a1]',
        tagPill: 'bg-[#152317]/60 text-[#d7e6d9] border border-transparent hover:border-[#5e8264]/40 transition-colors',
        primaryBtn: 'bg-gradient-to-r from-[#3e5b43] via-[#4d6f53] to-[#5e8264] text-white shadow-md font-bold',
        bookmarkBtn: 'bg-[#111c14] text-stone-200 border border-[#4d6f53]/30 hover:border-[#5e8264]',
        likeBtn: 'bg-[#111c14] text-rose-400 border border-[#4d6f53]/30 hover:border-rose-600',
        synopsisHeaderIcon: 'text-[#8cb391]',
        synopsisHeaderText: 'text-[#d7e6d9]',
        synopsisBorderLeft: 'border-[#4d6f53]',
        loreBoxBg: 'bg-[#152317]/30',
        loreBoxBorder: 'border border-[#8cb391]/20 border-l-2 border-l-[#8cb391]/80',
        loreTitleText: 'text-[#d7e6d9]',
        loreIconText: 'text-[#8cb391]',
        loreBodyText: 'text-stone-300',
        chaptersHeaderIcon: 'text-[#8cb391]',
        chaptersHeaderText: 'text-[#d7e6d9]',
        chaptersBadge: 'bg-[#152317]/60 text-[#d7e6d9] border-transparent',
        inputBg: 'bg-[#0d160f]',
        inputBorder: 'border-[#4d6f53]/30',
        inputFocus: 'focus:border-[#5e8264]',
        inputText: 'text-[#eaf2eb]',
        chapterCardBg: 'bg-[#111c14]/80',
        chapterCardBorder: 'border-transparent',
        chapterCardHoverBorder: 'hover:bg-[#152317] hover:border-[#5e8264]/40',
        chapterCardHoverText: 'group-hover:text-[#d7e6d9]',
        chapterReadArrow: 'text-[#8cb391]',
        extraChapterBadge: 'bg-[#152317]/70 text-[#d7e6d9] border-transparent',
        commentsHeaderIcon: 'text-[#8cb391]',
        commentsHeaderText: 'text-[#d7e6d9]',
        commentsBadge: 'text-stone-400',
        commentFormBg: 'bg-[#111c14]',
        commentFormBorder: 'border-transparent',
        commentInputBg: 'bg-[#17251b]',
        commentInputBorder: 'border-[#4d6f53]/30',
        commentBtn: 'bg-gradient-to-r from-[#3e5b43] via-[#4d6f53] to-[#5e8264] hover:opacity-95 text-white font-bold',
        commentItemBg: 'bg-[#111c14]/80',
        commentItemBorder: 'border-transparent',
        commentAvatarBg: 'bg-[#4d6f53] text-white',
        editorNoteBg: 'bg-[#152317]/30',
        editorNoteBorder: 'border-transparent',
        editorNoteTitle: 'text-[#d7e6d9]',
        editorNoteIcon: 'text-[#8cb391]',
        relatedHeaderIcon: 'text-[#8cb391]',
        relatedHeaderText: 'text-[#d7e6d9]',
        relatedCardBg: 'bg-[#111c14]',
        relatedCardBorder: 'border-transparent',
        relatedCardHoverBorder: 'hover:bg-[#152317] hover:border-[#5e8264]/40',
        relatedCardHoverTitle: 'group-hover:text-[#d7e6d9]',
        relatedLinkText: 'text-[#8cb391]',
        footerBorder: 'border-[#4d6f53]/25',
        footerText: 'text-stone-400',
        washiTape: 'bg-[#1d3021]/70 border-[#4d6f53]/30',
        washiBgPattern: 'repeating-linear-gradient(45deg, #152317 0px, #152317 6px, #0a110b 6px, #0a110b 12px)',
        washiBorder: '1px solid rgba(77, 111, 83, 0.3)',
        synopsisLineColor: 'transparent',
        heartIcon: 'text-[#8cb391] fill-[#8cb391]/40',
        chapterScrollbar: '[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-[#152317]/20 [&::-webkit-scrollbar-thumb]:bg-[#4d6f53]/50 hover:[&::-webkit-scrollbar-thumb]:bg-[#5e8264]/80 [&::-webkit-scrollbar-thumb]:rounded-full [scrollbar-color:rgba(77,111,83,0.5)_transparent] [scrollbar-width:thin]',
        paperClipClass: 'text-[#47684c]',
      };
    }
    // Light mode Sage (Dựa trên theme White, màu trắng chủ đạo, vật thể bên trong hợp theme, nút đọc trầm nhạt hơn)
    return {
      themeName: 'TRÀ SỮA MATCHA PASTEL',
      bannerBadge: 'sage-light-novel-tag font-semibold',
      bannerBadgeIcon: 'text-[#466244] fill-[#dcf0e0]',
      bannerTitle: 'text-[#233d21] font-extrabold tracking-tight drop-shadow-xs',
      bannerDivider: 'bg-gradient-to-r from-transparent via-[#7ebe92] to-transparent',
      coverBg: 'bg-white/80 backdrop-blur-2xl',
      coverBorder: 'border-transparent',
      coverShadow: '',
      outerCoverStyle: {
        border: '1px solid transparent',
        background: `
          linear-gradient(135deg, 
            rgba(248, 252, 249, 0.85) 0%, 
            rgba(251, 254, 252, 0.80) 18%, 
            rgba(255, 255, 255, 0.92) 32%, 
            rgba(255, 255, 255, 0.92) 68%, 
            rgba(248, 252, 249, 0.80) 82%, 
            rgba(248, 252, 249, 0.85) 100%
          ) padding-box,
          linear-gradient(to bottom, 
            rgba(150, 190, 160, 0.40) 0%, 
            rgba(125, 170, 136, 0.35) 40%, 
            rgba(98, 145, 112, 0.30) 100%
          ) border-box
        `,
        boxShadow: '4px 4px 14px rgba(135, 170, 145, 0.12), -3px -3px 12px rgba(255, 255, 255, 0.95), inset 0 1px 1px rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
      },
      innerPaperStyle: {
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 1)',
      },
      ringsGradient: 'bg-gradient-to-r from-[#9ecbae] via-[#ffffff] to-[#9ecbae]',
      ringsBorder: 'border-[#7ebe92]',
      holesBg: 'bg-[#dcf0e0]',
      holesBorder: 'border-[#9ecbae]',
      spineBg: 'bg-gradient-to-b from-[#eaf6ef] via-[#dcf0e4] to-[#cde7d6]',
      spineDashedBorder: 'border-[#8ec59c]',
      spineShadow: 'shadow-[inset_-2px_0_10px_rgba(77,111,83,0.12)]',
      spineHoleBorder: 'border-[#8ec59c]',
      spineHoleBg: 'bg-[#f2faf4]',
      spineHoleCenterBg: 'bg-[#688865]',
      paperBg: 'bg-[#ffffff]',
      paperBorder: 'border border-[#c8e6c9]',
      paperText: 'text-[#1c2e1f]',
      dashedBorder: 'border-[#c8e6c9]',
      plannerBadgeBg: 'bg-[#e8f5e9]',
      plannerBadgeText: 'text-[#466244]',
      plannerBadgeBorder: 'border border-[#9ecbae]/70',
      dateText: 'text-[#466244]',
      rulerText: 'text-[#466244]',
      rulerBg: 'bg-[#f8fcf9]',
      rulerBorder: 'border-[#c8e6c9]',
      overviewBg: 'bg-white/95',
      overviewBorder: 'border border-[#c8e6c9]',
      binderClip: 'bg-gradient-to-r from-[#466244] to-[#6a8e67] border-[#233d21] shadow-md',
      statusBadge: 'bg-[#e8f5e9] text-[#466244] border border-[#9ecbae] shadow-xs font-semibold',
      cardInnerBg: 'bg-white/95',
      cardInnerBorder: 'border border-[#c8e6c9]',
      authorEditorBoxBg: 'bg-[#eaf3e8]',
      iconAccent: 'text-[#466244]',
      subIconAccent: 'text-[#6a8e67]',
      tagPill: 'sage-light-novel-tag font-medium',
      primaryBtn: 'sage-light-btn-active font-bold shadow-xs',
      bookmarkBtn: 'sage-light-btn',
      likeBtn: 'sage-light-btn',
      synopsisHeaderIcon: 'text-[#466244]',
      synopsisHeaderText: 'text-[#233d21] font-bold',
      synopsisBorderLeft: 'border-[#466244]',
      loreBoxBg: 'bg-white/95',
      loreBoxBorder: 'border border-[#c8e6c9]',
      loreTitleText: 'text-[#233d21] font-semibold',
      loreIconText: 'text-[#466244]',
      loreBodyText: 'text-[#2f4031]',
      chaptersHeaderIcon: 'text-[#466244]',
      chaptersHeaderText: 'text-[#233d21] font-bold',
      chaptersBadge: 'bg-[#e8f5e9] text-[#466244] border border-[#9ecbae] font-semibold',
      inputBg: 'bg-white',
      inputBorder: 'border-[#c8e6c9]',
      inputFocus: 'focus:border-[#466244] focus:ring-2 focus:ring-[#466244]/20',
      inputText: 'text-[#1c2e1f]',
      chapterCardBg: 'bg-[#f2f8f4]/90',
      chapterCardBorder: 'border border-[#c8e6c9]',
      chapterCardHoverBorder: 'hover:border-[#466244] hover:shadow-md hover:shadow-[#466244]/10',
      chapterCardHoverText: 'group-hover:text-[#466244]',
      chapterReadArrow: 'text-[#466244]',
      extraChapterBadge: 'bg-[#e8f5e9] text-[#466244] border border-[#9ecbae]',
      commentsHeaderIcon: 'text-[#466244]',
      commentsHeaderText: 'text-[#233d21] font-bold',
      commentsBadge: 'text-[#466244]',
      commentFormBg: 'bg-[#f2f8f4]/90',
      commentFormBorder: 'border border-[#c8e6c9]',
      commentInputBg: 'bg-[#e8f2ea]',
      commentInputBorder: 'border-[#badcbb]',
      commentBtn: 'sage-light-btn-active font-bold shadow-xs',
      commentItemBg: 'bg-[#f2f8f4]/90',
      commentItemBorder: 'border border-[#c8e6c9]',
      commentAvatarBg: 'bg-gradient-to-br from-[#466244] to-[#6a8e67] text-white font-bold shadow-sm',
      editorNoteBg: 'bg-[#f2f8f4]/90',
      editorNoteBorder: 'border border-[#c8e6c9]',
      editorNoteTitle: 'text-[#233d21] font-semibold',
      editorNoteIcon: 'text-[#466244]',
      relatedHeaderIcon: 'text-[#466244]',
      relatedHeaderText: 'text-[#233d21] font-bold',
      relatedCardBg: 'bg-[#f2f8f4]/90',
      relatedCardBorder: 'border border-[#c8e6c9]',
      relatedCardHoverBorder: 'hover:border-[#466244] hover:shadow-md',
      relatedCardHoverTitle: 'group-hover:text-[#466244]',
      relatedLinkText: 'text-[#466244]',
      footerBorder: 'border-[#c8e6c9]',
      footerText: 'text-[#5f7a62]',
      washiTape: 'bg-[#c8e6c9]/80 border border-[#9ecbae]/80 shadow-xs',
      washiBgPattern: 'repeating-linear-gradient(45deg, #e8f5e9 0px, #e8f5e9 6px, #ffffff 6px, #ffffff 12px)',
      washiBorder: '1px solid rgba(158, 203, 174, 0.8)',
      synopsisLineColor: 'rgba(70, 98, 68, 0.04)',
      heartIcon: 'text-[#466244] fill-[#c8e6c9]/60',
      chapterScrollbar: '[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-[#f1f8f3] [&::-webkit-scrollbar-thumb]:bg-[#9ecbae]/70 hover:[&::-webkit-scrollbar-thumb]:bg-[#466244]/80 [&::-webkit-scrollbar-thumb]:rounded-full [scrollbar-color:rgba(158,203,174,0.7)_transparent] [scrollbar-width:thin]',
      paperClipClass: 'text-[#709c73]',
    };
  }

  // 5. MOCHA / LINEN THEME
  if (theme === 'mocha') {
    if (isDark) {
      // Chế độ tối Linen: Tông màu sợi linen cổ điển trầm ấm, dịu nhẹ, không chói gắt
      return {
        themeName: 'VINTAGE LINEN MOCHA',
        bannerBadge: 'text-[#ebdcd3] bg-[#2a1a14]/70 border border-[#8c6150]/30 shadow-xs',
        bannerBadgeIcon: 'text-[#d4a38c] fill-[#8c6150]/30',
        bannerTitle: 'text-[#f5ece6]',
        bannerDivider: 'bg-gradient-to-r from-[#775243] via-[#8c6150] to-[#9f7260]',
        coverBg: 'bg-[#18120e]',
        coverBorder: 'border-[#8c6150]/30',
        coverShadow: 'shadow-[0_20px_60px_rgba(140,97,80,0.22)]',
        ringsGradient: 'bg-gradient-to-r from-[#8c6150]/80 via-[#d8c2b5]/70 to-[#9f7260]/80',
        ringsBorder: 'border-[#8c6150]/50',
        holesBg: 'bg-[#0e0906]',
        holesBorder: 'border-[#8c6150]/50',
        spineBg: 'bg-[#1c130d]/75',
        spineDashedBorder: 'border-[#8c6150]/40',
        spineShadow: 'shadow-[inset_-2px_0_10px_rgba(0,0,0,0.45)]',
        spineHoleBorder: 'border-[#8c6150]/40',
        spineHoleBg: 'bg-[#070403]/80',
        spineHoleCenterBg: 'bg-[#8c6150]/40',
        paperBg: 'bg-[#130d09]',
        paperBorder: 'border-[#8c6150]/25',
        paperText: 'text-[#f5ece6]',
        dashedBorder: 'border-[#8c6150]/25',
        plannerBadgeBg: 'bg-[#2a1a14]/80',
        plannerBadgeText: 'text-[#ebdcd3]',
        plannerBadgeBorder: 'border-transparent',
        dateText: 'text-[#d4a38c]',
        rulerText: 'text-[#d4a38c]',
        rulerBg: 'bg-[#241712]/50',
        rulerBorder: 'border-transparent',
        overviewBg: 'bg-[#1a120c]',
        overviewBorder: 'border-transparent',
        binderClip: 'bg-[#8c6150] border-[#9f7260]',
        statusBadge: 'bg-[#2a1a14]/90 text-[#ebdcd3]',
        cardInnerBg: 'bg-[#1a120d]',
        cardInnerBorder: 'border-transparent',
        authorEditorBoxBg: 'bg-[#271d16]',
        iconAccent: 'text-[#d4a38c]',
        subIconAccent: 'text-[#c2b0a2]',
        tagPill: 'bg-[#2a1a14]/60 text-[#ebdcd3] border border-transparent hover:border-[#9f7260]/40 transition-colors',
        primaryBtn: 'bg-gradient-to-r from-[#775243] via-[#8c6150] to-[#9f7260] text-white shadow-md font-bold',
        bookmarkBtn: 'bg-[#1a120d] text-stone-200 border border-[#8c6150]/30 hover:border-[#9f7260]',
        likeBtn: 'bg-[#1a120d] text-rose-400 border border-[#8c6150]/30 hover:border-rose-600',
        synopsisHeaderIcon: 'text-[#d4a38c]',
        synopsisHeaderText: 'text-[#ebdcd3]',
        synopsisBorderLeft: 'border-[#8c6150]',
        loreBoxBg: 'bg-[#2a1a14]/30',
        loreBoxBorder: 'border border-[#d4a38c]/20 border-l-2 border-l-[#d4a38c]/80',
        loreTitleText: 'text-[#ebdcd3]',
        loreIconText: 'text-[#d4a38c]',
        loreBodyText: 'text-stone-300',
        chaptersHeaderIcon: 'text-[#d4a38c]',
        chaptersHeaderText: 'text-[#ebdcd3]',
        chaptersBadge: 'bg-[#2a1a14]/60 text-[#ebdcd3] border-transparent',
        inputBg: 'bg-[#160f0b]',
        inputBorder: 'border-[#8c6150]/30',
        inputFocus: 'focus:border-[#9f7260]',
        inputText: 'text-[#f5ece6]',
        chapterCardBg: 'bg-[#1a120d]/80',
        chapterCardBorder: 'border-transparent',
        chapterCardHoverBorder: 'hover:bg-[#221711] hover:border-[#9f7260]/40',
        chapterCardHoverText: 'group-hover:text-[#ebdcd3]',
        chapterReadArrow: 'text-[#d4a38c]',
        extraChapterBadge: 'bg-[#2a1a14]/70 text-[#ebdcd3] border-transparent',
        commentsHeaderIcon: 'text-[#d4a38c]',
        commentsHeaderText: 'text-[#ebdcd3]',
        commentsBadge: 'text-stone-400',
        commentFormBg: 'bg-[#1a120d]',
        commentFormBorder: 'border-transparent',
        commentInputBg: 'bg-[#221711]',
        commentInputBorder: 'border-[#8c6150]/30',
        commentBtn: 'bg-gradient-to-r from-[#775243] via-[#8c6150] to-[#9f7260] hover:opacity-95 text-white font-bold',
        commentItemBg: 'bg-[#1a120d]/80',
        commentItemBorder: 'border-transparent',
        commentAvatarBg: 'bg-[#8c6150] text-white',
        editorNoteBg: 'bg-[#2a1a14]/30',
        editorNoteBorder: 'border-transparent',
        editorNoteTitle: 'text-[#ebdcd3]',
        editorNoteIcon: 'text-[#d4a38c]',
        relatedHeaderIcon: 'text-[#d4a38c]',
        relatedHeaderText: 'text-[#ebdcd3]',
        relatedCardBg: 'bg-[#1a120d]',
        relatedCardBorder: 'border-transparent',
        relatedCardHoverBorder: 'hover:bg-[#221711] hover:border-[#9f7260]/40',
        relatedCardHoverTitle: 'group-hover:text-[#ebdcd3]',
        relatedLinkText: 'text-[#d4a38c]',
        footerBorder: 'border-[#8c6150]/25',
        footerText: 'text-stone-400',
        washiTape: 'bg-[#3a251b]/70 border-[#8c6150]/30',
        washiBgPattern: 'repeating-linear-gradient(45deg, #2a1a14 0px, #2a1a14 6px, #170e0a 6px, #170e0a 12px)',
        washiBorder: '1px solid rgba(140, 97, 80, 0.3)',
        synopsisLineColor: 'transparent',
        heartIcon: 'text-[#d4a38c] fill-[#d4a38c]/40',
        chapterScrollbar: '[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-[#241712]/20 [&::-webkit-scrollbar-thumb]:bg-[#8c6150]/50 hover:[&::-webkit-scrollbar-thumb]:bg-[#9f7260]/80 [&::-webkit-scrollbar-thumb]:rounded-full [scrollbar-color:rgba(140,97,80,0.5)_transparent] [scrollbar-width:thin]',
        paperClipClass: 'text-[#7d5646]',
      };
    }
    // Light mode Linen (Dựa trên theme White, màu trắng chủ đạo, vật thể bên trong hợp theme, nút đọc trầm nhạt hơn)
    return {
      themeName: 'TRÀ SỮA CARAMEL PASTEL',
      bannerBadge: 'mocha-light-novel-tag font-semibold',
      bannerBadgeIcon: 'text-[#7a6256] fill-[#f7ede2]',
      bannerTitle: 'text-[#422917] font-extrabold tracking-tight drop-shadow-xs',
      bannerDivider: 'bg-gradient-to-r from-transparent via-[#caa27e] to-transparent',
      coverBg: 'bg-white/80 backdrop-blur-2xl',
      coverBorder: 'border-transparent',
      coverShadow: '',
      outerCoverStyle: {
        border: '1px solid transparent',
        background: `
          linear-gradient(135deg, 
            rgba(253, 250, 246, 0.85) 0%, 
            rgba(255, 252, 249, 0.80) 18%, 
            rgba(255, 255, 255, 0.92) 32%, 
            rgba(255, 255, 255, 0.92) 68%, 
            rgba(253, 250, 246, 0.80) 82%, 
            rgba(253, 250, 246, 0.85) 100%
          ) padding-box,
          linear-gradient(to bottom, 
            rgba(188, 155, 130, 0.40) 0%, 
            rgba(165, 130, 105, 0.35) 40%, 
            rgba(142, 108, 82, 0.30) 100%
          ) border-box
        `,
        boxShadow: '4px 4px 14px rgba(165, 140, 115, 0.12), -3px -3px 12px rgba(255, 255, 255, 0.95), inset 0 1px 1px rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
      },
      innerPaperStyle: {
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 1)',
      },
      ringsGradient: 'bg-gradient-to-r from-[#caa27e] via-[#ffffff] to-[#caa27e]',
      ringsBorder: 'border-[#b58c67]',
      holesBg: 'bg-[#ecd8c4]',
      holesBorder: 'border-[#caa27e]',
      spineBg: 'bg-gradient-to-b from-[#f2e7db] via-[#e8dbcc] to-[#dccebd]',
      spineDashedBorder: 'border-[#be997c]',
      spineShadow: 'shadow-[inset_-2px_0_10px_rgba(140,97,80,0.12)]',
      spineHoleBorder: 'border-[#be997c]',
      spineHoleBg: 'bg-[#faf5ee]',
      spineHoleCenterBg: 'bg-[#967f73]',
      paperBg: 'bg-[#ffffff]',
      paperBorder: 'border border-[#ecd8c4]',
      paperText: 'text-[#2a1e17]',
      dashedBorder: 'border-[#ecd8c4]',
      plannerBadgeBg: 'bg-[#f7ede2]',
      plannerBadgeText: 'text-[#7a6256]',
      plannerBadgeBorder: 'border border-[#caa27e]/70',
      dateText: 'text-[#7a6256]',
      rulerText: 'text-[#7a6256]',
      rulerBg: 'bg-[#faf7f2]',
      rulerBorder: 'border-[#ecd8c4]',
      overviewBg: 'bg-white/95',
      overviewBorder: 'border border-[#ecd8c4]',
      binderClip: 'bg-gradient-to-r from-[#7a6256] to-[#a37764] border-[#422917] shadow-md',
      statusBadge: 'bg-[#f7ede2] text-[#7a6256] border border-[#caa27e] shadow-xs font-semibold',
      cardInnerBg: 'bg-white/95',
      cardInnerBorder: 'border border-[#ecd8c4]',
      authorEditorBoxBg: 'bg-[#f6eee5]',
      iconAccent: 'text-[#7a6256]',
      subIconAccent: 'text-[#a37764]',
      tagPill: 'mocha-light-novel-tag font-medium',
      primaryBtn: 'mocha-light-btn-active font-bold shadow-xs',
      bookmarkBtn: 'mocha-light-btn',
      likeBtn: 'mocha-light-btn',
      synopsisHeaderIcon: 'text-[#7a6256]',
      synopsisHeaderText: 'text-[#422917] font-bold',
      synopsisBorderLeft: 'border-[#7a6256]',
      loreBoxBg: 'bg-white/95',
      loreBoxBorder: 'border border-[#ecd8c4]',
      loreTitleText: 'text-[#422917] font-semibold',
      loreIconText: 'text-[#7a6256]',
      loreBodyText: 'text-[#3d2c20]',
      chaptersHeaderIcon: 'text-[#7a6256]',
      chaptersHeaderText: 'text-[#422917] font-bold',
      chaptersBadge: 'bg-[#f7ede2] text-[#7a6256] border border-[#caa27e] font-semibold',
      inputBg: 'bg-white',
      inputBorder: 'border-[#ecd8c4]',
      inputFocus: 'focus:border-[#7a6256] focus:ring-2 focus:ring-[#7a6256]/20',
      inputText: 'text-[#2a1e17]',
      chapterCardBg: 'bg-[#fcf7f2]/90',
      chapterCardBorder: 'border border-[#ecd8c4]',
      chapterCardHoverBorder: 'hover:border-[#7a6256] hover:shadow-md hover:shadow-[#7a6256]/10',
      chapterCardHoverText: 'group-hover:text-[#7a6256]',
      chapterReadArrow: 'text-[#7a6256]',
      extraChapterBadge: 'bg-[#f7ede2] text-[#7a6256] border border-[#caa27e]',
      commentsHeaderIcon: 'text-[#7a6256]',
      commentsHeaderText: 'text-[#422917] font-bold',
      commentsBadge: 'text-[#7a6256]',
      commentFormBg: 'bg-[#fcf7f2]/90',
      commentFormBorder: 'border border-[#ecd8c4]',
      commentInputBg: 'bg-[#f5ede3]',
      commentInputBorder: 'border-[#e2cbaf]',
      commentBtn: 'mocha-light-btn-active font-bold shadow-xs',
      commentItemBg: 'bg-[#fcf7f2]/90',
      commentItemBorder: 'border border-[#ecd8c4]',
      commentAvatarBg: 'bg-gradient-to-br from-[#7a6256] to-[#a37764] text-white font-bold shadow-sm',
      editorNoteBg: 'bg-[#fcf7f2]/90',
      editorNoteBorder: 'border border-[#ecd8c4]',
      editorNoteTitle: 'text-[#422917] font-semibold',
      editorNoteIcon: 'text-[#7a6256]',
      relatedHeaderIcon: 'text-[#7a6256]',
      relatedHeaderText: 'text-[#422917] font-bold',
      relatedCardBg: 'bg-[#fcf7f2]/90',
      relatedCardBorder: 'border border-[#ecd8c4]',
      relatedCardHoverBorder: 'hover:border-[#7a6256] hover:shadow-md',
      relatedCardHoverTitle: 'group-hover:text-[#7a6256]',
      relatedLinkText: 'text-[#7a6256]',
      footerBorder: 'border-[#ecd8c4]',
      footerText: 'text-[#7e614d]',
      washiTape: 'bg-[#ecd8c4]/80 border border-[#caa27e]/80 shadow-xs',
      washiBgPattern: 'repeating-linear-gradient(45deg, #f7ede2 0px, #f7ede2 6px, #ffffff 6px, #ffffff 12px)',
      washiBorder: '1px solid rgba(202, 162, 126, 0.8)',
      synopsisLineColor: 'rgba(122, 98, 86, 0.04)',
      heartIcon: 'text-[#7a6256] fill-[#ecd8c4]/60',
      chapterScrollbar: '[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-[#fcf7f0] [&::-webkit-scrollbar-thumb]:bg-[#caa27e]/70 hover:[&::-webkit-scrollbar-thumb]:bg-[#7a6256]/80 [&::-webkit-scrollbar-thumb]:rounded-full [scrollbar-color:rgba(202,162,126,0.7)_transparent] [scrollbar-width:thin]',
      paperClipClass: 'text-[#caa27e]',
    };
  }

  // 6. DEFAULT / AMETHYST-HAZE (Purple)
  if (isDark) {
    return {
      themeName: 'TÍM AMETHYST',
      bannerBadge: 'text-purple-200 bg-white/[0.08] backdrop-blur-xl border border-white/15 shadow-xs',
      bannerBadgeIcon: 'text-purple-300 fill-purple-400/40',
      bannerTitle: 'text-purple-100 drop-shadow-md',
      bannerDivider: 'bg-gradient-to-r from-purple-500/80 via-pink-400/80 to-indigo-400/80',
      coverBg: 'bg-[#130b24]/40 backdrop-blur-2xl',
      coverBorder: 'border-purple-400/20',
      coverShadow: 'shadow-[0_25px_60px_rgba(0,0,0,0.65)]',
      ringsGradient: 'bg-gradient-to-r from-purple-400/80 via-pink-300/80 to-purple-500/80',
      ringsBorder: 'border-purple-400/50',
      holesBg: 'bg-black/50 backdrop-blur-md',
      holesBorder: 'border-purple-400/40',
      spineBg: 'bg-[#150d28]/75 backdrop-blur-xl',
      spineDashedBorder: 'border-purple-400/30',
      spineShadow: 'shadow-[inset_-2px_0_10px_rgba(0,0,0,0.45)]',
      spineHoleBorder: 'border-purple-400/25',
      spineHoleBg: 'bg-black/70',
      spineHoleCenterBg: 'bg-purple-400/35',
      paperBg: 'bg-[#0e071c]/45 backdrop-blur-2xl',
      paperBorder: 'border-white/[0.08]',
      paperText: 'text-purple-100',
      dashedBorder: 'border-white/[0.08]',
      plannerBadgeBg: 'bg-white/[0.08] backdrop-blur-xl',
      plannerBadgeText: 'text-purple-200',
      plannerBadgeBorder: 'border-transparent',
      dateText: 'text-purple-300/80',
      rulerText: 'text-purple-300/80',
      rulerBg: 'bg-white/[0.04] backdrop-blur-xl',
      rulerBorder: 'border-transparent',
      overviewBg: 'bg-white/[0.035] backdrop-blur-2xl',
      overviewBorder: 'border-transparent',
      binderClip: 'bg-purple-500 border-purple-400 shadow-md',
      statusBadge: 'bg-white/[0.08] backdrop-blur-xl text-purple-200 border border-white/15 shadow-xs',
      cardInnerBg: 'bg-white/[0.04] backdrop-blur-xl',
      cardInnerBorder: 'border-transparent',
      authorEditorBoxBg: 'bg-white/[0.06]',
      iconAccent: 'text-purple-300',
      subIconAccent: 'text-pink-300',
      tagPill: 'bg-white/[0.05] backdrop-blur-md text-purple-200 border border-transparent hover:bg-white/[0.1] hover:border-white/15 transition-colors',
      primaryBtn: 'bg-gradient-to-r from-purple-600/90 via-purple-500/90 to-pink-600/90 backdrop-blur-xl text-white shadow-md border border-white/20 hover:border-white/35',
      bookmarkBtn: 'bg-white/[0.06] backdrop-blur-xl text-stone-200 border border-white/15 hover:bg-white/[0.12]',
      likeBtn: 'bg-white/[0.06] backdrop-blur-xl text-rose-300 border border-white/15 hover:border-rose-400/40',
      synopsisHeaderIcon: 'text-purple-300',
      synopsisHeaderText: 'text-purple-200',
      synopsisBorderLeft: 'border-purple-400/80',
      loreBoxBg: 'bg-white/[0.035] backdrop-blur-2xl',
      loreBoxBorder: 'border border-purple-500/20 border-l-2 border-l-purple-400/80',
      loreTitleText: 'text-purple-200',
      loreIconText: 'text-purple-300',
      loreBodyText: 'text-purple-100/90',
      chaptersHeaderIcon: 'text-purple-300',
      chaptersHeaderText: 'text-purple-200',
      chaptersBadge: 'bg-white/[0.06] backdrop-blur-md text-purple-200 border-transparent',
      inputBg: 'bg-white/[0.05] backdrop-blur-xl',
      inputBorder: 'border-white/15',
      inputFocus: 'focus:border-purple-400/80 focus:bg-white/[0.09]',
      inputText: 'text-purple-100 placeholder-purple-300/40',
      chapterCardBg: 'bg-white/[0.035] backdrop-blur-xl',
      chapterCardBorder: 'border-transparent',
      chapterCardHoverBorder: 'hover:bg-white/[0.08] hover:border-white/10',
      chapterCardHoverText: 'group-hover:text-purple-200',
      chapterReadArrow: 'text-purple-300',
      extraChapterBadge: 'bg-purple-500/20 backdrop-blur-md text-purple-200 border-transparent',
      commentsHeaderIcon: 'text-purple-300',
      commentsHeaderText: 'text-purple-200',
      commentsBadge: 'text-purple-300/70',
      commentFormBg: 'bg-white/[0.035] backdrop-blur-2xl',
      commentFormBorder: 'border-transparent',
      commentInputBg: 'bg-white/[0.05] backdrop-blur-xl',
      commentInputBorder: 'border-white/15',
      commentBtn: 'bg-gradient-to-r from-purple-600/90 via-purple-500/90 to-pink-600/90 backdrop-blur-xl hover:opacity-95 text-white shadow-sm border border-white/20',
      commentItemBg: 'bg-white/[0.035] backdrop-blur-xl',
      commentItemBorder: 'border-transparent',
      commentAvatarBg: 'bg-purple-600/80 backdrop-blur-md text-white border border-white/20 shadow-sm',
      editorNoteBg: 'bg-white/[0.035] backdrop-blur-2xl',
      editorNoteBorder: 'border-transparent',
      editorNoteTitle: 'text-purple-300',
      editorNoteIcon: 'text-purple-300',
      relatedHeaderIcon: 'text-purple-300',
      relatedHeaderText: 'text-purple-200',
      relatedCardBg: 'bg-white/[0.035] backdrop-blur-xl',
      relatedCardBorder: 'border-transparent',
      relatedCardHoverBorder: 'hover:bg-white/[0.08] hover:border-white/10',
      relatedCardHoverTitle: 'group-hover:text-purple-200',
      relatedLinkText: 'text-purple-300',
      footerBorder: 'border-white/[0.08]',
      footerText: 'text-purple-300/60',
      washiTape: 'bg-white/[0.12] backdrop-blur-md border-white/20',
      washiBgPattern: 'repeating-linear-gradient(45deg, rgba(192,132,252,0.35) 0px, rgba(192,132,252,0.35) 6px, rgba(255,255,255,0.12) 6px, rgba(255,255,255,0.12) 12px)',
      washiBorder: '1px solid rgba(255, 255, 255, 0.25)',
      synopsisLineColor: 'transparent',
      heartIcon: 'text-purple-300 fill-purple-400/50',
      chapterScrollbar: '[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-white/[0.02] [&::-webkit-scrollbar-thumb]:bg-purple-500/50 hover:[&::-webkit-scrollbar-thumb]:bg-purple-400/80 [&::-webkit-scrollbar-thumb]:rounded-full [scrollbar-color:rgba(168,85,247,0.5)_transparent] [scrollbar-width:thin]',
      paperClipClass: 'text-[#6e5192]',
    };
  }

  // Light mode Amethyst (Dựa trên theme White, màu trắng chủ đạo, vật thể bên trong hợp theme, nút đọc trầm nhạt hơn)
  return {
    themeName: 'TÍM PASTEL OẢI HƯƠNG',
    bannerBadge: 'amethyst-light-novel-tag font-semibold',
    bannerBadgeIcon: 'text-[#6b4e9b] fill-[#ede8f5]',
    bannerTitle: 'text-[#382654] font-extrabold tracking-tight drop-shadow-xs',
    bannerDivider: 'bg-gradient-to-r from-transparent via-[#c4b5fd] to-transparent',
    coverBg: 'bg-white/80 backdrop-blur-2xl',
    coverBorder: 'border-transparent',
    coverShadow: '',
    outerCoverStyle: {
      border: '1px solid transparent',
      background: `
        linear-gradient(135deg, 
          rgba(250, 248, 253, 0.85) 0%, 
          rgba(252, 249, 255, 0.80) 18%, 
          rgba(255, 255, 255, 0.92) 32%, 
          rgba(255, 255, 255, 0.92) 68%, 
          rgba(250, 248, 253, 0.80) 82%, 
          rgba(250, 248, 253, 0.85) 100%
        ) padding-box,
        linear-gradient(to bottom, 
          rgba(182, 160, 218, 0.40) 0%, 
          rgba(162, 135, 204, 0.35) 40%, 
          rgba(140, 110, 188, 0.30) 100%
        ) border-box
      `,
      boxShadow: '4px 4px 14px rgba(160, 140, 185, 0.12), -3px -3px 12px rgba(255, 255, 255, 0.95), inset 0 1px 1px rgba(255, 255, 255, 0.98)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
    },
    innerPaperStyle: {
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 1)',
    },
    ringsGradient: 'bg-gradient-to-r from-[#c4b5fd] via-[#ffffff] to-[#c4b5fd]',
    ringsBorder: 'border-[#a78bfa]',
    holesBg: 'bg-[#ede8f5]',
    holesBorder: 'border-[#c4b5fd]',
    spineBg: 'bg-gradient-to-b from-[#f3ebf9] via-[#eadcf5] to-[#dfceef]',
    spineDashedBorder: 'border-[#baa3de]',
    spineShadow: 'shadow-[inset_-2px_0_10px_rgba(147,95,210,0.12)]',
    spineHoleBorder: 'border-[#baa3de]',
    spineHoleBg: 'bg-[#faf7fd]',
    spineHoleCenterBg: 'bg-[#8b6eb5]',
    paperBg: 'bg-[#ffffff]',
    paperBorder: 'border border-[#dfdae8]',
    paperText: 'text-[#2e1065]',
    dashedBorder: 'border-[#dfdae8]',
    plannerBadgeBg: 'bg-[#f3e8ff]',
    plannerBadgeText: 'text-[#6b4e9b]',
    plannerBadgeBorder: 'border border-[#c4b5fd]/70',
    dateText: 'text-[#6b4e9b]',
    rulerText: 'text-[#6b4e9b]',
    rulerBg: 'bg-[#faf8fd]',
    rulerBorder: 'border-[#dfdae8]',
    overviewBg: 'bg-white/95',
    overviewBorder: 'border border-[#dfdae8]',
    binderClip: 'bg-gradient-to-r from-[#6b4e9b] to-[#8b5cf6] border-[#382654] shadow-md',
    statusBadge: 'bg-[#f3e8ff] text-[#6b4e9b] border border-[#c4b5fd] shadow-xs font-semibold',
    cardInnerBg: 'bg-white/95',
    cardInnerBorder: 'border border-[#dfdae8]',
    authorEditorBoxBg: 'bg-[#f4edf9]',
    iconAccent: 'text-[#6b4e9b]',
    subIconAccent: 'text-[#8b5cf6]',
    tagPill: 'amethyst-light-novel-tag font-medium',
    primaryBtn: 'amethyst-light-btn-active font-bold shadow-xs',
    bookmarkBtn: 'amethyst-light-btn',
    likeBtn: 'amethyst-light-btn',
    synopsisHeaderIcon: 'text-[#6b4e9b]',
    synopsisHeaderText: 'text-[#382654] font-bold',
    synopsisBorderLeft: 'border-[#6b4e9b]',
    loreBoxBg: 'bg-white/95',
    loreBoxBorder: 'border border-[#dfdae8]',
    loreTitleText: 'text-[#382654] font-semibold',
    loreIconText: 'text-[#6b4e9b]',
    loreBodyText: 'text-[#4c1d95]',
    chaptersHeaderIcon: 'text-[#6b4e9b]',
    chaptersHeaderText: 'text-[#382654] font-bold',
    chaptersBadge: 'bg-[#f3e8ff] text-[#6b4e9b] border border-[#c4b5fd] font-semibold',
    inputBg: 'bg-white',
    inputBorder: 'border-[#dfdae8]',
    inputFocus: 'focus:border-[#6b4e9b] focus:ring-2 focus:ring-[#6b4e9b]/20',
    inputText: 'text-[#2e1065]',
    chapterCardBg: 'bg-[#faf7fd]/90',
    chapterCardBorder: 'border border-[#dfdae8]',
    chapterCardHoverBorder: 'hover:border-[#6b4e9b] hover:shadow-md hover:shadow-[#6b4e9b]/10',
    chapterCardHoverText: 'group-hover:text-[#6b4e9b]',
    chapterReadArrow: 'text-[#6b4e9b]',
    extraChapterBadge: 'bg-[#f3e8ff] text-[#6b4e9b] border border-[#c4b5fd]',
    commentsHeaderIcon: 'text-[#6b4e9b]',
    commentsHeaderText: 'text-[#382654] font-bold',
    commentsBadge: 'text-[#6b4e9b]',
    commentFormBg: 'bg-[#faf7fd]/90',
    commentFormBorder: 'border border-[#dfdae8]',
    commentInputBg: 'bg-[#f1ebf8]',
    commentInputBorder: 'border-[#ded7e8]',
    commentBtn: 'amethyst-light-btn-active font-bold shadow-xs',
    commentItemBg: 'bg-[#faf7fd]/90',
    commentItemBorder: 'border border-[#dfdae8]',
    commentAvatarBg: 'bg-gradient-to-br from-[#6b4e9b] to-[#8b5cf6] text-white font-bold shadow-sm',
    editorNoteBg: 'bg-[#faf7fd]/90',
    editorNoteBorder: 'border border-[#dfdae8]',
    editorNoteTitle: 'text-[#382654] font-semibold',
    editorNoteIcon: 'text-[#6b4e9b]',
    relatedHeaderIcon: 'text-[#6b4e9b]',
    relatedHeaderText: 'text-[#382654] font-bold',
    relatedCardBg: 'bg-[#faf7fd]/90',
    relatedCardBorder: 'border border-[#dfdae8]',
    relatedCardHoverBorder: 'hover:border-[#6b4e9b] hover:shadow-md',
    relatedCardHoverTitle: 'group-hover:text-[#6b4e9b]',
    relatedLinkText: 'text-[#6b4e9b]',
    footerBorder: 'border-[#dfdae8]',
    footerText: 'text-[#6b4e9b]/70',
    washiTape: 'bg-[#ede8f5]/80 border border-[#c4b5fd]/80 shadow-xs',
    washiBgPattern: 'repeating-linear-gradient(45deg, #f3e8ff 0px, #f3e8ff 6px, #ffffff 6px, #ffffff 12px)',
    washiBorder: '1px solid rgba(196, 181, 253, 0.8)',
    synopsisLineColor: 'rgba(107, 78, 155, 0.04)',
    heartIcon: 'text-[#6b4e9b] fill-[#ede8f5]/60',
    chapterScrollbar: '[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-[#faf7fd] [&::-webkit-scrollbar-thumb]:bg-[#c4b5fd]/70 hover:[&::-webkit-scrollbar-thumb]:bg-[#6b4e9b]/80 [&::-webkit-scrollbar-thumb]:rounded-full [scrollbar-color:rgba(196,181,253,0.7)_transparent] [scrollbar-width:thin]',
    paperClipClass: 'text-[#a890d3]',
  };
}

/**
 * ==========================================================================
 * HỌA TIẾT NỀN: LƯỚI CARO SỔ CÒNG (PLANNER BINDER GRID)
 * 1. CHẾ ĐỘ SÁNG (Light Mode)
 * ==========================================================================
 * 4 lớp gradient đan chéo tạo thành lưới caro sổ còng đa tầng:
 * - Lớp 1: Đường kẻ dọc 1px ô nhỏ (32px)
 * - Lớp 2: Đường kẻ ngang 1px ô nhỏ (32px)
 * - Lớp 3: Dải kẻ dọc bản dày 16px ô lớn (64px)
 * - Lớp 4: Dải kẻ ngang bản dày 16px ô lớn (64px)
 * - Kích thước bước lặp: ô con 32x32px và ô mẹ 64x64px
 */
export function getSpiralPlannerCaroGridStyle(theme: NovelThemeId): React.CSSProperties {
  switch (theme) {
    case 'notebook': // White: Trắng Tinh Khôi Dịu Nhẹ (không ngả vàng be, viền xám bạc mờ)
      return {
        backgroundColor: '#f8fafc',
        backgroundImage: `
          linear-gradient(90deg, rgba(148, 163, 184, 0.22) 1px, transparent 1px),
          linear-gradient(0deg, rgba(148, 163, 184, 0.22) 1px, transparent 1px),
          linear-gradient(90deg, rgba(203, 213, 225, 0.14) 16px, transparent 16px),
          linear-gradient(0deg, rgba(203, 213, 225, 0.14) 16px, transparent 16px)
        `,
        backgroundSize: '32px 32px, 32px 32px, 64px 64px, 64px 64px',
      };
    case 'slate-haze': // Frost: Xanh Mây Baby Pastel Dịu Mát
      return {
        backgroundColor: '#f4f8fd',
        backgroundImage: `
          linear-gradient(90deg, rgba(147, 197, 253, 0.25) 1px, transparent 1px),
          linear-gradient(0deg, rgba(147, 197, 253, 0.25) 1px, transparent 1px),
          linear-gradient(90deg, rgba(191, 219, 254, 0.16) 16px, transparent 16px),
          linear-gradient(0deg, rgba(191, 219, 254, 0.16) 16px, transparent 16px)
        `,
        backgroundSize: '32px 32px, 32px 32px, 64px 64px, 64px 64px',
      };
    case 'sage': // Sage: Trà Sữa Matcha Pastel Dịu Ngọt
      return {
        backgroundColor: '#f5f9f4',
        backgroundImage: `
          linear-gradient(90deg, rgba(167, 209, 163, 0.26) 1px, transparent 1px),
          linear-gradient(0deg, rgba(167, 209, 163, 0.26) 1px, transparent 1px),
          linear-gradient(90deg, rgba(198, 228, 195, 0.16) 16px, transparent 16px),
          linear-gradient(0deg, rgba(198, 228, 195, 0.16) 16px, transparent 16px)
        `,
        backgroundSize: '32px 32px, 32px 32px, 64px 64px, 64px 64px',
      };
    case 'mocha': // Linen: Trà Sữa Caramel Pastel Dịu Ngọt
      return {
        backgroundColor: '#fbf7f2',
        backgroundImage: `
          linear-gradient(90deg, rgba(214, 185, 160, 0.25) 1px, transparent 1px),
          linear-gradient(0deg, rgba(214, 185, 160, 0.25) 1px, transparent 1px),
          linear-gradient(90deg, rgba(235, 215, 196, 0.16) 16px, transparent 16px),
          linear-gradient(0deg, rgba(235, 215, 196, 0.16) 16px, transparent 16px)
        `,
        backgroundSize: '32px 32px, 32px 32px, 64px 64px, 64px 64px',
      };
    case 'cosmic': // Cosmic: Cực Quang Ngân Hà Pastel
      return {
        backgroundColor: '#fbf7ff',
        backgroundImage: `
          linear-gradient(90deg, rgba(232, 166, 244, 0.24) 1px, transparent 1px),
          linear-gradient(0deg, rgba(180, 166, 244, 0.24) 1px, transparent 1px),
          linear-gradient(90deg, rgba(244, 198, 235, 0.15) 16px, transparent 16px),
          linear-gradient(0deg, rgba(210, 198, 248, 0.15) 16px, transparent 16px)
        `,
        backgroundSize: '32px 32px, 32px 32px, 64px 64px, 64px 64px',
      };
    case 'amethyst-haze': // Purple: Tím Oải Hương / Amethyst Pastel Dịu Ngọt (Đồng bộ chuẩn theme)
    default:
      return {
        backgroundColor: '#faf6fe',
        backgroundImage: `
          linear-gradient(90deg, rgba(186, 147, 230, 0.25) 1px, transparent 1px),
          linear-gradient(0deg, rgba(186, 147, 230, 0.25) 1px, transparent 1px),
          linear-gradient(90deg, rgba(224, 204, 247, 0.18) 16px, transparent 16px),
          linear-gradient(0deg, rgba(224, 204, 247, 0.18) 16px, transparent 16px)
        `,
        backgroundSize: '32px 32px, 32px 32px, 64px 64px, 64px 64px',
      };
  }
}

// Cấu hình các lỗ còng rời:
// - Điện thoại: Tăng thêm số lượng lỗ tròn còng sổ (18 lỗ) phân bố đều khắp chiều dọc
// - Máy tính (md+): Giữ nguyên 14 lỗ (vừa vặn, thanh lịch)
const BINDER_HOLE_CONFIGS = [
  { id: 0, responsive: 'flex' },
  { id: 1, responsive: 'flex' },
  { id: 2, responsive: 'flex' },
  { id: 3, responsive: 'flex md:hidden' },
  { id: 4, responsive: 'flex' },
  { id: 5, responsive: 'flex' },
  { id: 6, responsive: 'flex' },
  { id: 7, responsive: 'flex md:hidden' },
  { id: 8, responsive: 'flex' },
  { id: 9, responsive: 'flex' },
  { id: 10, responsive: 'flex md:hidden' },
  { id: 11, responsive: 'flex' },
  { id: 12, responsive: 'flex' },
  { id: 13, responsive: 'flex' },
  { id: 14, responsive: 'flex md:hidden' },
  { id: 15, responsive: 'flex' },
  { id: 16, responsive: 'flex' },
  { id: 17, responsive: 'flex' },
];

interface SpiralNotebookViewProps {
  novel: Novel;
  effectiveChapters: NovelChapter[];
  comments: NovelComment[];
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  onReadChapter: (chapNum: number) => void;
  onPostComment: (author: string, content: string) => void;
  isDarkEffective?: boolean;
  theme?: NovelThemeId;
  effectiveWorldLore?: string;
  hasLiked?: boolean;
  likeCount?: number;
  onToggleLike?: () => void;
  allNovels?: Novel[];
  onSelectNovel?: (novel: Novel) => void;
  isAdmin?: boolean;
  onDeleteComment?: (comment: NovelComment) => void;
}

export const SpiralNotebookView: React.FC<SpiralNotebookViewProps> = ({
  novel,
  effectiveChapters,
  comments,
  isBookmarked,
  onToggleBookmark,
  onReadChapter,
  onPostComment,
  isDarkEffective = false,
  theme = 'amethyst-haze',
  effectiveWorldLore = '',
  hasLiked = false,
  likeCount = 1280,
  onToggleLike,
  allNovels = [],
  onSelectNovel,
  isAdmin = false,
  onDeleteComment,
}) => {
  const [chapterSearch, setChapterSearch] = useState('');
  const [chapterSortAsc, setChapterSortAsc] = useState(true);
  const [userName, setUserName] = useState('');
  const [newCommentText, setNewCommentText] = useState('');

  // Styles thích ứng theo Màu Giao Diện và Chế độ tối
  const sTheme = useMemo(
    () => getSpiralThemeStyles(theme, isDarkEffective),
    [theme, isDarkEffective]
  );

  // Họa tiết nền lưới caro sổ còng đa tầng (Planner Binder Grid) thích ứng theo từng theme
  const caroGridStyle = useMemo(
    () => getSpiralPlannerCaroGridStyle(theme),
    [theme]
  );

  // Đường kẻ nét liền 1px rất nhạt dưới mỗi hàng chữ mục Giới thiệu (Notebook Solid Lined Paper Pattern)
  const synopsisLineBg = useMemo(() => {
    const lineColor = isDarkEffective
      ? (theme === 'cosmic' || theme === 'amethyst-haze'
          ? 'rgba(192, 132, 252, 0.08)'
          : 'rgba(255, 255, 255, 0.06)')
      : (theme === 'amethyst-haze' || theme === 'cosmic'
          ? 'rgba(147, 51, 234, 0.08)'
          : theme === 'sage'
          ? 'rgba(77, 111, 83, 0.08)'
          : theme === 'mocha'
          ? 'rgba(140, 97, 80, 0.08)'
          : theme === 'slate-haze'
          ? 'rgba(77, 106, 133, 0.08)'
          : 'rgba(113, 113, 122, 0.08)');
    return `url("data:image/svg+xml,%3Csvg width='100' height='34' xmlns='http://www.w3.org/2000/svg'%3E%3Cline x1='0' y1='33.5' x2='100' y2='33.5' stroke='${encodeURIComponent(lineColor)}' stroke-width='1'/%3E%3C/svg%3E")`;
  }, [isDarkEffective, theme]);

  // Lọc và sắp xếp chương
  const filteredChapters = useMemo(() => {
    return effectiveChapters
      .filter((c) => {
        const query = chapterSearch.toLowerCase().trim();
        if (!query) return true;
        return (
          c.title.toLowerCase().includes(query) ||
          c.chapterNumber.toString().includes(query)
        );
      })
      .sort((a, b) =>
        chapterSortAsc
          ? a.chapterNumber - b.chapterNumber
          : b.chapterNumber - a.chapterNumber
      );
  }, [effectiveChapters, chapterSearch, chapterSortAsc]);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) {
      alert('Vui lòng nhập tên của bạn trước khi gửi bình luận.');
      return;
    }
    if (!newCommentText.trim()) return;
    onPostComment(userName.trim(), newCommentText.trim());
    setNewCommentText('');
  };

  // Editor mặc định theo chỉ thị dự án: "Jouriee65"
  const editorName = novel.translator || 'Jouriee65';

  // Lọc truyện cùng thể loại để hiển thị ở mục gợi ý cuối trang
  const relatedNovels = useMemo(() => {
    if (!allNovels || allNovels.length <= 1) return [];
    return allNovels
      .filter((n) => n.id !== novel.id)
      .slice(0, 3);
  }, [allNovels, novel.id]);

  const latestChapterMeta = effectiveChapters[effectiveChapters.length - 1];

  return (
    <div className="w-full max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto flex flex-col items-center px-1 sm:px-4 font-source-sans relative z-10">
      {/* ==========================================================================
          HỌA TIẾT NỀN: LƯỚI CARO SỔ CÒNG (PLANNER BINDER GRID)
          1. CHẾ ĐỘ SÁNG (Light Mode)
          ========================================================================== */}
      {!isDarkEffective && (
        <div
          id="spiral-notebook-caro-bg"
          className="fixed inset-0 pointer-events-none -z-10 transition-all duration-500"
          style={caroGridStyle}
          aria-hidden="true"
        />
      )}

      {/* Tiêu đề trang trí trên đầu cuốn sổ */}
      <div className="text-center mb-6 space-y-1.5 px-3 sm:px-0">
        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-source-sans font-bold tracking-wider border shadow-xs transition-colors duration-300 ${sTheme.bannerBadge}`}>
          <Heart className={`w-3.5 h-3.5 ${sTheme.heartIcon}`} />
          <span>TRUYỆN ĐAM MỸ</span>
          <Heart className={`w-3.5 h-3.5 ${sTheme.heartIcon}`} />
        </div>
        <h2 className={`text-2xl sm:text-3xl font-serif tracking-wide font-black transition-colors duration-300 ${sTheme.bannerTitle}`}>
          {novel.title}
        </h2>
        <div className={`w-20 h-[2px] ${sTheme.bannerDivider} mx-auto mt-2 rounded-full transition-all duration-300`} />
      </div>

      {/* ================= TOÀN BỘ CUỐN SỔ CÒNG RỜI ================= */}
      <div className="w-full relative">
        {/* BÌA CỨNG NGOÀI (SOFT HARDCOVER): GÁY CÒNG BỌC HẾT CẢ CHIỀU DÀI & CHIỀU RỘNG MÉP */}
        <div
          className={`w-full relative rounded-3xl sm:rounded-[36px] ${sTheme.coverBg} ${sTheme.coverShadow} border ${sTheme.coverBorder} transition-all duration-300 overflow-hidden flex flex-row items-stretch`}
          style={!isDarkEffective && sTheme.outerCoverStyle ? sTheme.outerCoverStyle : undefined}
        >
          {/* Lớp phản chiếu ánh sáng kính trong chế độ tối (Glassmorphism Specular Sheen) */}
          {isDarkEffective && (
            <div
              className="absolute inset-0 rounded-3xl sm:rounded-[36px] pointer-events-none bg-gradient-to-br from-white/[0.08] via-transparent to-white/[0.02]"
              aria-hidden="true"
            />
          )}

          {/* GÁY CÒNG BỌC HẾT CẢ CHIỀU DÀI & CHIỀU RỘNG MÉP TRÁI */}
          <div 
            className={`w-8 sm:w-13 md:w-16 shrink-0 relative flex flex-col justify-around items-center py-6 sm:py-12 md:py-16 ${sTheme.spineBg} border-r border-dashed ${sTheme.spineDashedBorder} transition-colors ${sTheme.spineShadow} select-none z-20`}
          >
            {/* CÁC LỖ ĐỤC CÒNG RỜI (PUNCHED HOLES) - TĂNG SỐ LƯỢNG LINH HOẠT THEO MÀN HÌNH */}
            {BINDER_HOLE_CONFIGS.map((hole) => (
              <div
                key={hole.id}
                className={`w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 rounded-full border ${sTheme.spineHoleBorder} ${sTheme.spineHoleBg} shadow-[inset_0_2px_5px_rgba(0,0,0,0.14)] items-center justify-center relative group ${hole.responsive}`}
                title="Lỗ còng rời sổ tay"
              >
                {/* Vòng tròn tạo hiệu ứng độ sâu khoét lõm 3D ở tâm lỗ */}
                <div className={`w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 rounded-full ${sTheme.spineHoleCenterBg} shadow-inner`} />
              </div>
            ))}
          </div>

          {/* KHUNG BỌC TRANG GIẤY RUỘT TRONG CUỐN SỔ */}
          <div className="flex-1 min-w-0 p-2 sm:p-5 md:p-7 pl-1.5 sm:pl-3 md:pl-4 flex flex-col justify-between relative z-10">
            <div
              className={`w-full flex-1 rounded-2xl sm:rounded-[26px] ${sTheme.paperBg} ${sTheme.paperText} border ${sTheme.paperBorder} shadow-inner p-3.5 sm:p-7 md:p-9 flex flex-col justify-between overflow-hidden transition-colors duration-300`}
              style={!isDarkEffective && sTheme.innerPaperStyle ? sTheme.innerPaperStyle : undefined}
            >
              <div className="space-y-6">
              
              {/* HEADER SỔ: Nhãn Planner */}
              <div className={`flex items-center justify-between gap-3 border-b border-dashed ${sTheme.dashedBorder} pb-4 transition-colors duration-300`}>
                <div className="flex items-center gap-3">
                  <div className={`px-3 py-1 rounded-full ${sTheme.plannerBadgeBg} ${sTheme.plannerBadgeText} font-source-sans text-xs sm:text-[13px] font-black tracking-wider uppercase border ${sTheme.plannerBadgeBorder} flex items-center gap-1.5 transition-colors`}>
                    <Heart className={`w-3.5 h-3.5 ${sTheme.heartIcon}`} />
                    <span>PLANNER #{novel.id.slice(0, 6).toUpperCase()}</span>
                  </div>
                </div>
              </div>

              {/* KHỐI TỔNG QUAN: Bìa dạng Polaroid phong cách sổ tay & Thông tin tác phẩm */}
              <div className={`grid grid-cols-1 md:grid-cols-12 gap-5 p-4 sm:p-5 rounded-2xl ${sTheme.overviewBg} border ${sTheme.overviewBorder} shadow-xs transition-colors duration-300`}>
                {/* Bìa truyện kiểu sổ tay (Polaroid washi tape theo từng theme) */}
                <div className="md:col-span-4 lg:col-span-3 flex flex-col items-center">
                  <div
                    className={`relative w-full max-w-[190px] sm:max-w-[210px] p-2.5 sm:p-3 rounded-2xl border shadow-md transition-transform hover:-rotate-1 ${
                      isDarkEffective
                        ? 'bg-white/[0.06] backdrop-blur-xl border-white/15 shadow-[0_12px_32px_rgba(0,0,0,0.4)]'
                        : `bg-white ${sTheme.cardInnerBorder} shadow-[0_8px_24px_rgba(0,0,0,0.04)]`
                    }`}
                  >
                    {/* Trang trí kẹp giấy (Paper Clip) nằm ở bên phải cho cả chế độ sáng & tối */}
                    <div
                      className="absolute -top-3.5 sm:-top-4.5 right-3.5 sm:right-4.5 z-20 pointer-events-none select-none transform rotate-[8deg]"
                      title="Kẹp giấy"
                    >
                      <svg
                        width="26"
                        height="48"
                        viewBox="0 0 28 54"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="filter drop-shadow-[0_2px_3.5px_rgba(0,0,0,0.18)]"
                      >
                        {/* Đường nét chính của Kẹp giấy kim loại chuẩn kiểu dáng kinh điển (không có viền trắng bên trong) */}
                        <path
                          d="M 10 20 V 39 A 4 4 0 0 0 18 39 V 11 A 6 6 0 0 0 6 11 V 44 A 8 8 0 0 0 22 44 V 17"
                          stroke="currentColor"
                          strokeWidth="2.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className={sTheme.paperClipClass || (isDarkEffective ? 'text-purple-300' : 'text-slate-400')}
                        />
                      </svg>
                    </div>

                    <div className="aspect-[3/4.2] w-full rounded-xl overflow-hidden bg-stone-100 dark:bg-black/30 backdrop-blur-xs relative group">
                      <img
                        src={getDirectImageUrl(novel.coverImage, novel.id || novel.title)}
                        alt={novel.title}
                        onError={(e) => handleCoverImageError(e, novel.id || novel.title)}
                        className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  </div>
                </div>

                {/* Thông tin tên, tác giả, editor, thể loại, nút bấm */}
                <div className="md:col-span-8 lg:col-span-9 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    <h3 className={`text-xl sm:text-2xl font-serif font-black tracking-tight ${sTheme.paperText}`}>
                      {novel.title}
                    </h3>

                    {/* Tác giả & Editor */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-[13px] sm:text-[15px] font-source-sans">
                      <div className={`flex items-start gap-1.5 p-2.5 rounded-xl ${sTheme.authorEditorBoxBg} shadow-2xs transition-colors`}>
                        <span className="opacity-70 shrink-0">Tác giả:</span>
                        <strong className="break-words leading-snug">{novel.author.name}</strong>
                      </div>

                      <div className={`flex items-start gap-1.5 p-2.5 rounded-xl ${sTheme.authorEditorBoxBg} shadow-2xs transition-colors`}>
                        <span className="opacity-70 shrink-0">Editor:</span>
                        <strong className="break-words leading-snug">{editorName}</strong>
                      </div>
                    </div>

                    {/* Thể loại tag */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {novel.genres.map((g) => (
                        <span
                          key={g}
                          className={`px-3 py-1 rounded-full text-xs sm:text-[13px] font-semibold border shadow-2xs transition-colors ${sTheme.tagPill}`}
                        >
                          #{g}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Nút hành động */}
                  <div className={`flex flex-wrap items-center gap-2.5 pt-2 border-t ${sTheme.dashedBorder}`}>
                    <button
                      type="button"
                      onClick={() => onReadChapter(1)}
                      className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black ${sTheme.primaryBtn} hover:opacity-95 cursor-pointer shadow-md flex items-center gap-2 active:scale-95 transition-all`}
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>Đọc Chương 1</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* NỘI DUNG LIÊN TỤC TRONG SỔ (KHÔNG CẦN TAB NGOÀI) */}
              <div className="pt-2 space-y-8">
                {/* 1. GIỚI THIỆU & THIẾT LẬP NHÂN VẬT */}
                <div className="space-y-4">
                  <div className={`flex items-center justify-between border-b border-solid ${sTheme.dashedBorder} pb-2 opacity-80`}>
                    <span className={`text-xs sm:text-[13px] font-mono font-black uppercase tracking-widest ${sTheme.synopsisHeaderText} flex items-center gap-1.5`}>
                      <FileText className={`w-4 h-4 ${sTheme.synopsisHeaderIcon}`} />
                      <span>GIỚI THIỆU</span>
                    </span>
                    <span className="text-[10px] sm:text-[11px] font-mono opacity-60">{effectiveChapters.length} chương</span>
                  </div>

                  <div className="space-y-4 text-[16px] sm:text-[18px]">
                    {(novel.synopsis || '').split('\n\n').map((para, idx) => (
                      <p
                        key={idx}
                        className="tracking-normal whitespace-pre-line"
                        style={{
                          lineHeight: '34px',
                          backgroundImage: synopsisLineBg,
                          backgroundRepeat: 'repeat',
                          backgroundPosition: '0 0',
                        }}
                      >
                        {para.trim()}
                      </p>
                    ))}
                  </div>

                  {/* Thiết lập nhân vật: Nền sạch đẹp không có họa tiết đường kẻ theo chỉ thị người dùng */}
                  {(effectiveWorldLore || novel.worldLore) && (
                    <div className="relative">
                      {/* Ngôi sao 5 cánh trang trí trên khung viền của mục (nằm bên phải, màu hợp theme) */}
                      <div 
                        className={`absolute -top-2.5 sm:-top-3 right-4 sm:right-6 z-20 pointer-events-none select-none flex items-center gap-1.5 px-1.5 py-0.5 rounded-md ${sTheme.paperBg}`}
                        title="Ngôi sao trang trí"
                      >
                        <Star 
                          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${sTheme.loreIconText} fill-current drop-shadow-xs transform -rotate-12`} 
                        />
                        <Star 
                          className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${sTheme.loreIconText} fill-current opacity-80 drop-shadow-2xs transform rotate-12`} 
                        />
                      </div>

                      <div 
                        className={`p-4 sm:p-5 rounded-xl ${sTheme.loreBoxBg} border ${sTheme.loreBoxBorder} space-y-2 transition-colors duration-300 relative overflow-hidden`}
                      >
                        <span className={`text-xs sm:text-[13px] font-bold ${sTheme.loreTitleText} block relative z-10`}>
                          <span>Thiết lập nhân vật:</span>
                        </span>
                        <p className={`text-[15px] sm:text-[16px] ${sTheme.loreBodyText} leading-relaxed whitespace-pre-line relative z-10`}>
                          {effectiveWorldLore || novel.worldLore}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. MỤC LỤC */}
                <div className={`space-y-4 pt-4 border-t border-dashed ${sTheme.dashedBorder}`}>
                  <div className={`flex items-center justify-between border-b border-dashed ${sTheme.dashedBorder} pb-2`}>
                    <span className={`text-xs sm:text-[13px] font-mono font-black uppercase tracking-widest ${sTheme.chaptersHeaderText} flex items-center gap-1.5`}>
                      <ListOrdered className={`w-4 h-4 ${sTheme.chaptersHeaderIcon}`} />
                      <span>MỤC LỤC</span>
                    </span>
                  </div>

                  {/* Thanh tìm kiếm và sắp xếp */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="relative flex-1 w-full">
                      <Search className="w-4 h-4 opacity-40 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={chapterSearch}
                        onChange={(e) => setChapterSearch(e.target.value)}
                        placeholder="Tra cứu chương trong sổ..."
                        className={`w-full pl-9 pr-3 py-2 text-[13px] sm:text-sm ${sTheme.inputBg} border ${sTheme.inputBorder} ${sTheme.inputText} rounded-xl focus:outline-hidden ${sTheme.inputFocus} transition-colors`}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setChapterSortAsc(!chapterSortAsc)}
                      className={`py-1 px-2.5 rounded-lg ${sTheme.cardInnerBg} border ${sTheme.cardInnerBorder} cursor-pointer hover:opacity-80 transition-colors flex items-center gap-1 text-[11px] font-mono`}
                      title="Đảo chiều sắp xếp"
                    >
                      <ArrowUpDown className="w-3.5 h-3.5" />
                      <span>{chapterSortAsc ? 'Cũ nhất' : 'Mới nhất'}</span>
                    </button>
                  </div>

                  {/* Lưới danh sách chương (đã bỏ đếm số chữ trong chương) */}
                  <div className={`grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-[500px] overflow-y-auto pr-1.5 ${sTheme.chapterScrollbar}`}>
                    {filteredChapters.map((chap) => {
                      const displayParts = getChapterDisplayParts(chap);
                      return (
                        <div
                          key={chap.id}
                          onClick={() => onReadChapter(chap.chapterNumber)}
                          className={`p-3 rounded-xl ${sTheme.chapterCardBg} border ${sTheme.chapterCardBorder} ${sTheme.chapterCardHoverBorder} cursor-pointer flex items-center justify-between group transition-all shadow-2xs hover:shadow-xs`}
                        >
                          <div className="space-y-0.5 min-w-0 pr-2">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className={`text-[15px] sm:text-[17px] font-bold ${sTheme.chapterCardHoverText} truncate block transition-colors`}>
                                {displayParts.chapterLabel} {displayParts.restTitle ? `• ${displayParts.restTitle}` : ''}
                              </span>
                              {displayParts.isExtra && (
                                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold border ${sTheme.extraChapterBadge}`}>
                                  Ngoại truyện
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-mono opacity-60">
                              <span>{chap.publishedAt || 'Đầy đủ'}</span>
                            </div>
                          </div>
                          <span className={`text-xs sm:text-[13px] font-bold ${sTheme.chapterReadArrow} group-hover:translate-x-1 transition-transform shrink-0`}>
                            Đọc →
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. BÌNH LUẬN */}
                <div className={`space-y-4 pt-4 border-t border-dashed ${sTheme.dashedBorder}`}>
                  <div className={`flex items-center justify-between border-b border-dashed ${sTheme.dashedBorder} pb-2`}>
                    <span className={`text-xs sm:text-[13px] font-mono font-black uppercase tracking-widest ${sTheme.commentsHeaderText} flex items-center gap-1.5`}>
                      <MessageSquare className={`w-4 h-4 ${sTheme.commentsHeaderIcon}`} />
                      <span>BÌNH LUẬN</span>
                    </span>
                    <span className={`text-[10px] font-mono ${sTheme.commentsBadge}`}>GHI CHÚ DÁN TRONG SỔ</span>
                  </div>

                  {/* Form viết bình luận */}
                  <form id="spiral-comment-form" onSubmit={handleSubmitComment} className={`p-4 sm:p-5 rounded-2xl ${sTheme.commentFormBg} border ${sTheme.commentFormBorder} space-y-3 shadow-2xs transition-colors`}>
                    <span className={`text-xs sm:text-[13px] font-mono font-black tracking-wider uppercase ${sTheme.commentsHeaderText} block`}>
                      ĐỂ LẠI GHI CHÚ BÌNH LUẬN TRONG SỔ:
                    </span>
                    <input
                      type="text"
                      required
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Tên của bạn (Bắt buộc)..."
                      className={`w-full sm:w-64 px-3 py-1.5 text-xs sm:text-sm ${sTheme.commentInputBg} border ${sTheme.commentInputBorder} ${sTheme.inputText} rounded-lg focus:outline-hidden ${sTheme.inputFocus} transition-colors`}
                    />
                    <textarea
                      rows={2}
                      required
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      placeholder="Cảm xúc, nhận xét về truyện..."
                      className={`w-full px-3 py-2 text-[13px] sm:text-sm ${sTheme.commentInputBg} border ${sTheme.commentInputBorder} ${sTheme.inputText} rounded-lg resize-none focus:outline-hidden ${sTheme.inputFocus} transition-colors`}
                    />
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className={`px-4 py-1.5 rounded-lg text-xs sm:text-sm font-bold ${sTheme.commentBtn} cursor-pointer flex items-center gap-1.5 shadow-sm transition-colors`}
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Lưu Bình Luận</span>
                      </button>
                    </div>
                  </form>

                  {/* Danh sách bình luận */}
                  <div className="space-y-2.5 max-h-[400px] overflow-y-auto pr-1">
                    {comments.length === 0 ? (
                      <div className={`p-4 text-center text-xs sm:text-[13px] ${isDarkEffective ? 'text-purple-200/70 bg-white/[0.03] backdrop-blur-md border border-dashed border-white/[0.08]' : 'opacity-60 border border-dashed'} font-source-sans italic rounded-xl ${!isDarkEffective ? sTheme.dashedBorder : ''}`}>
                        Chưa có ghi chép bình luận nào. Hãy là người đầu tiên để lại cảm nhận trong sổ nhé!
                      </div>
                    ) : (
                      comments.map((cm) => (
                        <div key={cm.id} className={`p-3.5 rounded-xl ${sTheme.commentItemBg} border ${sTheme.commentItemBorder} space-y-1.5 shadow-2xs transition-colors`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {cm.avatar && (cm.avatar.startsWith('http://') || cm.avatar.startsWith('https://')) ? (
                                <img
                                  src={cm.avatar}
                                  alt={cm.author}
                                  className={`w-7 h-7 rounded-full border ${sTheme.commentItemBorder} object-cover`}
                                />
                              ) : (
                                <div className={`w-7 h-7 rounded-full ${sTheme.commentAvatarBg} font-bold flex items-center justify-center text-xs shadow-xs`}>
                                  {(cm.author?.trim().charAt(0) || 'Đ').toUpperCase()}
                                </div>
                              )}
                              <strong className={`text-xs sm:text-sm font-bold ${sTheme.paperText}`}>{cm.author}</strong>
                              {typeof cm.chapterNumber === 'number' && (
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${getCommentChapterBadgeStyle(theme, isDarkEffective)}`}>
                                  Chương {cm.chapterNumber}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono opacity-60">{normalizeCommentDate(cm.createdAt)}</span>
                              {isAdmin && onDeleteComment && (
                                <button
                                  type="button"
                                  onClick={() => onDeleteComment(cm)}
                                  className="p-1 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/15 transition-colors cursor-pointer"
                                  title="Xóa bình luận này (Quản trị viên)"
                                  aria-label="Xóa bình luận"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                          <p className="text-[13px] sm:text-sm opacity-90 leading-relaxed pl-9">
                            {cm.content}
                          </p>
                          <div className="pl-9 pt-1">
                            <button
                              type="button"
                              onClick={() => {
                                const mention = `@${cm.author} `;
                                if (!newCommentText.includes(mention)) {
                                  setNewCommentText((prev) => `${mention}${prev}`);
                                }
                                const formEl = document.getElementById('spiral-comment-form');
                                formEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                              }}
                              className={`flex items-center gap-1.5 text-xs font-semibold cursor-pointer opacity-75 hover:opacity-100 transition-opacity ${sTheme.paperText}`}
                            >
                              <Reply className="w-3 h-3" />
                              <span>Trả lời</span>
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* 4. HỒ SƠ EDITOR - LƯU Ý */}
                <div className={`pt-4 border-t border-dashed ${sTheme.dashedBorder}`}>
                  <div className={`p-5 rounded-2xl ${sTheme.editorNoteBg} border ${sTheme.editorNoteBorder} space-y-2 transition-colors duration-300`}>
                    <span className={`text-xs sm:text-[13px] font-mono font-bold ${sTheme.editorNoteTitle} block uppercase`}>
                      <span>LƯU Ý</span>
                    </span>
                    <p className="text-[15px] sm:text-[16px] opacity-90 leading-relaxed">
                      {novel.uploaderNote ||
                        'Truyện được edit phi thương mại phục vụ sở thích đọc sách, xin đừng mang đi nơi khác. Chúc bạn có một hành trình đọc sách thật an yên!'}
                    </p>
                  </div>
                </div>

                {/* 5. GỢI Ý TRUYỆN CÙNG THỂ LOẠI */}
                {relatedNovels.length > 0 && onSelectNovel && (
                  <div className={`pt-4 border-t border-dashed ${sTheme.dashedBorder} space-y-3`}>
                    <span className={`text-xs sm:text-[13px] font-mono font-black uppercase tracking-widest ${sTheme.relatedHeaderText} block`}>
                      <span>TRUYỆN GỢI Ý THAM KHẢO</span>
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {relatedNovels.map((rel) => (
                        <div
                          key={rel.id}
                          onClick={() => onSelectNovel(rel)}
                          className={`p-3 rounded-xl ${sTheme.relatedCardBg} border ${sTheme.relatedCardBorder} ${sTheme.relatedCardHoverBorder} cursor-pointer transition-all flex items-center gap-3 shadow-2xs hover:shadow-xs group`}
                        >
                          <img
                            src={getDirectImageUrl(rel.coverImage, rel.id || rel.title)}
                            alt={rel.title}
                            onError={(e) => handleCoverImageError(e, rel.id || rel.title)}
                            className={`w-12 h-16 object-cover rounded-lg shrink-0 border ${sTheme.cardInnerBorder}`}
                          />
                          <div className="min-w-0 flex-1 space-y-1">
                            <h4 className={`text-[13px] sm:text-sm font-bold ${sTheme.relatedCardHoverTitle} truncate transition-colors`}>
                              {rel.title}
                            </h4>
                            <p className="text-xs opacity-60 truncate">{rel.author?.name || 'Tác giả'}</p>
                            <span className={`text-[9.5px] sm:text-[10px] font-mono ${sTheme.relatedLinkText} block`}>Xem chi tiết →</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* CHÂN TRANG SỔ TAY */}
            <div className={`pt-6 mt-8 border-t ${sTheme.footerBorder} flex items-center justify-between text-[11px] font-mono ${sTheme.footerText}`}>
              <span>SỔ TAY ĐIỆN TỬ</span>
              <span>TRANG 01 / 01</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};
