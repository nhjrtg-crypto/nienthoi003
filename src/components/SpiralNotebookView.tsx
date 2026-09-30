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
  ThumbsUp,
  Tag,
  CheckCircle2,
} from 'lucide-react';
import { Novel, NovelChapter, NovelComment } from '../types';
import { getDirectImageUrl, handleCoverImageError } from '../utils/imageUtils';
import { NovelThemeId, getChapterDisplayParts } from '../utils/themeStyles';
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
  ringsGradient: string;
  ringsBorder: string;
  holesBg: string;
  holesBorder: string;
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
  heartIcon: string;
  chapterScrollbar: string;
}

function getSpiralThemeStyles(theme: NovelThemeId, isDark: boolean): SpiralThemeStyles {
  // 1. COSMIC THEME
  if (theme === 'cosmic') {
    if (!isDark) {
      // Light mode Cosmic (Cực Quang Ngân Hà Pastel Dịu Ngọt)
      return {
        themeName: 'CỰC QUANG NGÂN HÀ PASTEL',
        bannerBadge: 'text-[#5d3f82] bg-[#f5effd] border-[#e2d2f7] shadow-xs',
        bannerBadgeIcon: 'text-[#8f66be] fill-[#e8d7fa]',
        bannerTitle: 'text-[#32234b]',
        bannerDivider: 'bg-gradient-to-r from-[#dfcef5] via-[#caa4ec] to-[#f4c8e3]',
        coverBg: 'bg-[#f7f2fd]',
        coverBorder: 'border-[#e5d5f6]',
        coverShadow: 'shadow-[0_16px_45px_rgba(175,130,225,0.13)]',
        ringsGradient: 'bg-gradient-to-r from-[#d9c4f0] via-[#fbf7ff] to-[#f0c8e4]',
        ringsBorder: 'border-[#caa7e8]',
        holesBg: 'bg-[#ecdcf7]',
        holesBorder: 'border-[#d8c4ee]',
        paperBg: 'bg-[#ffffff]',
        paperBorder: 'border-[#ebdbf7]',
        paperText: 'text-[#32234b]',
        dashedBorder: 'border-[#e5d5f5]',
        plannerBadgeBg: 'bg-[#f1e4fb]',
        plannerBadgeText: 'text-[#5e3887]',
        plannerBadgeBorder: 'border-[#ddcaf2]',
        dateText: 'text-[#7e56aa]',
        rulerText: 'text-[#926bbd]',
        rulerBg: 'bg-[#f9f3fe]',
        rulerBorder: 'border-[#e9daf7]',
        overviewBg: 'bg-[#fcf8ff]',
        overviewBorder: 'border-[#eadbf7]',
        binderClip: 'bg-[#b18ad8] border-[#9d73c7]',
        statusBadge: 'bg-[#ede0f9] text-[#4f2f79] border border-[#d9c2f0]',
        cardInnerBg: 'bg-[#faf5fe]',
        cardInnerBorder: 'border-[#ebddf7]',
        iconAccent: 'text-[#8557b6]',
        subIconAccent: 'text-[#aa7ad9]',
        tagPill: 'bg-[#f6edfd] text-[#55327f] border-[#e2cefa] hover:border-[#caa4ec]',
        primaryBtn: 'bg-gradient-to-r from-[#bfa2e4] to-[#f0bfe1] hover:opacity-95 text-[#2a1345] font-black shadow-md shadow-[#bfa2e4]/25',
        bookmarkBtn: 'bg-white text-[#472f69] border-[#e0ccf5] hover:border-[#caa4ec]',
        likeBtn: 'bg-white text-[#df5f88] border-[#f8d4e2] hover:border-[#df5f88]',
        synopsisHeaderIcon: 'text-[#8557b6]',
        synopsisHeaderText: 'text-[#53307e]',
        synopsisBorderLeft: 'border-[#caa4ec]',
        loreBoxBg: 'bg-[#f9f3fe]',
        loreBoxBorder: 'border-[#ebdbf7]',
        loreTitleText: 'text-[#43236a]',
        loreIconText: 'text-[#8557b6]',
        loreBodyText: 'text-[#4d366a]',
        chaptersHeaderIcon: 'text-[#8557b6]',
        chaptersHeaderText: 'text-[#53307e]',
        chaptersBadge: 'bg-[#f1e4fb] text-[#57357e] border-[#decdf2]',
        inputBg: 'bg-[#fdfaff]',
        inputBorder: 'border-[#e2d0f5]',
        inputFocus: 'focus:border-[#bfa2e4]',
        inputText: 'text-[#32234b]',
        chapterCardBg: 'bg-[#fcf8ff]',
        chapterCardBorder: 'border-[#ebdbf7]',
        chapterCardHoverBorder: 'hover:border-[#bfa2e4]',
        chapterCardHoverText: 'group-hover:text-[#6a3f9c]',
        chapterReadArrow: 'text-[#8d62bf]',
        extraChapterBadge: 'bg-[#f1e4fb] text-[#5e3887] border-[#ddcaf2]',
        commentsHeaderIcon: 'text-[#8557b6]',
        commentsHeaderText: 'text-[#53307e]',
        commentsBadge: 'text-[#8c67b7]',
        commentFormBg: 'bg-[#faf5fe]',
        commentFormBorder: 'border-[#eadbf7]',
        commentInputBg: 'bg-white',
        commentInputBorder: 'border-[#e2d0f5]',
        commentBtn: 'bg-[#bfa2e4] hover:bg-[#b08fda] text-[#2a1345]',
        commentItemBg: 'bg-[#faf5fe]',
        commentItemBorder: 'border-[#ebddf7]',
        commentAvatarBg: 'bg-[#bfa2e4] text-[#2a1345]',
        editorNoteBg: 'bg-[#f9f3fe]',
        editorNoteBorder: 'border-[#ebdbf7]',
        editorNoteTitle: 'text-[#53307e]',
        editorNoteIcon: 'text-[#8557b6]',
        relatedHeaderIcon: 'text-[#8557b6]',
        relatedHeaderText: 'text-[#53307e]',
        relatedCardBg: 'bg-[#faf5fe]',
        relatedCardBorder: 'border-[#ebddf7]',
        relatedCardHoverBorder: 'hover:border-[#bfa2e4]',
        relatedCardHoverTitle: 'group-hover:text-[#6a3f9c]',
        relatedLinkText: 'text-[#8557b6]',
        footerBorder: 'border-[#e9daf7]',
        footerText: 'text-[#896bb3]',
        washiTape: 'bg-[#ebd8f8]/90 border-[#d8bbf2]',
        heartIcon: 'text-[#9d73c7] fill-[#e8d7fa]/60',
        chapterScrollbar: '[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-[#f5ecfc] [&::-webkit-scrollbar-thumb]:bg-[#cdabf0]/60 hover:[&::-webkit-scrollbar-thumb]:bg-[#b891e2]/80 [&::-webkit-scrollbar-thumb]:rounded-full [scrollbar-color:rgba(205,171,240,0.6)_transparent] [scrollbar-width:thin]',
      };
    }
    // Dark mode Cosmic (Starry Galaxy)
    return {
      themeName: 'VŨ TRỤ HUYỀN ẢO',
      bannerBadge: 'text-purple-200 bg-purple-950/70 border-purple-500/40',
      bannerBadgeIcon: 'text-indigo-400 fill-purple-400/50',
      bannerTitle: 'text-purple-100',
      bannerDivider: 'bg-gradient-to-r from-indigo-500 via-purple-400 to-pink-500',
      coverBg: 'bg-[#0e1129]',
      coverBorder: 'border-purple-500/40',
      coverShadow: 'shadow-[0_20px_60px_rgba(99,102,241,0.35)]',
      ringsGradient: 'bg-gradient-to-r from-indigo-400 via-purple-200 to-pink-400',
      ringsBorder: 'border-indigo-400/60',
      holesBg: 'bg-[#060818]',
      holesBorder: 'border-purple-900/80',
      paperBg: 'bg-[#090b20]',
      paperBorder: 'border-purple-500/30',
      paperText: 'text-purple-100',
      dashedBorder: 'border-purple-900/50',
      plannerBadgeBg: 'bg-purple-950/80',
      plannerBadgeText: 'text-purple-300',
      plannerBadgeBorder: 'border-purple-500/50',
      dateText: 'text-purple-400/80',
      rulerText: 'text-purple-400/80',
      rulerBg: 'bg-purple-950/50',
      rulerBorder: 'border-purple-900/50',
      overviewBg: 'bg-[#121535]',
      overviewBorder: 'border-purple-500/40',
      binderClip: 'bg-purple-500 border-purple-400',
      statusBadge: 'bg-purple-950/90 text-purple-200',
      cardInnerBg: 'bg-stone-900/90',
      cardInnerBorder: 'border-purple-900/50',
      iconAccent: 'text-purple-400',
      subIconAccent: 'text-pink-400',
      tagPill: 'bg-purple-950/60 text-purple-300 border-purple-800/80 hover:border-purple-500',
      primaryBtn: 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-purple-900/50',
      bookmarkBtn: 'bg-stone-900 text-stone-200 border-purple-900 hover:border-purple-700',
      likeBtn: 'bg-stone-900 text-rose-400 border-purple-900 hover:border-rose-700',
      synopsisHeaderIcon: 'text-purple-400',
      synopsisHeaderText: 'text-purple-300',
      synopsisBorderLeft: 'border-purple-500/80',
      loreBoxBg: 'bg-indigo-950/40',
      loreBoxBorder: 'border-purple-500/30',
      loreTitleText: 'text-purple-300',
      loreIconText: 'text-purple-400',
      loreBodyText: 'text-purple-200/90',
      chaptersHeaderIcon: 'text-purple-400',
      chaptersHeaderText: 'text-purple-300',
      chaptersBadge: 'bg-purple-950/70 text-purple-300 border-purple-800/60',
      inputBg: 'bg-stone-900',
      inputBorder: 'border-stone-700',
      inputFocus: 'focus:border-purple-400',
      inputText: 'text-purple-100',
      chapterCardBg: 'bg-stone-900/80',
      chapterCardBorder: 'border-stone-800',
      chapterCardHoverBorder: 'hover:border-purple-400',
      chapterCardHoverText: 'group-hover:text-purple-400',
      chapterReadArrow: 'text-purple-400',
      extraChapterBadge: 'bg-purple-950/70 text-purple-300 border-purple-800',
      commentsHeaderIcon: 'text-purple-400',
      commentsHeaderText: 'text-purple-300',
      commentsBadge: 'text-stone-400',
      commentFormBg: 'bg-stone-900',
      commentFormBorder: 'border-stone-700',
      commentInputBg: 'bg-stone-800',
      commentInputBorder: 'border-stone-700',
      commentBtn: 'bg-purple-600 hover:bg-purple-500 text-white',
      commentItemBg: 'bg-stone-900/80',
      commentItemBorder: 'border-stone-800',
      commentAvatarBg: 'bg-purple-600 text-white',
      editorNoteBg: 'bg-purple-950/30',
      editorNoteBorder: 'border-purple-800/40',
      editorNoteTitle: 'text-purple-300',
      editorNoteIcon: 'text-purple-400',
      relatedHeaderIcon: 'text-purple-400',
      relatedHeaderText: 'text-purple-300',
      relatedCardBg: 'bg-stone-900',
      relatedCardBorder: 'border-stone-800',
      relatedCardHoverBorder: 'hover:border-purple-400',
      relatedCardHoverTitle: 'group-hover:text-purple-400',
      relatedLinkText: 'text-purple-400',
      footerBorder: 'border-purple-900/50',
      footerText: 'text-stone-400',
      washiTape: 'bg-indigo-900/70 border-indigo-700/60',
      heartIcon: 'text-purple-400 fill-purple-400/50',
      chapterScrollbar: '[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-purple-950/20 [&::-webkit-scrollbar-thumb]:bg-purple-500/50 hover:[&::-webkit-scrollbar-thumb]:bg-purple-400/80 [&::-webkit-scrollbar-thumb]:rounded-full [scrollbar-color:rgba(168,85,247,0.5)_transparent] [scrollbar-width:thin]',
    };
  }

  // 2. NOTEBOOK / WHITE THEME
  if (theme === 'notebook') {
    if (isDark) {
      return {
        themeName: 'MONOCHROME GRAPHITE',
        bannerBadge: 'text-zinc-200 bg-zinc-800/80 border-zinc-700',
        bannerBadgeIcon: 'text-zinc-400 fill-zinc-500/40',
        bannerTitle: 'text-zinc-100',
        bannerDivider: 'bg-gradient-to-r from-zinc-500 via-zinc-200 to-zinc-500',
        coverBg: 'bg-[#1a1a1d]',
        coverBorder: 'border-zinc-700/80',
        coverShadow: 'shadow-[0_20px_60px_rgba(212,212,216,0.18)]',
        ringsGradient: 'bg-gradient-to-r from-zinc-500/80 via-zinc-200/80 to-zinc-500/80',
        ringsBorder: 'border-zinc-400/50',
        holesBg: 'bg-[#101012]',
        holesBorder: 'border-zinc-700/60',
        paperBg: 'bg-[#131316]',
        paperBorder: 'border-zinc-800/80',
        paperText: 'text-zinc-100',
        dashedBorder: 'border-zinc-800',
        plannerBadgeBg: 'bg-zinc-800/80',
        plannerBadgeText: 'text-zinc-200',
        plannerBadgeBorder: 'border-zinc-700',
        dateText: 'text-zinc-400',
        rulerText: 'text-zinc-400',
        rulerBg: 'bg-zinc-900/50',
        rulerBorder: 'border-zinc-800',
        overviewBg: 'bg-[#18181c]',
        overviewBorder: 'border-zinc-700/60',
        binderClip: 'bg-zinc-400 border-zinc-300',
        statusBadge: 'bg-zinc-800/90 text-zinc-100 border border-zinc-700',
        cardInnerBg: 'bg-zinc-900/90',
        cardInnerBorder: 'border-zinc-800',
        iconAccent: 'text-zinc-300',
        subIconAccent: 'text-zinc-400',
        tagPill: 'bg-zinc-800/60 text-zinc-200 border-zinc-700 hover:border-zinc-500',
        primaryBtn: 'bg-gradient-to-r from-zinc-200 via-white to-zinc-200 text-zinc-950 font-bold shadow-md shadow-white/10 hover:opacity-95',
        bookmarkBtn: 'bg-zinc-900 text-zinc-200 border-zinc-700 hover:border-zinc-500',
        likeBtn: 'bg-zinc-900 text-rose-400 border-zinc-700 hover:border-rose-500',
        synopsisHeaderIcon: 'text-zinc-300',
        synopsisHeaderText: 'text-zinc-200',
        synopsisBorderLeft: 'border-zinc-400',
        loreBoxBg: 'bg-zinc-900/50',
        loreBoxBorder: 'border-zinc-800',
        loreTitleText: 'text-zinc-200',
        loreIconText: 'text-zinc-400',
        loreBodyText: 'text-zinc-300',
        chaptersHeaderIcon: 'text-zinc-300',
        chaptersHeaderText: 'text-zinc-200',
        chaptersBadge: 'bg-zinc-800/80 text-zinc-200 border-zinc-700',
        inputBg: 'bg-zinc-900',
        inputBorder: 'border-zinc-700',
        inputFocus: 'focus:border-zinc-400',
        inputText: 'text-zinc-100',
        chapterCardBg: 'bg-zinc-900/80',
        chapterCardBorder: 'border-zinc-800',
        chapterCardHoverBorder: 'hover:border-zinc-400',
        chapterCardHoverText: 'group-hover:text-white',
        chapterReadArrow: 'text-zinc-300 group-hover:text-white',
        extraChapterBadge: 'bg-zinc-800 text-zinc-200 border-zinc-700',
        commentsHeaderIcon: 'text-zinc-300',
        commentsHeaderText: 'text-zinc-200',
        commentsBadge: 'text-zinc-400',
        commentFormBg: 'bg-zinc-900',
        commentFormBorder: 'border-zinc-800',
        commentInputBg: 'bg-zinc-800',
        commentInputBorder: 'border-zinc-700',
        commentBtn: 'bg-gradient-to-r from-zinc-200 to-zinc-300 hover:opacity-95 text-zinc-950 font-bold',
        commentItemBg: 'bg-zinc-900/80',
        commentItemBorder: 'border-zinc-800',
        commentAvatarBg: 'bg-zinc-300 text-zinc-950 font-bold',
        editorNoteBg: 'bg-zinc-900/60',
        editorNoteBorder: 'border-zinc-800',
        editorNoteTitle: 'text-zinc-200',
        editorNoteIcon: 'text-zinc-400',
        relatedHeaderIcon: 'text-zinc-300',
        relatedHeaderText: 'text-zinc-200',
        relatedCardBg: 'bg-zinc-900',
        relatedCardBorder: 'border-zinc-800',
        relatedCardHoverBorder: 'hover:border-zinc-400',
        relatedCardHoverTitle: 'group-hover:text-white',
        relatedLinkText: 'text-zinc-300',
        footerBorder: 'border-zinc-800',
        footerText: 'text-zinc-400',
        washiTape: 'bg-zinc-700/70 border-zinc-600/70',
        heartIcon: 'text-zinc-300 fill-zinc-300/40',
        chapterScrollbar: '[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-zinc-900/20 [&::-webkit-scrollbar-thumb]:bg-zinc-600/50 hover:[&::-webkit-scrollbar-thumb]:bg-zinc-500/80 [&::-webkit-scrollbar-thumb]:rounded-full [scrollbar-color:rgba(161,161,170,0.5)_transparent] [scrollbar-width:thin]',
      };
    }
    // Light mode White (Trắng Tinh Khôi Dịu Nhẹ)
    return {
      themeName: 'TRẮNG TINH KHÔI',
      bannerBadge: 'text-zinc-700 bg-white border-zinc-200 shadow-xs',
      bannerBadgeIcon: 'text-zinc-400 fill-zinc-200',
      bannerTitle: 'text-zinc-900',
      bannerDivider: 'bg-gradient-to-r from-zinc-200 via-zinc-400 to-zinc-200',
      coverBg: 'bg-[#f8f9fa]',
      coverBorder: 'border-zinc-200/90',
      coverShadow: 'shadow-[0_16px_45px_rgba(0,0,0,0.05)]',
      ringsGradient: 'bg-gradient-to-r from-zinc-300 via-zinc-100 to-zinc-300',
      ringsBorder: 'border-zinc-300/80',
      holesBg: 'bg-zinc-200',
      holesBorder: 'border-zinc-300',
      paperBg: 'bg-[#ffffff]',
      paperBorder: 'border-zinc-200/80',
      paperText: 'text-zinc-800',
      dashedBorder: 'border-zinc-200',
      plannerBadgeBg: 'bg-zinc-100',
      plannerBadgeText: 'text-zinc-700',
      plannerBadgeBorder: 'border-zinc-200',
      dateText: 'text-zinc-500',
      rulerText: 'text-zinc-400',
      rulerBg: 'bg-zinc-50',
      rulerBorder: 'border-zinc-200',
      overviewBg: 'bg-zinc-50/60',
      overviewBorder: 'border-zinc-200',
      binderClip: 'bg-zinc-400 border-zinc-300',
      statusBadge: 'bg-zinc-100 text-zinc-800 border border-zinc-300',
      cardInnerBg: 'bg-white',
      cardInnerBorder: 'border-zinc-200',
      iconAccent: 'text-zinc-600',
      subIconAccent: 'text-zinc-400',
      tagPill: 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-400',
      primaryBtn: 'bg-gradient-to-r from-zinc-800 to-zinc-900 hover:from-zinc-700 hover:to-zinc-800 text-white font-bold shadow-md shadow-zinc-800/15',
      bookmarkBtn: 'bg-white text-zinc-800 border-zinc-200 hover:border-zinc-400',
      likeBtn: 'bg-white text-rose-500 border-zinc-200 hover:border-rose-400',
      synopsisHeaderIcon: 'text-zinc-600',
      synopsisHeaderText: 'text-zinc-800',
      synopsisBorderLeft: 'border-zinc-400',
      loreBoxBg: 'bg-zinc-50/80',
      loreBoxBorder: 'border-zinc-200',
      loreTitleText: 'text-zinc-900',
      loreIconText: 'text-zinc-600',
      loreBodyText: 'text-zinc-700',
      chaptersHeaderIcon: 'text-zinc-600',
      chaptersHeaderText: 'text-zinc-800',
      chaptersBadge: 'bg-zinc-100 text-zinc-700 border-zinc-200',
      inputBg: 'bg-white',
      inputBorder: 'border-zinc-200',
      inputFocus: 'focus:border-zinc-400',
      inputText: 'text-zinc-800',
      chapterCardBg: 'bg-white',
      chapterCardBorder: 'border-zinc-200',
      chapterCardHoverBorder: 'hover:border-zinc-400',
      chapterCardHoverText: 'group-hover:text-zinc-900',
      chapterReadArrow: 'text-zinc-600',
      extraChapterBadge: 'bg-zinc-100 text-zinc-700 border-zinc-200',
      commentsHeaderIcon: 'text-zinc-600',
      commentsHeaderText: 'text-zinc-800',
      commentsBadge: 'text-zinc-400',
      commentFormBg: 'bg-zinc-50/60',
      commentFormBorder: 'border-zinc-200',
      commentInputBg: 'bg-white',
      commentInputBorder: 'border-zinc-200',
      commentBtn: 'bg-zinc-800 hover:bg-zinc-900 text-white font-bold',
      commentItemBg: 'bg-white',
      commentItemBorder: 'border-zinc-200',
      commentAvatarBg: 'bg-zinc-700 text-white',
      editorNoteBg: 'bg-zinc-50/80',
      editorNoteBorder: 'border-zinc-200',
      editorNoteTitle: 'text-zinc-800',
      editorNoteIcon: 'text-zinc-600',
      relatedHeaderIcon: 'text-zinc-600',
      relatedHeaderText: 'text-zinc-800',
      relatedCardBg: 'bg-white',
      relatedCardBorder: 'border-zinc-200',
      relatedCardHoverBorder: 'hover:border-zinc-400',
      relatedCardHoverTitle: 'group-hover:text-zinc-900',
      relatedLinkText: 'text-zinc-600',
      footerBorder: 'border-zinc-200',
      footerText: 'text-zinc-400',
      washiTape: 'bg-zinc-200/80 border-zinc-300/80',
      heartIcon: 'text-zinc-400 fill-zinc-200',
      chapterScrollbar: '[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-zinc-100 [&::-webkit-scrollbar-thumb]:bg-zinc-300 hover:[&::-webkit-scrollbar-thumb]:bg-zinc-400 [&::-webkit-scrollbar-thumb]:rounded-full [scrollbar-color:rgba(212,212,216,0.8)_transparent] [scrollbar-width:thin]',
    };
  }

  // 3. SLATE-HAZE / FROST THEME
  if (theme === 'slate-haze') {
    if (isDark) {
      return {
        themeName: 'XANH BĂNG FROST',
        bannerBadge: 'text-[#dce7f0] bg-[#14202c]/70 border-[#4d6a85]/40',
        bannerBadgeIcon: 'text-[#8bb0cf] fill-[#4d6a85]/30',
        bannerTitle: 'text-[#f0f5fa]',
        bannerDivider: 'bg-gradient-to-r from-[#3e566d] via-[#4d6a85] to-[#5d7e9d]',
        coverBg: 'bg-[#0e1620]',
        coverBorder: 'border-[#4d6a85]/50',
        coverShadow: 'shadow-[0_20px_60px_rgba(77,106,133,0.22)]',
        ringsGradient: 'bg-gradient-to-r from-[#4d6a85]/80 via-[#b0c8dc]/70 to-[#5d7e9d]/80',
        ringsBorder: 'border-[#4d6a85]/50',
        holesBg: 'bg-[#080d14]',
        holesBorder: 'border-[#4d6a85]/60',
        paperBg: 'bg-[#0a1017]',
        paperBorder: 'border-[#4d6a85]/40',
        paperText: 'text-[#f0f5fa]',
        dashedBorder: 'border-[#4d6a85]/35',
        plannerBadgeBg: 'bg-[#14202c]/80',
        plannerBadgeText: 'text-[#dce7f0]',
        plannerBadgeBorder: 'border-[#4d6a85]/50',
        dateText: 'text-[#8bb0cf]',
        rulerText: 'text-[#8bb0cf]',
        rulerBg: 'bg-[#14202c]/50',
        rulerBorder: 'border-[#4d6a85]/40',
        overviewBg: 'bg-[#101924]',
        overviewBorder: 'border-[#4d6a85]/50',
        binderClip: 'bg-[#4d6a85] border-[#5d7e9d]',
        statusBadge: 'bg-[#14202c]/90 text-[#dce7f0]',
        cardInnerBg: 'bg-[#111a24]/90',
        cardInnerBorder: 'border-[#4d6a85]/40',
        iconAccent: 'text-[#8bb0cf]',
        subIconAccent: 'text-[#a6c2d8]',
        tagPill: 'bg-[#14202c]/60 text-[#dce7f0] border-[#4d6a85]/50 hover:border-[#5d7e9d]',
        primaryBtn: 'bg-gradient-to-r from-[#3e566d] via-[#4d6a85] to-[#5d7e9d] text-white shadow-md shadow-[#0c141d]/50 font-bold',
        bookmarkBtn: 'bg-[#111a24] text-stone-200 border-[#4d6a85]/50 hover:border-[#5d7e9d]',
        likeBtn: 'bg-[#111a24] text-rose-400 border-[#4d6a85]/50 hover:border-rose-600',
        synopsisHeaderIcon: 'text-[#8bb0cf]',
        synopsisHeaderText: 'text-[#dce7f0]',
        synopsisBorderLeft: 'border-[#4d6a85]',
        loreBoxBg: 'bg-[#14202c]/30',
        loreBoxBorder: 'border-[#4d6a85]/40',
        loreTitleText: 'text-[#dce7f0]',
        loreIconText: 'text-[#8bb0cf]',
        loreBodyText: 'text-stone-300',
        chaptersHeaderIcon: 'text-[#8bb0cf]',
        chaptersHeaderText: 'text-[#dce7f0]',
        chaptersBadge: 'bg-[#14202c]/60 text-[#dce7f0] border-[#4d6a85]/50',
        inputBg: 'bg-[#0c1219]',
        inputBorder: 'border-[#4d6a85]/40',
        inputFocus: 'focus:border-[#5d7e9d]',
        inputText: 'text-[#f0f5fa]',
        chapterCardBg: 'bg-[#111a24]/80',
        chapterCardBorder: 'border-[#4d6a85]/30',
        chapterCardHoverBorder: 'hover:border-[#5d7e9d]',
        chapterCardHoverText: 'group-hover:text-[#dce7f0]',
        chapterReadArrow: 'text-[#8bb0cf]',
        extraChapterBadge: 'bg-[#14202c]/70 text-[#dce7f0] border-[#4d6a85]/50',
        commentsHeaderIcon: 'text-[#8bb0cf]',
        commentsHeaderText: 'text-[#dce7f0]',
        commentsBadge: 'text-stone-400',
        commentFormBg: 'bg-[#111a24]',
        commentFormBorder: 'border-[#4d6a85]/40',
        commentInputBg: 'bg-[#162230]',
        commentInputBorder: 'border-[#4d6a85]/40',
        commentBtn: 'bg-gradient-to-r from-[#3e566d] via-[#4d6a85] to-[#5d7e9d] hover:opacity-95 text-white font-bold',
        commentItemBg: 'bg-[#111a24]/80',
        commentItemBorder: 'border-[#4d6a85]/30',
        commentAvatarBg: 'bg-[#4d6a85] text-white',
        editorNoteBg: 'bg-[#14202c]/30',
        editorNoteBorder: 'border-[#4d6a85]/40',
        editorNoteTitle: 'text-[#dce7f0]',
        editorNoteIcon: 'text-[#8bb0cf]',
        relatedHeaderIcon: 'text-[#8bb0cf]',
        relatedHeaderText: 'text-[#dce7f0]',
        relatedCardBg: 'bg-[#111a24]',
        relatedCardBorder: 'border-[#4d6a85]/30',
        relatedCardHoverBorder: 'hover:border-[#5d7e9d]',
        relatedCardHoverTitle: 'group-hover:text-[#dce7f0]',
        relatedLinkText: 'text-[#8bb0cf]',
        footerBorder: 'border-[#4d6a85]/40',
        footerText: 'text-stone-400',
        washiTape: 'bg-[#1b2b3a]/70 border-[#4d6a85]/50',
        heartIcon: 'text-[#8bb0cf] fill-[#8bb0cf]/40',
        chapterScrollbar: '[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-[#14202c]/20 [&::-webkit-scrollbar-thumb]:bg-[#4d6a85]/50 hover:[&::-webkit-scrollbar-thumb]:bg-[#5d7e9d]/80 [&::-webkit-scrollbar-thumb]:rounded-full [scrollbar-color:rgba(77,106,133,0.5)_transparent] [scrollbar-width:thin]',
      };
    }
    // Light mode Frost (Xanh Mây Baby Pastel Dịu Mát)
    return {
      themeName: 'XANH MÂY BABY PASTEL',
      bannerBadge: 'text-[#355b80] bg-[#eaf2fb] border-[#cddff1] shadow-xs',
      bannerBadgeIcon: 'text-[#5687b3] fill-[#cfe2f5]',
      bannerTitle: 'text-[#24384d]',
      bannerDivider: 'bg-gradient-to-r from-[#cce0f2] via-[#94bede] to-[#cce0f2]',
      coverBg: 'bg-[#edf4fb]',
      coverBorder: 'border-[#d4e5f4]',
      coverShadow: 'shadow-[0_16px_45px_rgba(110,155,195,0.12)]',
      ringsGradient: 'bg-gradient-to-r from-[#c4daf0] via-[#f5f9fd] to-[#c4daf0]',
      ringsBorder: 'border-[#aecde8]',
      holesBg: 'bg-[#dbe9f6]',
      holesBorder: 'border-[#c8ddf0]',
      paperBg: 'bg-[#ffffff]',
      paperBorder: 'border-[#dbeefc]',
      paperText: 'text-[#24384d]',
      dashedBorder: 'border-[#d4e6f5]',
      plannerBadgeBg: 'bg-[#e5f0fa]',
      plannerBadgeText: 'text-[#2f557a]',
      plannerBadgeBorder: 'border-[#c5dcf0]',
      dateText: 'text-[#4f789e]',
      rulerText: 'text-[#6a90b4]',
      rulerBg: 'bg-[#f2f7fc]',
      rulerBorder: 'border-[#d8e8f6]',
      overviewBg: 'bg-[#f8fbfe]',
      overviewBorder: 'border-[#d8e8f6]',
      binderClip: 'bg-[#85b0d6] border-[#729ec4]',
      statusBadge: 'bg-[#e0eef8] text-[#244b70] border border-[#c2def2]',
      cardInnerBg: 'bg-[#f6faff]',
      cardInnerBorder: 'border-[#dbeefc]',
      iconAccent: 'text-[#4d7ca8]',
      subIconAccent: 'text-[#6f9cc7]',
      tagPill: 'bg-[#edf5fc] text-[#2c5378] border-[#cbe1f3] hover:border-[#94bede]',
      primaryBtn: 'bg-[#9ec5e8] hover:bg-[#8bb7dd] text-[#163047] font-black shadow-md shadow-[#9ec5e8]/25',
      bookmarkBtn: 'bg-white text-[#324f6b] border-[#cfe2f2] hover:border-[#9ec5e8]',
      likeBtn: 'bg-white text-[#de667f] border-[#f4d4dc] hover:border-[#de667f]',
      synopsisHeaderIcon: 'text-[#4d7ca8]',
      synopsisHeaderText: 'text-[#284d72]',
      synopsisBorderLeft: 'border-[#9ac4e8]',
      loreBoxBg: 'bg-[#f3f8fd]',
      loreBoxBorder: 'border-[#d8e9f7]',
      loreTitleText: 'text-[#204060]',
      loreIconText: 'text-[#4d7ca8]',
      loreBodyText: 'text-[#344d65]',
      chaptersHeaderIcon: 'text-[#4d7ca8]',
      chaptersHeaderText: 'text-[#284d72]',
      chaptersBadge: 'bg-[#e5f0fa] text-[#2e5378] border-[#c7dff2]',
      inputBg: 'bg-[#fcfdff]',
      inputBorder: 'border-[#d0e3f4]',
      inputFocus: 'focus:border-[#9ec5e8]',
      inputText: 'text-[#24384d]',
      chapterCardBg: 'bg-[#f8fbfe]',
      chapterCardBorder: 'border-[#dcebf7]',
      chapterCardHoverBorder: 'hover:border-[#9ec5e8]',
      chapterCardHoverText: 'group-hover:text-[#38638c]',
      chapterReadArrow: 'text-[#5885af]',
      extraChapterBadge: 'bg-[#e5f0fa] text-[#335980] border-[#c5ddf1]',
      commentsHeaderIcon: 'text-[#4d7ca8]',
      commentsHeaderText: 'text-[#284d72]',
      commentsBadge: 'text-[#688dae]',
      commentFormBg: 'bg-[#f6faff]',
      commentFormBorder: 'border-[#d9e9f6]',
      commentInputBg: 'bg-white',
      commentInputBorder: 'border-[#d0e3f4]',
      commentBtn: 'bg-[#9ec5e8] hover:bg-[#8bb7dd] text-[#163047]',
      commentItemBg: 'bg-[#f6faff]',
      commentItemBorder: 'border-[#dbeaf6]',
      commentAvatarBg: 'bg-[#9ec5e8] text-[#163047]',
      editorNoteBg: 'bg-[#f3f8fd]',
      editorNoteBorder: 'border-[#d8e9f7]',
      editorNoteTitle: 'text-[#284d72]',
      editorNoteIcon: 'text-[#4d7ca8]',
      relatedHeaderIcon: 'text-[#4d7ca8]',
      relatedHeaderText: 'text-[#284d72]',
      relatedCardBg: 'bg-[#f6faff]',
      relatedCardBorder: 'border-[#dbeaf6]',
      relatedCardHoverBorder: 'hover:border-[#9ec5e8]',
      relatedCardHoverTitle: 'group-hover:text-[#38638c]',
      relatedLinkText: 'text-[#4d7ca8]',
      footerBorder: 'border-[#d7e7f6]',
      footerText: 'text-[#6387a8]',
      washiTape: 'bg-[#d7e9f8]/90 border-[#bfdaf2]',
      heartIcon: 'text-[#608eb8] fill-[#cfe2f5]/60',
      chapterScrollbar: '[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-[#ebf3fa] [&::-webkit-scrollbar-thumb]:bg-[#b0d0ed]/60 hover:[&::-webkit-scrollbar-thumb]:bg-[#97bee0]/80 [&::-webkit-scrollbar-thumb]:rounded-full [scrollbar-color:rgba(176,208,237,0.6)_transparent] [scrollbar-width:thin]',
    };
  }

  // 4. SAGE THEME
  if (theme === 'sage') {
    if (isDark) {
      // Chế độ tối Sage: Điều chỉnh màu sắc dịu nhẹ, bớt chói, êm mắt tông thảo mộc
      return {
        themeName: 'XANH SAGE BOTANICAL',
        bannerBadge: 'text-[#d7e6d9] bg-[#152317]/70 border-[#4d6f53]/40',
        bannerBadgeIcon: 'text-[#8cb391] fill-[#4d6f53]/30',
        bannerTitle: 'text-[#eaf2eb]',
        bannerDivider: 'bg-gradient-to-r from-[#3e5b43] via-[#4d6f53] to-[#5e8264]',
        coverBg: 'bg-[#0e1711]',
        coverBorder: 'border-[#4d6f53]/50',
        coverShadow: 'shadow-[0_20px_60px_rgba(77,111,83,0.22)]',
        ringsGradient: 'bg-gradient-to-r from-[#4d6f53]/80 via-[#98b89a]/70 to-[#5e8264]/80',
        ringsBorder: 'border-[#4d6f53]/50',
        holesBg: 'bg-[#060c08]',
        holesBorder: 'border-[#4d6f53]/60',
        paperBg: 'bg-[#0a120d]',
        paperBorder: 'border-[#4d6f53]/40',
        paperText: 'text-[#eaf2eb]',
        dashedBorder: 'border-[#4d6f53]/35',
        plannerBadgeBg: 'bg-[#152317]/80',
        plannerBadgeText: 'text-[#d7e6d9]',
        plannerBadgeBorder: 'border-[#4d6f53]/50',
        dateText: 'text-[#8cb391]',
        rulerText: 'text-[#8cb391]',
        rulerBg: 'bg-[#152317]/50',
        rulerBorder: 'border-[#4d6f53]/40',
        overviewBg: 'bg-[#101b13]',
        overviewBorder: 'border-[#4d6f53]/50',
        binderClip: 'bg-[#4d6f53] border-[#5e8264]',
        statusBadge: 'bg-[#152317]/90 text-[#d7e6d9]',
        cardInnerBg: 'bg-[#111c14]/90',
        cardInnerBorder: 'border-[#4d6f53]/40',
        iconAccent: 'text-[#8cb391]',
        subIconAccent: 'text-[#9db6a1]',
        tagPill: 'bg-[#152317]/60 text-[#d7e6d9] border-[#4d6f53]/50 hover:border-[#5e8264]',
        primaryBtn: 'bg-gradient-to-r from-[#3e5b43] via-[#4d6f53] to-[#5e8264] text-white shadow-md shadow-[#0c1510]/50 font-bold',
        bookmarkBtn: 'bg-[#111c14] text-stone-200 border-[#4d6f53]/50 hover:border-[#5e8264]',
        likeBtn: 'bg-[#111c14] text-rose-400 border-[#4d6f53]/50 hover:border-rose-600',
        synopsisHeaderIcon: 'text-[#8cb391]',
        synopsisHeaderText: 'text-[#d7e6d9]',
        synopsisBorderLeft: 'border-[#4d6f53]',
        loreBoxBg: 'bg-[#152317]/30',
        loreBoxBorder: 'border-[#4d6f53]/40',
        loreTitleText: 'text-[#d7e6d9]',
        loreIconText: 'text-[#8cb391]',
        loreBodyText: 'text-stone-300',
        chaptersHeaderIcon: 'text-[#8cb391]',
        chaptersHeaderText: 'text-[#d7e6d9]',
        chaptersBadge: 'bg-[#152317]/60 text-[#d7e6d9] border-[#4d6f53]/50',
        inputBg: 'bg-[#0d160f]',
        inputBorder: 'border-[#4d6f53]/40',
        inputFocus: 'focus:border-[#5e8264]',
        inputText: 'text-[#eaf2eb]',
        chapterCardBg: 'bg-[#111c14]/80',
        chapterCardBorder: 'border-[#4d6f53]/30',
        chapterCardHoverBorder: 'hover:border-[#5e8264]',
        chapterCardHoverText: 'group-hover:text-[#d7e6d9]',
        chapterReadArrow: 'text-[#8cb391]',
        extraChapterBadge: 'bg-[#152317]/70 text-[#d7e6d9] border-[#4d6f53]/50',
        commentsHeaderIcon: 'text-[#8cb391]',
        commentsHeaderText: 'text-[#d7e6d9]',
        commentsBadge: 'text-stone-400',
        commentFormBg: 'bg-[#111c14]',
        commentFormBorder: 'border-[#4d6f53]/40',
        commentInputBg: 'bg-[#17251b]',
        commentInputBorder: 'border-[#4d6f53]/40',
        commentBtn: 'bg-gradient-to-r from-[#3e5b43] via-[#4d6f53] to-[#5e8264] hover:opacity-95 text-white font-bold',
        commentItemBg: 'bg-[#111c14]/80',
        commentItemBorder: 'border-[#4d6f53]/30',
        commentAvatarBg: 'bg-[#4d6f53] text-white',
        editorNoteBg: 'bg-[#152317]/30',
        editorNoteBorder: 'border-[#4d6f53]/40',
        editorNoteTitle: 'text-[#d7e6d9]',
        editorNoteIcon: 'text-[#8cb391]',
        relatedHeaderIcon: 'text-[#8cb391]',
        relatedHeaderText: 'text-[#d7e6d9]',
        relatedCardBg: 'bg-[#111c14]',
        relatedCardBorder: 'border-[#4d6f53]/30',
        relatedCardHoverBorder: 'hover:border-[#5e8264]',
        relatedCardHoverTitle: 'group-hover:text-[#d7e6d9]',
        relatedLinkText: 'text-[#8cb391]',
        footerBorder: 'border-[#4d6f53]/40',
        footerText: 'text-stone-400',
        washiTape: 'bg-[#1d3021]/70 border-[#4d6f53]/50',
        heartIcon: 'text-[#8cb391] fill-[#8cb391]/40',
        chapterScrollbar: '[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-[#152317]/20 [&::-webkit-scrollbar-thumb]:bg-[#4d6f53]/50 hover:[&::-webkit-scrollbar-thumb]:bg-[#5e8264]/80 [&::-webkit-scrollbar-thumb]:rounded-full [scrollbar-color:rgba(77,111,83,0.5)_transparent] [scrollbar-width:thin]',
      };
    }
    // Light mode Sage (Trà Sữa Matcha Pastel Dịu Ngọt)
    return {
      themeName: 'TRÀ SỮA MATCHA PASTEL',
      bannerBadge: 'text-[#375434] bg-[#edf4eb] border-[#d1e3ce] shadow-xs',
      bannerBadgeIcon: 'text-[#5b8756] fill-[#d4e7d1]',
      bannerTitle: 'text-[#253823]',
      bannerDivider: 'bg-gradient-to-r from-[#d0e3cd] via-[#9ec698] to-[#d0e3cd]',
      coverBg: 'bg-[#eef5ed]',
      coverBorder: 'border-[#d6e6d3]',
      coverShadow: 'shadow-[0_16px_45px_rgba(105,145,100,0.11)]',
      ringsGradient: 'bg-gradient-to-r from-[#c7ddc3] via-[#f6faf5] to-[#c7ddc3]',
      ringsBorder: 'border-[#b4cfb0]',
      holesBg: 'bg-[#deecdb]',
      holesBorder: 'border-[#cae0c6]',
      paperBg: 'bg-[#ffffff]',
      paperBorder: 'border-[#deeada]',
      paperText: 'text-[#253823]',
      dashedBorder: 'border-[#d6e6d3]',
      plannerBadgeBg: 'bg-[#e7f1e5]',
      plannerBadgeText: 'text-[#345231]',
      plannerBadgeBorder: 'border-[#c9dec6]',
      dateText: 'text-[#577a52]',
      rulerText: 'text-[#71936c]',
      rulerBg: 'bg-[#f3f8f1]',
      rulerBorder: 'border-[#dae9d7]',
      overviewBg: 'bg-[#f9fcf8]',
      overviewBorder: 'border-[#dae9d7]',
      binderClip: 'bg-[#8db887] border-[#7aa574]',
      statusBadge: 'bg-[#e3f0e0] text-[#294a26] border border-[#c4e0bf]',
      cardInnerBg: 'bg-[#f6faf5]',
      cardInnerBorder: 'border-[#deeada]',
      iconAccent: 'text-[#507d4b]',
      subIconAccent: 'text-[#749f6f]',
      tagPill: 'bg-[#eef6ec] text-[#31502e] border-[#cee2cb] hover:border-[#9ec698]',
      primaryBtn: 'bg-[#a6cca0] hover:bg-[#95bf8e] text-[#1b3318] font-black shadow-md shadow-[#a6cca0]/25',
      bookmarkBtn: 'bg-white text-[#324930] border-[#d2e5ce] hover:border-[#a6cca0]',
      likeBtn: 'bg-white text-[#db6278] border-[#f4d1d8] hover:border-[#db6278]',
      synopsisHeaderIcon: 'text-[#507d4b]',
      synopsisHeaderText: 'text-[#2e492b]',
      synopsisBorderLeft: 'border-[#a4cba0]',
      loreBoxBg: 'bg-[#f4f9f2]',
      loreBoxBorder: 'border-[#dae9d7]',
      loreTitleText: 'text-[#253d22]',
      loreIconText: 'text-[#507d4b]',
      loreBodyText: 'text-[#384e36]',
      chaptersHeaderIcon: 'text-[#507d4b]',
      chaptersHeaderText: 'text-[#2e492b]',
      chaptersBadge: 'bg-[#e7f1e5] text-[#314f2e] border-[#cbdcc7]',
      inputBg: 'bg-[#fcfdfb]',
      inputBorder: 'border-[#d4e5d1]',
      inputFocus: 'focus:border-[#a6cca0]',
      inputText: 'text-[#253823]',
      chapterCardBg: 'bg-[#f9fcf8]',
      chapterCardBorder: 'border-[#deeada]',
      chapterCardHoverBorder: 'hover:border-[#a6cca0]',
      chapterCardHoverText: 'group-hover:text-[#426a3d]',
      chapterReadArrow: 'text-[#5b8756]',
      extraChapterBadge: 'bg-[#e7f1e5] text-[#345231] border-[#c9dec6]',
      commentsHeaderIcon: 'text-[#507d4b]',
      commentsHeaderText: 'text-[#2e492b]',
      commentsBadge: 'text-[#6e916a]',
      commentFormBg: 'bg-[#f6faf5]',
      commentFormBorder: 'border-[#dae9d7]',
      commentInputBg: 'bg-white',
      commentInputBorder: 'border-[#d4e5d1]',
      commentBtn: 'bg-[#a6cca0] hover:bg-[#95bf8e] text-[#1b3318]',
      commentItemBg: 'bg-[#f6faf5]',
      commentItemBorder: 'border-[#dbe8d8]',
      commentAvatarBg: 'bg-[#a6cca0] text-[#1b3318]',
      editorNoteBg: 'bg-[#f4f9f2]',
      editorNoteBorder: 'border-[#dae9d7]',
      editorNoteTitle: 'text-[#2e492b]',
      editorNoteIcon: 'text-[#507d4b]',
      relatedHeaderIcon: 'text-[#507d4b]',
      relatedHeaderText: 'text-[#2e492b]',
      relatedCardBg: 'bg-[#f6faf5]',
      relatedCardBorder: 'border-[#dbe8d8]',
      relatedCardHoverBorder: 'hover:border-[#a6cca0]',
      relatedCardHoverTitle: 'group-hover:text-[#426a3d]',
      relatedLinkText: 'text-[#507d4b]',
      footerBorder: 'border-[#d9e8d6]',
      footerText: 'text-[#6a8c66]',
      washiTape: 'bg-[#daecdc]/90 border-[#c2dec5]',
      heartIcon: 'text-[#638e5e] fill-[#d4e7d1]/60',
      chapterScrollbar: '[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-[#ebf4ea] [&::-webkit-scrollbar-thumb]:bg-[#b6d6b1]/60 hover:[&::-webkit-scrollbar-thumb]:bg-[#9ec698]/80 [&::-webkit-scrollbar-thumb]:rounded-full [scrollbar-color:rgba(182,214,177,0.6)_transparent] [scrollbar-width:thin]',
    };
  }

  // 5. MOCHA / LINEN THEME
  if (theme === 'mocha') {
    if (isDark) {
      // Chế độ tối Linen: Tông màu sợi linen cổ điển trầm ấm, dịu nhẹ, không chói gắt
      return {
        themeName: 'VINTAGE LINEN MOCHA',
        bannerBadge: 'text-[#ebdcd3] bg-[#2a1a14]/70 border-[#8c6150]/40',
        bannerBadgeIcon: 'text-[#d4a38c] fill-[#8c6150]/30',
        bannerTitle: 'text-[#f5ece6]',
        bannerDivider: 'bg-gradient-to-r from-[#775243] via-[#8c6150] to-[#9f7260]',
        coverBg: 'bg-[#18120e]',
        coverBorder: 'border-[#8c6150]/50',
        coverShadow: 'shadow-[0_20px_60px_rgba(140,97,80,0.22)]',
        ringsGradient: 'bg-gradient-to-r from-[#8c6150]/80 via-[#d8c2b5]/70 to-[#9f7260]/80',
        ringsBorder: 'border-[#8c6150]/50',
        holesBg: 'bg-[#0e0906]',
        holesBorder: 'border-[#8c6150]/60',
        paperBg: 'bg-[#130d09]',
        paperBorder: 'border-[#8c6150]/40',
        paperText: 'text-[#f5ece6]',
        dashedBorder: 'border-[#8c6150]/35',
        plannerBadgeBg: 'bg-[#2a1a14]/80',
        plannerBadgeText: 'text-[#ebdcd3]',
        plannerBadgeBorder: 'border-[#8c6150]/50',
        dateText: 'text-[#d4a38c]',
        rulerText: 'text-[#d4a38c]',
        rulerBg: 'bg-[#241712]/50',
        rulerBorder: 'border-[#8c6150]/40',
        overviewBg: 'bg-[#1a120c]',
        overviewBorder: 'border-[#8c6150]/50',
        binderClip: 'bg-[#8c6150] border-[#9f7260]',
        statusBadge: 'bg-[#2a1a14]/90 text-[#ebdcd3]',
        cardInnerBg: 'bg-[#1a120d]/90',
        cardInnerBorder: 'border-[#8c6150]/40',
        iconAccent: 'text-[#d4a38c]',
        subIconAccent: 'text-[#c2b0a2]',
        tagPill: 'bg-[#2a1a14]/60 text-[#ebdcd3] border-[#8c6150]/50 hover:border-[#9f7260]',
        primaryBtn: 'bg-gradient-to-r from-[#775243] via-[#8c6150] to-[#9f7260] text-white shadow-md shadow-[#231812]/50 font-bold',
        bookmarkBtn: 'bg-[#1a120d] text-stone-200 border-[#8c6150]/50 hover:border-[#9f7260]',
        likeBtn: 'bg-[#1a120d] text-rose-400 border-[#8c6150]/50 hover:border-rose-600',
        synopsisHeaderIcon: 'text-[#d4a38c]',
        synopsisHeaderText: 'text-[#ebdcd3]',
        synopsisBorderLeft: 'border-[#8c6150]',
        loreBoxBg: 'bg-[#2a1a14]/30',
        loreBoxBorder: 'border-[#8c6150]/40',
        loreTitleText: 'text-[#ebdcd3]',
        loreIconText: 'text-[#d4a38c]',
        loreBodyText: 'text-stone-300',
        chaptersHeaderIcon: 'text-[#d4a38c]',
        chaptersHeaderText: 'text-[#ebdcd3]',
        chaptersBadge: 'bg-[#2a1a14]/60 text-[#ebdcd3] border-[#8c6150]/50',
        inputBg: 'bg-[#160f0b]',
        inputBorder: 'border-[#8c6150]/40',
        inputFocus: 'focus:border-[#9f7260]',
        inputText: 'text-[#f5ece6]',
        chapterCardBg: 'bg-[#1a120d]/80',
        chapterCardBorder: 'border-[#8c6150]/30',
        chapterCardHoverBorder: 'hover:border-[#9f7260]',
        chapterCardHoverText: 'group-hover:text-[#ebdcd3]',
        chapterReadArrow: 'text-[#d4a38c]',
        extraChapterBadge: 'bg-[#2a1a14]/70 text-[#ebdcd3] border-[#8c6150]/50',
        commentsHeaderIcon: 'text-[#d4a38c]',
        commentsHeaderText: 'text-[#ebdcd3]',
        commentsBadge: 'text-stone-400',
        commentFormBg: 'bg-[#1a120d]',
        commentFormBorder: 'border-[#8c6150]/40',
        commentInputBg: 'bg-[#221711]',
        commentInputBorder: 'border-[#8c6150]/40',
        commentBtn: 'bg-gradient-to-r from-[#775243] via-[#8c6150] to-[#9f7260] hover:opacity-95 text-white font-bold',
        commentItemBg: 'bg-[#1a120d]/80',
        commentItemBorder: 'border-[#8c6150]/30',
        commentAvatarBg: 'bg-[#8c6150] text-white',
        editorNoteBg: 'bg-[#2a1a14]/30',
        editorNoteBorder: 'border-[#8c6150]/40',
        editorNoteTitle: 'text-[#ebdcd3]',
        editorNoteIcon: 'text-[#d4a38c]',
        relatedHeaderIcon: 'text-[#d4a38c]',
        relatedHeaderText: 'text-[#ebdcd3]',
        relatedCardBg: 'bg-[#1a120d]',
        relatedCardBorder: 'border-[#8c6150]/30',
        relatedCardHoverBorder: 'hover:border-[#9f7260]',
        relatedCardHoverTitle: 'group-hover:text-[#ebdcd3]',
        relatedLinkText: 'text-[#d4a38c]',
        footerBorder: 'border-[#8c6150]/40',
        footerText: 'text-stone-400',
        washiTape: 'bg-[#3a251b]/70 border-[#8c6150]/50',
        heartIcon: 'text-[#d4a38c] fill-[#d4a38c]/40',
        chapterScrollbar: '[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-[#241712]/20 [&::-webkit-scrollbar-thumb]:bg-[#8c6150]/50 hover:[&::-webkit-scrollbar-thumb]:bg-[#9f7260]/80 [&::-webkit-scrollbar-thumb]:rounded-full [scrollbar-color:rgba(140,97,80,0.5)_transparent] [scrollbar-width:thin]',
      };
    }
    // Light mode Linen (Trà Sữa Caramel Pastel Dịu Ngọt)
    return {
      themeName: 'TRÀ SỮA CARAMEL PASTEL',
      bannerBadge: 'text-[#6e4e37] bg-[#f7eee4] border-[#e7d5c2] shadow-xs',
      bannerBadgeIcon: 'text-[#9e7657] fill-[#f0decb]',
      bannerTitle: 'text-[#3d2c1f]',
      bannerDivider: 'bg-gradient-to-r from-[#e7d5c2] via-[#cca787] to-[#e7d5c2]',
      coverBg: 'bg-[#f8f1e8]',
      coverBorder: 'border-[#e7d8c7]',
      coverShadow: 'shadow-[0_16px_45px_rgba(160,120,85,0.11)]',
      ringsGradient: 'bg-gradient-to-r from-[#dfcebc] via-[#fbf7f1] to-[#dfcebc]',
      ringsBorder: 'border-[#d1bdab]',
      holesBg: 'bg-[#efe0d0]',
      holesBorder: 'border-[#e0cebc]',
      paperBg: 'bg-[#ffffff]',
      paperBorder: 'border-[#ede0d2]',
      paperText: 'text-[#3d2c1f]',
      dashedBorder: 'border-[#e7d7c6]',
      plannerBadgeBg: 'bg-[#f4e9dc]',
      plannerBadgeText: 'text-[#6a4c35]',
      plannerBadgeBorder: 'border-[#e2ceba]',
      dateText: 'text-[#8f6d50]',
      rulerText: 'text-[#a28165]',
      rulerBg: 'bg-[#f8f3ec]',
      rulerBorder: 'border-[#ebddce]',
      overviewBg: 'bg-[#fcf9f5]',
      overviewBorder: 'border-[#ecddcf]',
      binderClip: 'bg-[#be9c7d] border-[#aa8769]',
      statusBadge: 'bg-[#f0e3d3] text-[#593b22] border border-[#dfc9b2]',
      cardInnerBg: 'bg-[#f9f4ed]',
      cardInnerBorder: 'border-[#ede0d2]',
      iconAccent: 'text-[#997253]',
      subIconAccent: 'text-[#b69072]',
      tagPill: 'bg-[#f7efe5] text-[#5c3e27] border-[#e7d4bf] hover:border-[#cca787]',
      primaryBtn: 'bg-[#d7b899] hover:bg-[#caa785] text-[#341f0f] font-black shadow-md shadow-[#d7b899]/25',
      bookmarkBtn: 'bg-white text-[#473425] border-[#e3d1be] hover:border-[#d7b899]',
      likeBtn: 'bg-white text-[#db6278] border-[#f4d1d8] hover:border-[#db6278]',
      synopsisHeaderIcon: 'text-[#997253]',
      synopsisHeaderText: 'text-[#61422b]',
      synopsisBorderLeft: 'border-[#d0af90]',
      loreBoxBg: 'bg-[#f7f1e9]',
      loreBoxBorder: 'border-[#ecddcf]',
      loreTitleText: 'text-[#4d321d]',
      loreIconText: 'text-[#997253]',
      loreBodyText: 'text-[#513e2f]',
      chaptersHeaderIcon: 'text-[#997253]',
      chaptersHeaderText: 'text-[#61422b]',
      chaptersBadge: 'bg-[#f4e9dc] text-[#63452f] border-[#e3d0bd]',
      inputBg: 'bg-[#fdfbfa]',
      inputBorder: 'border-[#e6d6c4]',
      inputFocus: 'focus:border-[#d7b899]',
      inputText: 'text-[#3d2c1f]',
      chapterCardBg: 'bg-[#fcf9f5]',
      chapterCardBorder: 'border-[#ede0d2]',
      chapterCardHoverBorder: 'hover:border-[#d7b899]',
      chapterCardHoverText: 'group-hover:text-[#765135]',
      chapterReadArrow: 'text-[#9c7556]',
      extraChapterBadge: 'bg-[#f4e9dc] text-[#6a4c35] border-[#e2ceba]',
      commentsHeaderIcon: 'text-[#997253]',
      commentsHeaderText: 'text-[#61422b]',
      commentsBadge: 'text-[#997d65]',
      commentFormBg: 'bg-[#f9f4ed]',
      commentFormBorder: 'border-[#ecddcf]',
      commentInputBg: 'bg-white',
      commentInputBorder: 'border-[#e6d6c4]',
      commentBtn: 'bg-[#d7b899] hover:bg-[#caa785] text-[#341f0f]',
      commentItemBg: 'bg-[#f9f4ed]',
      commentItemBorder: 'border-[#ede0d2]',
      commentAvatarBg: 'bg-[#d7b899] text-[#341f0f]',
      editorNoteBg: 'bg-[#f7f1e9]',
      editorNoteBorder: 'border-[#ecddcf]',
      editorNoteTitle: 'text-[#61422b]',
      editorNoteIcon: 'text-[#997253]',
      relatedHeaderIcon: 'text-[#997253]',
      relatedHeaderText: 'text-[#61422b]',
      relatedCardBg: 'bg-[#f9f4ed]',
      relatedCardBorder: 'border-[#ede0d2]',
      relatedCardHoverBorder: 'hover:border-[#d7b899]',
      relatedCardHoverTitle: 'group-hover:text-[#765135]',
      relatedLinkText: 'text-[#997253]',
      footerBorder: 'border-[#ebdccd]',
      footerText: 'text-[#967a63]',
      washiTape: 'bg-[#eedecf]/90 border-[#dcc5b0]',
      heartIcon: 'text-[#ad8665] fill-[#f0decb]/60',
      chapterScrollbar: '[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-[#f7efe6] [&::-webkit-scrollbar-thumb]:bg-[#d6bc9f]/60 hover:[&::-webkit-scrollbar-thumb]:bg-[#c2a282]/80 [&::-webkit-scrollbar-thumb]:rounded-full [scrollbar-color:rgba(214,188,159,0.6)_transparent] [scrollbar-width:thin]',
    };
  }

  // 6. DEFAULT / AMETHYST-HAZE (Purple)
  if (isDark) {
    return {
      themeName: 'TÍM AMETHYST',
      bannerBadge: 'text-purple-300 bg-purple-950/60 border-purple-800/60',
      bannerBadgeIcon: 'text-purple-400 fill-purple-500/40',
      bannerTitle: 'text-purple-100',
      bannerDivider: 'bg-gradient-to-r from-purple-500 via-pink-400 to-indigo-400',
      coverBg: 'bg-[#171224]',
      coverBorder: 'border-purple-900/60',
      coverShadow: 'shadow-[0_20px_60px_rgba(147,51,234,0.18)]',
      ringsGradient: 'bg-gradient-to-r from-purple-400/80 via-pink-300/80 to-purple-500/80',
      ringsBorder: 'border-purple-400/50',
      holesBg: 'bg-[#0e0a16]',
      holesBorder: 'border-purple-900/60',
      paperBg: 'bg-[#120e1b]',
      paperBorder: 'border-purple-900/50',
      paperText: 'text-purple-100',
      dashedBorder: 'border-purple-900/40',
      plannerBadgeBg: 'bg-purple-950/80',
      plannerBadgeText: 'text-purple-300',
      plannerBadgeBorder: 'border-purple-800/70',
      dateText: 'text-purple-400/80',
      rulerText: 'text-purple-400/80',
      rulerBg: 'bg-purple-950/50',
      rulerBorder: 'border-purple-900/50',
      overviewBg: 'bg-[#191426]',
      overviewBorder: 'border-purple-900/60',
      binderClip: 'bg-purple-500 border-purple-400',
      statusBadge: 'bg-purple-950/90 text-purple-200',
      cardInnerBg: 'bg-stone-900/90',
      cardInnerBorder: 'border-purple-900/50',
      iconAccent: 'text-purple-400',
      subIconAccent: 'text-pink-400',
      tagPill: 'bg-purple-950/60 text-purple-300 border-purple-900 hover:border-purple-700',
      primaryBtn: 'bg-gradient-to-r from-purple-600 via-purple-500 to-pink-600 text-white shadow-purple-900/40',
      bookmarkBtn: 'bg-stone-900 text-stone-200 border-purple-900 hover:border-purple-700',
      likeBtn: 'bg-stone-900 text-rose-400 border-purple-900 hover:border-rose-700',
      synopsisHeaderIcon: 'text-purple-400',
      synopsisHeaderText: 'text-purple-300',
      synopsisBorderLeft: 'border-purple-500/80',
      loreBoxBg: 'bg-purple-950/30',
      loreBoxBorder: 'border-purple-800/40',
      loreTitleText: 'text-purple-300',
      loreIconText: 'text-purple-400',
      loreBodyText: 'text-stone-300',
      chaptersHeaderIcon: 'text-purple-400',
      chaptersHeaderText: 'text-purple-300',
      chaptersBadge: 'bg-purple-950/60 text-purple-300 border-purple-800/50',
      inputBg: 'bg-stone-900',
      inputBorder: 'border-stone-700',
      inputFocus: 'focus:border-purple-400',
      inputText: 'text-purple-100',
      chapterCardBg: 'bg-stone-900/80',
      chapterCardBorder: 'border-stone-800',
      chapterCardHoverBorder: 'hover:border-purple-400',
      chapterCardHoverText: 'group-hover:text-purple-400',
      chapterReadArrow: 'text-purple-400',
      extraChapterBadge: 'bg-purple-950/70 text-purple-300 border-purple-800',
      commentsHeaderIcon: 'text-purple-400',
      commentsHeaderText: 'text-purple-300',
      commentsBadge: 'text-stone-400',
      commentFormBg: 'bg-stone-900',
      commentFormBorder: 'border-stone-700',
      commentInputBg: 'bg-stone-800',
      commentInputBorder: 'border-stone-700',
      commentBtn: 'bg-purple-600 hover:bg-purple-500 text-white',
      commentItemBg: 'bg-stone-900/80',
      commentItemBorder: 'border-stone-800',
      commentAvatarBg: 'bg-purple-600 text-white',
      editorNoteBg: 'bg-purple-950/30',
      editorNoteBorder: 'border-purple-800/40',
      editorNoteTitle: 'text-purple-300',
      editorNoteIcon: 'text-purple-400',
      relatedHeaderIcon: 'text-purple-400',
      relatedHeaderText: 'text-purple-300',
      relatedCardBg: 'bg-stone-900',
      relatedCardBorder: 'border-stone-800',
      relatedCardHoverBorder: 'hover:border-purple-400',
      relatedCardHoverTitle: 'group-hover:text-purple-400',
      relatedLinkText: 'text-purple-400',
      footerBorder: 'border-purple-900/50',
      footerText: 'text-stone-400',
      washiTape: 'bg-purple-900/60 border-purple-700/60',
      heartIcon: 'text-purple-400 fill-purple-400/50',
      chapterScrollbar: '[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-purple-950/20 [&::-webkit-scrollbar-thumb]:bg-purple-500/50 hover:[&::-webkit-scrollbar-thumb]:bg-purple-400/80 [&::-webkit-scrollbar-thumb]:rounded-full [scrollbar-color:rgba(168,85,247,0.5)_transparent] [scrollbar-width:thin]',
    };
  }

  // Light mode Amethyst (Tím Pastel Oải Hương & Khoai Môn Dịu Ngọt)
  return {
    themeName: 'TÍM PASTEL OẢI HƯƠNG',
    bannerBadge: 'text-[#684b8c] bg-[#f2eafc] border-[#dfcef5] shadow-xs',
    bannerBadgeIcon: 'text-[#9273b8] fill-[#e4d4f8]',
    bannerTitle: 'text-[#37284d]',
    bannerDivider: 'bg-gradient-to-r from-[#dfcef5] via-[#b89cd9] to-[#dfcef5]',
    coverBg: 'bg-[#f6f0fc]',
    coverBorder: 'border-[#e4d5f4]',
    coverShadow: 'shadow-[0_16px_45px_rgba(155,124,194,0.12)]',
    ringsGradient: 'bg-gradient-to-r from-[#d8c5ed] via-[#f8f2fd] to-[#d8c5ed]',
    ringsBorder: 'border-[#cbb3e6]',
    holesBg: 'bg-[#e9dcf5]',
    holesBorder: 'border-[#d8c5ed]',
    paperBg: 'bg-[#ffffff]',
    paperBorder: 'border-[#ebddf8]',
    paperText: 'text-[#37284d]',
    dashedBorder: 'border-[#e6d6f5]',
    plannerBadgeBg: 'bg-[#f0e5fa]',
    plannerBadgeText: 'text-[#624584]',
    plannerBadgeBorder: 'border-[#ddccf2]',
    dateText: 'text-[#8369a3]',
    rulerText: 'text-[#947cb3]',
    rulerBg: 'bg-[#f7f0fd]',
    rulerBorder: 'border-[#e8dbf7]',
    overviewBg: 'bg-[#fbf7fe]',
    overviewBorder: 'border-[#eadcf7]',
    binderClip: 'bg-[#a98cc9] border-[#9779b8]',
    statusBadge: 'bg-[#ebdcf8] text-[#553b75] border border-[#d9c4ee]',
    cardInnerBg: 'bg-[#faf6fe]',
    cardInnerBorder: 'border-[#ebdff7]',
    iconAccent: 'text-[#8766ac]',
    subIconAccent: 'text-[#aa8ccf]',
    tagPill: 'bg-[#f5ecfc] text-[#593d79] border-[#e2d0f5] hover:border-[#b89cd9]',
    primaryBtn: 'bg-[#ba9fd9] hover:bg-[#aa8bcb] text-[#2c1a42] font-black shadow-md shadow-[#ba9fd9]/25',
    bookmarkBtn: 'bg-white text-[#4a3961] border-[#e0cff4] hover:border-[#ba9fd9]',
    likeBtn: 'bg-white text-[#d65f80] border-[#f2d0db] hover:border-[#d65f80]',
    synopsisHeaderIcon: 'text-[#8766ac]',
    synopsisHeaderText: 'text-[#583d77]',
    synopsisBorderLeft: 'border-[#baa0da]',
    loreBoxBg: 'bg-[#f8f2fd]',
    loreBoxBorder: 'border-[#ecdff7]',
    loreTitleText: 'text-[#4a3366]',
    loreIconText: 'text-[#8766ac]',
    loreBodyText: 'text-[#4c3a63]',
    chaptersHeaderIcon: 'text-[#8766ac]',
    chaptersHeaderText: 'text-[#583d77]',
    chaptersBadge: 'bg-[#f0e5fa] text-[#5c407c] border-[#dfcdf4]',
    inputBg: 'bg-[#fcfaff]',
    inputBorder: 'border-[#e3d3f5]',
    inputFocus: 'focus:border-[#ba9fd9]',
    inputText: 'text-[#37284d]',
    chapterCardBg: 'bg-[#fbf7fe]',
    chapterCardBorder: 'border-[#ebddf7]',
    chapterCardHoverBorder: 'hover:border-[#ba9fd9]',
    chapterCardHoverText: 'group-hover:text-[#6a4c8f]',
    chapterReadArrow: 'text-[#8f70b4]',
    extraChapterBadge: 'bg-[#f0e5fa] text-[#634685] border-[#ddccf2]',
    commentsHeaderIcon: 'text-[#8766ac]',
    commentsHeaderText: 'text-[#583d77]',
    commentsBadge: 'text-[#8e76ac]',
    commentFormBg: 'bg-[#faf5fe]',
    commentFormBorder: 'border-[#eadcf7]',
    commentInputBg: 'bg-white',
    commentInputBorder: 'border-[#e2d1f4]',
    commentBtn: 'bg-[#ba9fd9] hover:bg-[#aa8bcb] text-[#2c1a42]',
    commentItemBg: 'bg-[#faf6fe]',
    commentItemBorder: 'border-[#ebdff7]',
    commentAvatarBg: 'bg-[#ba9fd9] text-[#2c1a42]',
    editorNoteBg: 'bg-[#f8f2fd]',
    editorNoteBorder: 'border-[#ecdff7]',
    editorNoteTitle: 'text-[#583d77]',
    editorNoteIcon: 'text-[#8766ac]',
    relatedHeaderIcon: 'text-[#8766ac]',
    relatedHeaderText: 'text-[#583d77]',
    relatedCardBg: 'bg-[#faf6fe]',
    relatedCardBorder: 'border-[#ebdff7]',
    relatedCardHoverBorder: 'hover:border-[#ba9fd9]',
    relatedCardHoverTitle: 'group-hover:text-[#6a4c8f]',
    relatedLinkText: 'text-[#8766ac]',
    footerBorder: 'border-[#e8daf6]',
    footerText: 'text-[#8a74a6]',
    washiTape: 'bg-[#ebd8f8]/90 border-[#d7bdf0]',
    heartIcon: 'text-[#9f80c4] fill-[#dfcef5]/60',
    chapterScrollbar: '[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-[#f4ecfa] [&::-webkit-scrollbar-thumb]:bg-[#caa9e8]/60 hover:[&::-webkit-scrollbar-thumb]:bg-[#b592d6]/80 [&::-webkit-scrollbar-thumb]:rounded-full [scrollbar-color:rgba(202,169,232,0.6)_transparent] [scrollbar-width:thin]',
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
          linear-gradient(90deg, rgba(203, 213, 225, 0.16) 16px, transparent 16px),
          linear-gradient(0deg, rgba(203, 213, 225, 0.16) 16px, transparent 16px)
        `,
        backgroundSize: '32px 32px, 32px 32px, 64px 64px, 64px 64px',
      };
    case 'slate-haze': // Frost: Xanh Mây Baby Pastel Dịu Mát
      return {
        backgroundColor: '#f4f8fd',
        backgroundImage: `
          linear-gradient(90deg, rgba(147, 197, 253, 0.30) 1px, transparent 1px),
          linear-gradient(0deg, rgba(147, 197, 253, 0.30) 1px, transparent 1px),
          linear-gradient(90deg, rgba(191, 219, 254, 0.18) 16px, transparent 16px),
          linear-gradient(0deg, rgba(191, 219, 254, 0.18) 16px, transparent 16px)
        `,
        backgroundSize: '32px 32px, 32px 32px, 64px 64px, 64px 64px',
      };
    case 'sage': // Sage: Trà Sữa Matcha Pastel Dịu Ngọt
      return {
        backgroundColor: '#f5f9f4',
        backgroundImage: `
          linear-gradient(90deg, rgba(167, 209, 163, 0.32) 1px, transparent 1px),
          linear-gradient(0deg, rgba(167, 209, 163, 0.32) 1px, transparent 1px),
          linear-gradient(90deg, rgba(198, 228, 195, 0.18) 16px, transparent 16px),
          linear-gradient(0deg, rgba(198, 228, 195, 0.18) 16px, transparent 16px)
        `,
        backgroundSize: '32px 32px, 32px 32px, 64px 64px, 64px 64px',
      };
    case 'mocha': // Linen: Trà Sữa Caramel Pastel Dịu Ngọt
      return {
        backgroundColor: '#fbf7f2',
        backgroundImage: `
          linear-gradient(90deg, rgba(214, 185, 160, 0.30) 1px, transparent 1px),
          linear-gradient(0deg, rgba(214, 185, 160, 0.30) 1px, transparent 1px),
          linear-gradient(90deg, rgba(235, 215, 196, 0.18) 16px, transparent 16px),
          linear-gradient(0deg, rgba(235, 215, 196, 0.18) 16px, transparent 16px)
        `,
        backgroundSize: '32px 32px, 32px 32px, 64px 64px, 64px 64px',
      };
    case 'cosmic': // Cosmic: Cực Quang Ngân Hà Pastel
      return {
        backgroundColor: '#fbf7ff',
        backgroundImage: `
          linear-gradient(90deg, rgba(232, 166, 244, 0.28) 1px, transparent 1px),
          linear-gradient(0deg, rgba(180, 166, 244, 0.28) 1px, transparent 1px),
          linear-gradient(90deg, rgba(244, 198, 235, 0.18) 16px, transparent 16px),
          linear-gradient(0deg, rgba(210, 198, 248, 0.18) 16px, transparent 16px)
        `,
        backgroundSize: '32px 32px, 32px 32px, 64px 64px, 64px 64px',
      };
    case 'amethyst-haze': // Purple: Tím Oải Hương / Amethyst Pastel Dịu Ngọt (Đồng bộ chuẩn theme)
    default:
      return {
        backgroundColor: '#faf6fe',
        backgroundImage: `
          linear-gradient(90deg, rgba(186, 147, 230, 0.28) 1px, transparent 1px),
          linear-gradient(0deg, rgba(186, 147, 230, 0.28) 1px, transparent 1px),
          linear-gradient(90deg, rgba(224, 204, 247, 0.20) 16px, transparent 16px),
          linear-gradient(0deg, rgba(224, 204, 247, 0.20) 16px, transparent 16px)
        `,
        backgroundSize: '32px 32px, 32px 32px, 64px 64px, 64px 64px',
      };
  }
}

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
    if (!newCommentText.trim()) return;
    onPostComment(userName.trim() || 'Độc giả ẩn danh', newCommentText.trim());
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

      {/* ================= TOÀN BỘ CUỐN SỔ CÒNG XOẮN ================= */}
      <div className="w-[calc(100%-14px)] sm:w-full ml-3.5 sm:ml-0 mr-1 sm:mr-0 relative">
        {/* BÌA CỨNG NGOÀI (SOFT HARDCOVER: CẢ 4 GÓC ĐỀU BO TRÒN NHIỀU) */}
        <div className={`w-full relative rounded-3xl sm:rounded-[36px] ${sTheme.coverBg} p-2.5 sm:p-6 md:p-8 ${sTheme.coverShadow} border sm:border-2 ${sTheme.coverBorder} transition-all duration-300`}>
          
          {/* CỘT CÒNG LÒ XO KIM LOẠI 3D NẰM BÊN MÉP TRÁI */}
          <div className="absolute -left-3 sm:-left-4.5 top-6 sm:top-8 bottom-6 sm:bottom-8 w-6 sm:w-9 flex flex-col justify-between items-center pointer-events-none z-30 select-none">
            {Array.from({ length: 28 }).map((_, i) => (
              <div key={i} className="relative w-full h-4 flex items-center">
                {/* Lỗ đục giấy tròn */}
                <div className={`w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full ${sTheme.holesBg} border ${sTheme.holesBorder} shadow-inner -ml-0.5 sm:-ml-1 transition-colors duration-300`} />
                {/* Vòng kim loại xoắn nối 3D */}
                <div className={`flex-1 h-1.5 sm:h-2 rounded-full ${sTheme.ringsGradient} shadow-sm border ${sTheme.ringsBorder} transition-all duration-300`} />
              </div>
            ))}
          </div>

          {/* TRANG GIẤY RUỘT TRONG CUỐN SỔ (CẢ 4 GÓC BO TRÒN NHIỀU, PADDING RỘNG RÃI TRÁNH SÁT MÉP) */}
          <div className={`relative z-10 rounded-2xl sm:rounded-[26px] ${sTheme.paperBg} ${sTheme.paperText} border ${sTheme.paperBorder} p-4 sm:p-7 md:p-9 pl-5 sm:pl-8 shadow-inner flex flex-col justify-between transition-colors duration-300`}>
            <div className="space-y-6">
              
              {/* HEADER SỔ: Nhãn Planner */}
              <div className={`flex items-center justify-between gap-3 border-b-2 border-dashed ${sTheme.dashedBorder} pb-4 transition-colors duration-300`}>
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
                        ? 'bg-[#15161C] border-zinc-700'
                        : `bg-white ${sTheme.cardInnerBorder} shadow-[0_8px_24px_rgba(0,0,0,0.04)]`
                    }`}
                  >
                    {/* Băng dán washi tape góc trên trang trí theo theme */}
                    <div className={`absolute -top-2.5 left-1/2 -translate-x-1/2 w-16 h-4.5 ${sTheme.washiTape} border rounded-xs -rotate-1 pointer-events-none backdrop-blur-2xs shadow-xs transition-colors duration-300`} />

                    <div className="aspect-[3/4.2] w-full rounded-xl overflow-hidden bg-stone-100 dark:bg-zinc-800 relative group">
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
                      <div className={`flex items-start gap-1.5 p-2.5 rounded-xl ${sTheme.cardInnerBg} border ${sTheme.cardInnerBorder} shadow-2xs transition-colors`}>
                        <span className="opacity-70 shrink-0">Tác giả:</span>
                        <strong className="break-words leading-snug">{novel.author.name}</strong>
                      </div>

                      <div className={`flex items-start gap-1.5 p-2.5 rounded-xl ${sTheme.cardInnerBg} border ${sTheme.cardInnerBorder} shadow-2xs transition-colors`}>
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
                  <div className={`flex items-center justify-between border-b-2 border-dashed ${sTheme.dashedBorder} pb-2`}>
                    <span className={`text-xs sm:text-[13px] font-mono font-black uppercase tracking-widest ${sTheme.synopsisHeaderText} flex items-center gap-1.5`}>
                      <FileText className={`w-4 h-4 ${sTheme.synopsisHeaderIcon}`} />
                      <span>GIỚI THIỆU</span>
                    </span>
                    <span className="text-[10px] sm:text-[11px] font-mono opacity-60">{effectiveChapters.length} chương</span>
                  </div>

                  <div className="space-y-3.5 text-[17px] sm:text-[19px] leading-[1.7]">
                    {(novel.synopsis || '').split('\n\n').map((para, idx) => (
                      <p key={idx}>
                        {para.trim()}
                      </p>
                    ))}
                  </div>

                  {/* Thiết lập nhân vật (đã đổi tên từ Thiết lập thế giới và bỏ icon) */}
                  {(effectiveWorldLore || novel.worldLore) && (
                    <div className={`p-4 rounded-xl ${sTheme.loreBoxBg} border ${sTheme.loreBoxBorder} space-y-1.5 transition-colors duration-300`}>
                      <span className={`text-xs sm:text-[13px] font-bold ${sTheme.loreTitleText} block`}>
                        <span>Thiết lập nhân vật:</span>
                      </span>
                      <p className={`text-[15px] sm:text-[16px] ${sTheme.loreBodyText} leading-relaxed whitespace-pre-line`}>
                        {effectiveWorldLore || novel.worldLore}
                      </p>
                    </div>
                  )}
                </div>

                {/* 2. MỤC LỤC */}
                <div className={`space-y-4 pt-4 border-t-2 border-dashed ${sTheme.dashedBorder}`}>
                  <div className={`flex items-center justify-between border-b-2 border-dashed ${sTheme.dashedBorder} pb-2`}>
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
                <div className={`space-y-4 pt-4 border-t-2 border-dashed ${sTheme.dashedBorder}`}>
                  <div className={`flex items-center justify-between border-b-2 border-dashed ${sTheme.dashedBorder} pb-2`}>
                    <span className={`text-xs sm:text-[13px] font-mono font-black uppercase tracking-widest ${sTheme.commentsHeaderText} flex items-center gap-1.5`}>
                      <MessageSquare className={`w-4 h-4 ${sTheme.commentsHeaderIcon}`} />
                      <span>BÌNH LUẬN</span>
                    </span>
                    <span className={`text-[10px] font-mono ${sTheme.commentsBadge}`}>GHI CHÚ DÁN TRONG SỔ</span>
                  </div>

                  {/* Form viết bình luận */}
                  <form onSubmit={handleSubmitComment} className={`p-4 sm:p-5 rounded-2xl ${sTheme.commentFormBg} border ${sTheme.commentFormBorder} space-y-3 shadow-2xs transition-colors`}>
                    <span className={`text-xs sm:text-[13px] font-mono font-black tracking-wider uppercase ${sTheme.commentsHeaderText} block`}>
                      ĐỂ LẠI GHI CHÚ BÌNH LUẬN TRONG SỔ:
                    </span>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Tên hoặc biệt danh của bạn..."
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
                      <div className={`p-4 text-center text-xs sm:text-[13px] opacity-60 font-source-sans italic rounded-xl border border-dashed ${sTheme.dashedBorder}`}>
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
                                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-semibold bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/25">
                                  Chương {cm.chapterNumber}
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] font-mono opacity-60">{normalizeCommentDate(cm.createdAt)}</span>
                          </div>
                          <p className="text-[13px] sm:text-sm opacity-90 leading-relaxed pl-9">
                            {cm.content}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* 4. HỒ SƠ EDITOR - LƯU Ý */}
                <div className={`pt-4 border-t-2 border-dashed ${sTheme.dashedBorder}`}>
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
                  <div className={`pt-4 border-t-2 border-dashed ${sTheme.dashedBorder} space-y-3`}>
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
  );
};
