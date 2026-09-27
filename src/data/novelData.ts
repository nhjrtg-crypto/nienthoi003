import { Novel } from '../types';
import { LUA_NHAU_NOVEL } from './luaNhauData';
import { TRUC_MA_ALPHA_NOVEL } from './trucMaAlphaData';
import { ME_KE_VUA_MEM_VUA_NGOT_NOVEL } from './meKeVuaMemVuaNgotData';

export const NOVEL_GENRES = [
  { id: 'all', name: 'Tất Cả Thể Loại', icon: 'Sparkles', color: 'from-purple-500 to-pink-500' },
  { id: 'dam-my', name: 'Đam Mỹ', icon: 'Sparkles', color: 'from-pink-500 to-rose-500' },
  { id: 'khoa-huyen', name: 'Khoa Huyễn Vũ Trụ', icon: 'Rocket', color: 'from-cyan-500 to-blue-500' },
  { id: 'tien-hiep-tinh-khong', name: 'Tiên Hiệp Tinh Không', icon: 'Compass', color: 'from-purple-500 to-indigo-500' },
  { id: 'co-giap', name: 'Cơ Giáp Tinh Chiến', icon: 'Cpu', color: 'from-amber-500 to-rose-500' },
  { id: 'huyen-huyen-tinh-te', name: 'Huyền Huyễn Tinh Tế', icon: 'Flame', color: 'from-pink-500 to-purple-600' },
  { id: 'khong-gian-sinh-ton', name: 'Không Gian Sinh Tồn', icon: 'Shield', color: 'from-emerald-500 to-teal-500' },
  { id: 'vong-du-thien-the', name: 'Võng Du Thiên Thể', icon: 'Zap', color: 'from-blue-500 to-violet-500' },
];

export const INITIAL_NOVELS: Novel[] = [
  LUA_NHAU_NOVEL,
  TRUC_MA_ALPHA_NOVEL,
  ME_KE_VUA_MEM_VUA_NGOT_NOVEL,
];
