import { Novel } from '../types';
import { LUA_NHAU_NOVEL } from './luaNhauData';
import { TRUC_MA_ALPHA_NOVEL } from './trucMaAlphaData';
import { ME_KE_VUA_MEM_VUA_NGOT_NOVEL } from './meKeVuaMemVuaNgotData';
import { CHIEM_HUU_CUC_DO_Q1_NOVEL } from './chiemHuuCucDoQ1Data';
import { CHIEM_HUU_CUC_DO_Q2_NOVEL } from './chiemHuuCucDoQ2Data';
import { BI_NAM_CHINH_CUONG_EP_YEU_NOVEL } from './biNamChinhCuongEpYeuData';
import { NGUNG_DONG_THOI_GIAN_NOVEL } from './ngungDongThoiGianData';
import { VO_DEP_QUYEN_RU_TOI_NOVEL } from './voDepQuyenRuToiData';
import { GAP_DOI_LUAN_HAM_NOVEL } from './gapDoiLuanHamData';
import { KE_NHA_GIAU_NGU_XUAN_NOVEL } from './keNhaGiauNguXuanData';
import { CUOC_SONG_DAM_LOAN_BO_LAC_NOVEL } from './cuocSongDamLoanBoLacData';
import { THAI_HAU_XINH_DEP_NOVEL } from './thaiHauXinhDepData';
import { TU_DUOI_NOVEL } from './tuDuoiData';
import { DAM_LOAN_GIUA_BAN_NGAY_NOVEL } from './damLoanGiuaBanNgayData';
import { BETA_PHAN_HOA_LAN_HAI_NOVEL } from './betaPhanHoaLanHaiData';
import { KE_THU_PHAT_HIEN_VU_NOVEL } from './keThuPhatHienVuData';
import { HE_THONG_THOI_MIEN_NOVEL } from './heThongThoiMienData';
import { SERIES_NTR_CAM_DO_NOVEL } from './seriesNtrCamDoData';

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
  CHIEM_HUU_CUC_DO_Q1_NOVEL,
  CHIEM_HUU_CUC_DO_Q2_NOVEL,
  BI_NAM_CHINH_CUONG_EP_YEU_NOVEL,
  NGUNG_DONG_THOI_GIAN_NOVEL,
  VO_DEP_QUYEN_RU_TOI_NOVEL,
  GAP_DOI_LUAN_HAM_NOVEL,
  KE_NHA_GIAU_NGU_XUAN_NOVEL,
  CUOC_SONG_DAM_LOAN_BO_LAC_NOVEL,
  THAI_HAU_XINH_DEP_NOVEL,
  TU_DUOI_NOVEL,
  DAM_LOAN_GIUA_BAN_NGAY_NOVEL,
  BETA_PHAN_HOA_LAN_HAI_NOVEL,
  KE_THU_PHAT_HIEN_VU_NOVEL,
  HE_THONG_THOI_MIEN_NOVEL,
  SERIES_NTR_CAM_DO_NOVEL,
];
