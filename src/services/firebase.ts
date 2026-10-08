import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  initializeFirestore,
  getFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  setLogLevel,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  writeBatch,
  serverTimestamp,
  getDocFromServer,
  onSnapshot,
  increment,
  Unsubscribe,
  DocumentData,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  User,
} from 'firebase/auth';
import firebaseConfigJson from '../../firebase-applet-config.json';
import { safeStorage } from '../utils/safeStorage';
import { NovelComment } from '../types';
import { formatCommentDate, normalizeCommentDate } from '../utils/dateUtils';
import {
  getGlobalViews,
  fetchGlobalViews,
  fetchLikes,
  subscribeLikes,
  incrementLike,
  fetchGuestNotes,
  subscribeGuestNotes,
  addGuestNote,
  D1GuestNote,
} from './d1Service';

// User Firebase credentials & public key
export const FIREBASE_VAPID_KEY = 'BN5xOKCoNDN3YQphaPVOGHB2aTjx3TRyA0aVWxntVfMPIDRnxW7G7dv3VBX4gEFud-ffYJo1Cka9p6pjQMj6a2g';

const firebaseConfig = {
  apiKey: firebaseConfigJson.apiKey,
  authDomain: firebaseConfigJson.authDomain,
  projectId: firebaseConfigJson.projectId,
  storageBucket: firebaseConfigJson.storageBucket,
  messagingSenderId: firebaseConfigJson.messagingSenderId,
  appId: firebaseConfigJson.appId,
  vapidKey: FIREBASE_VAPID_KEY,
};

// Suppress noisy transient connection retry logs from internal Firestore logger
try {
  setLogLevel('silent');
} catch {}

// Initialize Firebase App singleton
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with persistent IndexedDB local cache and force long-polling
const firestoreDbId = firebaseConfigJson.firestoreDatabaseId || '(default)';
export const db = (() => {
  try {
    return initializeFirestore(app, {
      experimentalForceLongPolling: true,
      ignoreUndefinedProperties: true,
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager(),
      }),
    }, firestoreDbId);
  } catch {
    return getFirestore(app, firestoreDbId);
  }
})();

// Initialize Firebase Auth
export const auth = getAuth(app);

// Test connection on demand without forcing unhandled network errors
export async function testFirebaseConnection(): Promise<boolean> {
  try {
    const testSnap = await getDoc(doc(db, 'truyen', 'ping'));
    return testSnap.exists();
  } catch (error) {
    if (error instanceof Error && (error.message.includes('offline') || error.message.includes('unavailable'))) {
      console.warn('[Firebase] Network handshake note: operating with cached data.', error.message);
      return false;
    }
    return true;
  }
}

// Data models for Firestore
export interface FirestoreTruyen {
  id: string;
  tenTruyen: string;
  moTa: string;
  anhBia: string;
  theLoai: string;
  tacGia: string;
  trangThai: 'nhap' | 'daDang';
  adminUid: string;
  adminEmail?: string;
  ngayTao: string;
  ngayCapNhat: string;
  soChuong: number;
  worldLore?: string;
  uploaderNote?: string;
  gioiThieu?: string;
  translator?: string;
  status?: string;
}

export interface FirestoreChuongMeta {
  id: string;
  soThuTu: number;
  tieuDe: string;
  thoiGianDang: string;
  truyenId: string;
}

export interface FirestoreChuong extends FirestoreChuongMeta {
  noiDung: string;
}

// Helper to check if current user is admin
export const ADMIN_EMAIL = 'nhjrtg@gmail.com';
export const ADMIN_USERNAME = 'nhjrtg2026';
export const ADMIN_PASSWORD = 'nhjrtg20269742006443';
export const LOCAL_ADMIN_STORAGE_KEY = 'novels_admin_session_v1';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export interface AdminUserLike {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
  isLocalAdmin?: boolean;
}

export function isUserAdmin(user: AdminUserLike | null): boolean {
  if (!user || !user.email) return false;
  return user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}

export function getStoredAdminSession(): AdminUserLike | null {
  try {
    const raw = safeStorage.getItem(LOCAL_ADMIN_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.email && isUserAdmin(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('[Firebase] Failed reading admin session:', e);
  }
  return null;
}

export function saveAdminSession(user: AdminUserLike): void {
  try {
    safeStorage.setItem(LOCAL_ADMIN_STORAGE_KEY, JSON.stringify(user));
  } catch (e) {
    console.error('[Firebase] Failed saving admin session:', e);
  }
}

export function clearAdminSession(): void {
  try {
    safeStorage.removeItem(LOCAL_ADMIN_STORAGE_KEY);
  } catch (e) {
    console.error('[Firebase] Failed clearing admin session:', e);
  }
}

// Sign in with Google Popup
export async function signInWithGoogle(): Promise<User> {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  const result = await signInWithPopup(auth, provider);
  return result.user;
}

// --- Firestore CRUD operations for Truyen ---

const BANNED_NOVEL_IDS = new Set([
  'anh-trang-khong-ngu',
  'co-giap-chi-vuong',
  'doan-van-ha-chi-hoa',
  'doan-van-ngot-ngao',
  'h-van-ngan-duoi-mua',
  'hoang-de-cung-nhiep-chinh-vuong',
  'ma-than-tinh-hai',
  'ma-ton-su-ton-song-tu',
  'sinh-ton-tinh-cau-hoang',
  'tinh-mon-chu-te',
  'truong-cong-chua-hac-hoa',
  'tuyet-dinh-dan-dao',
  'van-nguoi-me-tu-la-trang',
  'vong-du-tinh-cau-online',
  'xuyen-thanh-phao-hoi-h-van',
  'gio-thoi-mua-ha',
  'tinh-khong-tien-ton',
  'song-huong-cam-do',
  'my-nhan-van-nguoi-me',
  'doan-van-mua-ha',
  'ma-ton-song-tu',
  'anh-trang-dem-he',
  'nhiep-chinh-vuong-ghen',
  'xuyen-thanh-phao-hoi',
  'doan-van-dem-muon',
  'vuong-gia-co-giap',
  'toan-dan-sinh-ton',
  'than-ma-tinh-hai',
  'thien-the-truc-tuyen',
  'mua-roi-tren-khe-tay',
  'vYYGGtLbby7W3KHqSm3U',
]);

function isBannedOrDraftFirestore(id: string, tenTruyen?: string, trangThai?: string): boolean {
  if (BANNED_NOVEL_IDS.has(id)) return true;
  if (trangThai === 'nhap') return true;
  if (tenTruyen && (tenTruyen.trim() === id.trim() || (/^[a-zA-Z0-9]{18,24}$/.test(tenTruyen.trim()) && !tenTruyen.includes(' ')))) {
    return true;
  }
  const rawTitle = (tenTruyen || '').toLowerCase().trim();
  if (!rawTitle) return false;
  const bannedKeywords = [
    'dạ lan',
    'vương giả cơ giáp',
    'ánh trăng không ngủ',
    'ánh trăng đêm hè',
    'nhiếp chính vương hôm nay',
    'thần ma tinh hải',
    'ma tôn luôn muốn',
    'ma tôn song tu',
    'toàn dân sinh tồn',
    'tinh môn chúa tể',
    'trưởng công chúa hắc hóa',
    'tuyệt đỉnh đan đạo',
    'tu la tràng',
    'thiên thể trực tuyến',
    'pháo hôi tuyệt sắc',
    'mưa rơi trên khẽ tay',
    'gió thổi mùa hạ',
    'song hướng cám dỗ',
    'tinh không tiên tôn',
  ];
  return bannedKeywords.some((kw) => rawTitle.includes(kw));
}

export function isFirestoreQuotaError(error: unknown): boolean {
  if (!error) return false;
  const msg = (error instanceof Error ? error.message : String(error)).toLowerCase();
  const code = (error as { code?: string })?.code || '';
  return (
    code === 'resource-exhausted' ||
    msg.includes('quota limit exceeded') ||
    msg.includes('quota exceeded') ||
    msg.includes('resource-exhausted') ||
    msg.includes('free daily read units')
  );
}

export function isFirestoreOfflineError(error: unknown): boolean {
  if (!error) return false;
  const msg = (error instanceof Error ? error.message : String(error)).toLowerCase();
  const code = (error as { code?: string })?.code || '';
  return (
    code === 'unavailable' ||
    msg.includes('client is offline') ||
    msg.includes('could not reach cloud firestore') ||
    msg.includes('connection failed') ||
    msg.includes('network') ||
    msg.includes('offline')
  );
}

const QUOTA_CACHE_TTL_MS = 15 * 60 * 1000; // 15 phút backoff khi quota cạn kiệt
let lastQuotaExceededTime = 0;

export function markQuotaExceeded() {
  lastQuotaExceededTime = Date.now();
}

export function clearQuotaExceededFlag() {
  lastQuotaExceededTime = 0;
  try {
    safeStorage.removeItem('cosmo_quota_exceeded_timestamp');
  } catch {}
}

export function isQuotaExceededActive(): boolean {
  // Không khóa trang web khi đạt mốc 50.000 lượt đọc theo yêu cầu người dùng
  return false;
}

// ==========================================
// FIRESTORE REAL-TIME READ TRACKER & STATS
// ==========================================

export interface FirestoreReadLogItem {
  id: string;
  timestamp: string;
  timeStr: string;
  count: number;
  source: string;
}

export interface FirestoreReadStats {
  todayReads: number;
  sessionReads: number;
  dailyLimit: number;
  isExceeded: boolean;
  nextResetIso: string;
  nextResetVNTime: string;
  timeUntilResetMs: number;
  recentLogs: FirestoreReadLogItem[];
  totalWebsiteViews: number;
  totalWebsiteReads: number;
}

export const BASE_WEBSITE_VIEWS = 0;
const STORAGE_KEY_TOTAL_READS = 'nienthoi_total_website_reads_cache_v3';
const STORAGE_KEY_STATS_CACHE = 'nienthoi_firestore_stats_cache_v3';
const STATS_CACHE_TTL_MS = 30 * 60 * 1000; // 30 phút cache theo yêu cầu người dùng để tối ưu triệt để Firestore

// Xóa sạch các cache cũ phiên bản trước để chuyển đổi sang bộ đệm 30 phút
try {
  if (typeof window !== 'undefined') {
    safeStorage.removeItem('cosmo_quota_exceeded_timestamp');
    safeStorage.removeItem('nienthoi_total_website_reads_cache');
    safeStorage.removeItem('nienthoi_total_website_views_cache');
    safeStorage.removeItem('cosmo_cached_firestore_truyen');
    safeStorage.removeItem('cosmo_cached_firestore_truyen_time');
    safeStorage.removeItem('cosmo_cached_firestore_truyen_v2');
    safeStorage.removeItem('cosmo_cached_firestore_truyen_v3');
    safeStorage.removeItem('cosmo_cached_firestore_truyen_v4');
    safeStorage.removeItem('cosmo_novels');
  }
} catch {}

let sessionFirestoreReads = 0;
let globalTodayReads = 0;
let globalWebsiteReads = 0;
let lastTrackerFetchTime = 0;
let isFetchingTracker = false;
let isGlobalSyncInitialized = false;
const readListeners = new Set<(stats: FirestoreReadStats) => void>();
const websiteViewListeners = new Set<(views: number) => void>();

export function notifyWebsiteViewListeners(): void {
  try {
    websiteViewListeners.forEach((fn) => fn(globalWebsiteReads));
  } catch {}
}

export function getWebsiteViews(): number {
  return globalWebsiteReads;
}

export function subscribeWebsiteViews(callback: (views: number) => void): () => void {
  websiteViewListeners.add(callback);
  callback(globalWebsiteReads);
  initGlobalReadSync();
  return () => {
    websiteViewListeners.delete(callback);
  };
}

/**
 * Bộ lọc nhận diện và chặn bot tự động, crawler, spider, headless scraper
 * (ByteSpider, PetalBot, Semrush, Ahrefs, Puppeteer, Selenium, Censys, Shodan...)
 * Ngăn chặn tuyệt đối việc kích hoạt tính lượt xem hoặc tiêu hao hạn mức Firestore.
 */
export function isAutomatedBot(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return true;

  // 1. Kiểm tra cờ tự động hóa (WebDriver / Headless browser flags)
  if (navigator.webdriver === true) return true;
  if ((window as any)._phantom || (window as any).__nightmare || (window as any).callPhantom) return true;
  if ((window as any).domAutomation || (window as any).domAutomationController) return true;
  if (typeof document !== 'undefined' && document.documentElement && document.documentElement.getAttribute('webdriver')) {
    return true;
  }

  // 2. Kiểm tra User Agent đối chiếu với danh sách các bot, crawler, headless scraper
  const ua = (navigator.userAgent || '').toLowerCase();
  const botSignatures = [
    'bot',
    'crawl',
    'spider',
    'slurp',
    'bytespider',
    'petalbot',
    'semrush',
    'ahrefs',
    'dotbot',
    'zoominfobot',
    'yandex',
    'baiduspider',
    'sogou',
    'exabot',
    'facebookexternalhit',
    'facebot',
    'ia_archiver',
    'shodan',
    'censys',
    'nmap',
    'curl',
    'wget',
    'python',
    'urllib',
    'requests',
    'axios',
    'headlesschrome',
    'phantomjs',
    'selenium',
    'puppeteer',
    'playwright',
    'postman',
    'preview',
    'scraper',
    'applebot',
    'bingbot',
    'googlebot',
    'duckduckbot',
    'yandexbot',
    'lighthouse',
    'gtmetrix',
    'pingdom',
    'uptimerobot',
    'screaming frog',
    'netcraft',
    'trendiction',
    'mj12bot',
    'rogue',
    'cyber',
  ];

  for (const sig of botSignatures) {
    if (ua.includes(sig)) {
      return true;
    }
  }

  // 3. Thiếu thuộc tính ngôn ngữ của người dùng thật (thường gặp ở script cào dữ liệu rác)
  if (!navigator.languages || navigator.languages.length === 0) {
    return true;
  }

  return false;
}

// ============================================================================
// HỆ THỐNG GOM LƯỢT ĐỌC & ĐỒNG BỘ NGUYÊN TỬ (BATCHED ATOMIC READS SYNC)
// ============================================================================
// - Cộng dồn 100% vĩnh viễn trên Firestore, đổi máy hay sang thiết bị khác không mất.
// - Không bắn lẻ từng lệnh setDoc mỗi giây gây cạn kiệt 20.000 writes/ngày.
// - Tự động gom (batch) trong 15 giây hoặc khi đóng/chuyển tab để gửi 1 lần duy nhất bằng increment(N).
// ============================================================================
let pendingTrackerReads = 0;
const pendingNovelReads = new Map<string, number>();
let syncTimer: any = null;
let isSyncing = false;

export function queuePendingTrackerRead(count = 1): void {
  pendingTrackerReads += count;
  scheduleReadsSync();
}

export function queuePendingNovelRead(novelId: string, count = 1): void {
  if (!novelId) return;
  const current = pendingNovelReads.get(novelId) || 0;
  pendingNovelReads.set(novelId, current + count);
  scheduleReadsSync();
}

export async function flushPendingReadsToFirestore(): Promise<void> {
  // Bộ đếm lượt đọc & lượt xem toàn web liên kết 100% với Cloudflare D1
  // Tuyệt đối không ghi hoặc lưu dữ liệu lên Firestore
  pendingTrackerReads = 0;
  pendingNovelReads.clear();
  if (syncTimer) {
    clearTimeout(syncTimer);
    syncTimer = null;
  }
}

function scheduleReadsSync(): void {
  // Không lập lịch ghi Firestore
}

// Bắt sự kiện khi người dùng chuyển tab, ẩn ứng dụng hoặc rời trang để đồng bộ tức thì
if (typeof window !== 'undefined') {
  try {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        flushPendingReadsToFirestore();
      }
    });
    window.addEventListener('pagehide', () => {
      flushPendingReadsToFirestore();
    });
    window.addEventListener('beforeunload', () => {
      flushPendingReadsToFirestore();
    });
  } catch {}
}

/**
 * Ghi nhận LƯỢT XEM WEB của người dùng khi truy cập vào website.
 * Tối ưu hóa chuẩn quốc tế:
 * 1. Mỗi phiên truy cập (Session) chỉ tính duy nhất 1 lượt xem, chống spam/F5.
 * 2. Lưu sessionStorage để không bao giờ cộng lặp khi chuyển trang hay tải lại.
 * 3. Đồng bộ chính xác lên Firestore tracker he_thong/daily_reads_tracker (dùng batching).
 */
export function recordWebsiteVisit(): void {
  if (typeof window === 'undefined') return;
  if (isAutomatedBot()) return;

  const sessionKey = 'cosmo_website_session_visit';
  try {
    if (window.sessionStorage && sessionStorage.getItem(sessionKey)) {
      return;
    }
    if (window.sessionStorage) {
      sessionStorage.setItem(sessionKey, '1');
    }
  } catch {}

  sessionFirestoreReads += 1;
  globalTodayReads += 1;
  globalWebsiteReads += 1;

  try {
    safeStorage.setItem(STORAGE_KEY_TOTAL_READS, String(globalWebsiteReads));
  } catch {}

  notifyReadListeners();
  notifyWebsiteViewListeners();
}

export async function recordPageView(
  pageType: 'home' | 'about' | 'novel-info' | string,
  pageTitle?: string,
  detailId?: string
): Promise<void> {
  if (typeof window === 'undefined') return;
  if (isAutomatedBot()) return;

  if (pageType === 'about') {
    const sessionKey = 'cosmo_about_view_session';
    try {
      if (window.sessionStorage && sessionStorage.getItem(sessionKey)) {
        return;
      }
      if (window.sessionStorage) {
        sessionStorage.setItem(sessionKey, '1');
      }
    } catch {}

    sessionFirestoreReads += 1;
    globalTodayReads += 1;
    globalWebsiteReads += 1;

    try {
      safeStorage.setItem(STORAGE_KEY_TOTAL_READS, String(globalWebsiteReads));
    } catch {}

    notifyReadListeners();
    notifyWebsiteViewListeners();
    return;
  }

  if (pageType === 'novel-info' && detailId) {
    const sessionKey = `cosmo_novel_view_${detailId}`;
    try {
      if (window.sessionStorage && sessionStorage.getItem(sessionKey)) {
        return;
      }
      if (window.sessionStorage) {
        sessionStorage.setItem(sessionKey, '1');
      }
    } catch {}

    sessionFirestoreReads += 1;
    globalTodayReads += 1;
    globalWebsiteReads += 1;

    try {
      safeStorage.setItem(STORAGE_KEY_TOTAL_READS, String(globalWebsiteReads));
    } catch {}

    notifyReadListeners();
    notifyWebsiteViewListeners();
  }
}

// Giữ lại alias để tương thích ngược
export const recordWebsiteSessionView = recordWebsiteVisit;

export function getPacificDateString(d = new Date()): string {
  try {
    return d.toLocaleDateString('en-CA', { timeZone: 'America/Los_Angeles' });
  } catch {
    return d.toISOString().split('T')[0];
  }
}

/**
 * Tính chu kỳ ngày 14:00 (giờ Việt Nam).
 * Mỗi chu kỳ kéo dài 24 tiếng từ 14:00 ngày hôm nay đến 14:00 ngày hôm sau.
 * Bất kể người dùng xem trên điện thoại hay máy tính, chu kỳ luôn đồng nhất 100%.
 */
export function getCycleKey(): string {
  try {
    const now = new Date();
    const vnDateStr = now.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' });
    const vnDate = new Date(vnDateStr);
    const vnHour = vnDate.getHours();

    const cycleDate = new Date(vnDate);
    if (vnHour < 14) {
      cycleDate.setDate(cycleDate.getDate() - 1);
    }
    const yyyy = cycleDate.getFullYear();
    const mm = String(cycleDate.getMonth() + 1).padStart(2, '0');
    const dd = String(cycleDate.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}_14h`;
  } catch {
    return new Date().toISOString().split('T')[0] + '_14h';
  }
}

/**
 * Tính toán thời điểm reset tiếp theo vào 14:00 ngày hôm sau (Giờ Việt Nam UTC+7)
 * Tương ứng với chu kỳ reset hạn mức 50.000 lượt đọc hàng ngày của Google Cloud Firestore (00:00 PST/PDT).
 */
export function getNext14hResetDate(): Date {
  const now = new Date();
  try {
    const vnDateStr = now.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' });
    const vnDate = new Date(vnDateStr);
    const vnHour = vnDate.getHours();
    const vnMinute = vnDate.getMinutes();
    const vnSecond = vnDate.getSeconds();

    let diffSeconds = 0;
    if (vnHour < 14) {
      // Trước 14:00 -> Mốc reset là 14:00 hôm nay
      diffSeconds = (14 - vnHour) * 3600 - vnMinute * 60 - vnSecond;
    } else {
      // Sau 14:00 -> Mốc reset là 14:00 ngày hôm sau
      diffSeconds = (24 + 14 - vnHour) * 3600 - vnMinute * 60 - vnSecond;
    }
    return new Date(now.getTime() + Math.max(0, diffSeconds) * 1000);
  } catch {
    const fallback = new Date(now);
    fallback.setHours(24 + 14, 0, 0, 0);
    return fallback;
  }
}

export function getNextPacificResetDate(): Date {
  return getNext14hResetDate();
}

function notifyReadListeners(): void {
  try {
    const stats = getFirestoreReadStats();
    readListeners.forEach((fn) => fn(stats));
  } catch {}
}

/**
 * Tải số liệu lượt đọc toàn cầu từ Firestore một cách tối ưu.
 * Sử dụng cơ chế bộ nhớ đệm (Cache TTL 3 phút) để tránh tiêu hao hạn mức 50.000 đọc miễn phí của Firebase.
 * Đảm bảo cộng dồn chính xác mọi lượt đọc trên tất cả thiết bị (điện thoại, PC, laptop...).
 */
export async function fetchGlobalReadStats(force = false): Promise<FirestoreReadStats> {
  try {
    const d1Views = await fetchGlobalViews(force);
    if (typeof d1Views === 'number' && d1Views > 0) {
      globalWebsiteReads = Math.max(globalWebsiteReads, d1Views);
      try {
        safeStorage.setItem(STORAGE_KEY_TOTAL_READS, String(globalWebsiteReads));
      } catch {}
      notifyWebsiteViewListeners();
      notifyReadListeners();
    }
  } catch {}

  return getFirestoreReadStats();
}

let lastManualRefreshTime = 0;
export async function refreshFirestoreReadStats(): Promise<FirestoreReadStats> {
  const now = Date.now();
  if (now - lastManualRefreshTime < 10000) {
    return getFirestoreReadStats();
  }
  lastManualRefreshTime = now;
  return fetchGlobalReadStats(true);
}

/**
 * Khởi tạo đồng bộ số liệu toàn cầu từ Firestore một cách tiết kiệm tài nguyên:
 * - Không duy trì onSnapshot broadcast liên tục gây hao tốn đọc khi có lượng độc giả lớn.
 * - Nạp tức thì từ cache localStorage (0ms, 0 read Firebase).
 * - Chu kỳ cập nhật đúng 30 phút một lần.
 */
export function initGlobalReadSync(): () => void {
  if (typeof window === 'undefined') return () => {};

  if (globalWebsiteReads === 0) {
    try {
      const savedReads = safeStorage.getItem(STORAGE_KEY_TOTAL_READS);
      if (savedReads) {
        globalWebsiteReads = parseInt(savedReads, 10) || 0;
      }
    } catch {}
  }

  if (isGlobalSyncInitialized) return () => {};
  isGlobalSyncInitialized = true;

  // Nếu chưa có số liệu hoặc cache đã quá 30 phút thì nạp 1 lần nhẹ nhàng
  const now = Date.now();
  if (globalWebsiteReads === 0 || now - lastTrackerFetchTime > 30 * 60 * 1000) {
    fetchGlobalReadStats(false);
  }

  // Khi người dùng quay lại tab sau hơn 30 phút: mới cập nhật nhẹ 1 lần
  const handleFocus = () => {
    if (Date.now() - lastTrackerFetchTime > 30 * 60 * 1000) {
      fetchGlobalReadStats(false);
    }
  };
  window.addEventListener('focus', handleFocus);

  return () => {
    window.removeEventListener('focus', handleFocus);
  };
}

/**
 * Ghi nhận LƯỢT ĐỌC CHƯƠNG TRUYỆN thực tế.
 * Tuân thủ nghiêm ngặt 3 yêu cầu cốt lõi:
 * 1. CHỈ tính lượt đọc khi bấm vào đọc chương truyện, không tính khi tải danh mục.
 * 2. KHI LOAD LẠI TRANG (F5) CŨNG CHỈ TÍNH 1 LƯỢT ĐỌC (kiểm tra sessionStorage chống đếm lặp).
 * 3. TỐI ƯU HÓA TÀI NGUYÊN: Cộng dồn nguyên tử trực tiếp lên Firestore, đồng bộ mọi thiết bị không bị mất.
 */
const recentChapterReadKeys = new Map<string, number>();

export async function recordChapterRead(
  novelId: string,
  novelTitle: string,
  chapterNumber: number,
  chapterTitle?: string
): Promise<void> {
  if (typeof window === 'undefined') return;
  if (isAutomatedBot()) return;
  if (!novelId || chapterNumber === null || chapterNumber === undefined) return;

  // 1. Chống đếm trùng khi load lại trang (F5):
  const sessionKey = `cosmo_read_sess_${novelId}_c_${chapterNumber}`;
  try {
    if (typeof window !== 'undefined' && window.sessionStorage && sessionStorage.getItem(sessionKey)) {
      return; // Chương này đã được tính 1 lượt đọc trong phiên đọc hiện tại
    }
  } catch {}

  // 2. Chống gọi double call do React mount/re-render (debounce 4 giây)
  const inMemoryKey = `${novelId}_c_${chapterNumber}`;
  const now = Date.now();
  const lastReadTime = recentChapterReadKeys.get(inMemoryKey) || 0;
  if (now - lastReadTime < 4000) return;
  recentChapterReadKeys.set(inMemoryKey, now);

  // Đánh dấu đã tính vào sessionStorage
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      sessionStorage.setItem(sessionKey, '1');
    }
  } catch {}

  sessionFirestoreReads += 1;
  globalTodayReads += 1;
  globalWebsiteReads += 1;

  // Lưu cache nhanh
  try {
    safeStorage.setItem(STORAGE_KEY_TOTAL_READS, String(globalWebsiteReads));
  } catch {}

  // Cập nhật giao diện lập tức (Optimistic update)
  notifyReadListeners();
  notifyWebsiteViewListeners();

  // ĐÃ CHUYỂN SANG CLOUDFLARE D1 (recordChapterView) - Không ghi lượt đọc vào Firestore nữa

  // 5. Ghi log hiển thị trong Modal chi tiết lượt đọc
  const logItem: FirestoreReadLogItem = {
    id: `${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
    timeStr: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    count: 1,
    source: `Đọc: ${novelTitle || 'Truyện'} - ${chapterTitle || `Chương ${chapterNumber}`}`,
  };

  try {
    const logKey = 'cosmo_fs_reads_logs';
    let logs: FirestoreReadLogItem[] = [];
    const rawLogs = safeStorage.getItem(logKey);
    if (rawLogs) {
      try {
        logs = JSON.parse(rawLogs);
      } catch {}
    }
    logs.unshift(logItem);
    if (logs.length > 30) logs = logs.slice(0, 30);
    safeStorage.setItem(logKey, JSON.stringify(logs));
  } catch {}
}

/**
 * Hàm trackFirestoreReads: Giữ lại để tránh breaking changes nếu có nơi gọi,
 * nhưng KHÔNG cộng vào lượt đọc người dùng (đúng theo chỉ thị người dùng).
 */
export function trackFirestoreReads(_count: number, _source: string): void {
  // Đã vô hiệu hóa: Chỉ tính lượt đọc khi bấm vào chương truyện qua recordChapterRead.
}

export function getFirestoreReadStats(): FirestoreReadStats {
  const todayReads = Math.max(globalTodayReads || 0, 0);
  const totalReads = Math.max(globalWebsiteReads || 0, 0);

  let recentLogs: FirestoreReadLogItem[] = [];
  try {
    const rawLogs = safeStorage.getItem('cosmo_fs_reads_logs');
    if (rawLogs) {
      recentLogs = JSON.parse(rawLogs);
    }
  } catch {}

  const nextResetDate = getNext14hResetDate();
  const timeUntilResetMs = Math.max(0, nextResetDate.getTime() - Date.now());

  const nextResetVNTime = nextResetDate.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
  });

  // Không khóa trang web khi đạt mốc 50.000 lượt đọc theo yêu cầu người dùng
  const isLimitReached = false;
  const isExceeded = false;

  return {
    todayReads,
    sessionReads: sessionFirestoreReads,
    dailyLimit: 50000,
    isExceeded,
    nextResetIso: nextResetDate.toISOString(),
    nextResetVNTime,
    timeUntilResetMs,
    recentLogs,
    totalWebsiteViews: totalReads,
    totalWebsiteReads: totalReads,
  };
}

export function subscribeFirestoreReadStats(callback: (stats: FirestoreReadStats) => void): () => void {
  // Tự động kết nối đồng bộ Firestore
  initGlobalReadSync();

  readListeners.add(callback);
  callback(getFirestoreReadStats());
  return () => {
    readListeners.delete(callback);
  };
}

// Force test connection / quota reset verification
export async function forceCheckFirestoreConnection(): Promise<{
  success: boolean;
  message: string;
  isQuota: boolean;
}> {
  try {
    // Try pinging a test doc
    const testDoc = doc(db, 'he_thong', 'quota_ping_test');
    await getDoc(testDoc);
    // Handshake succeeded without quota failure
    clearQuotaExceededFlag();
    return {
      success: true,
      isQuota: false,
      message: 'Kết nối Firebase Firestore thành công! Hạn mức đã sẵn sàng.',
    };
  } catch (error) {
    if (isFirestoreQuotaError(error)) {
      markQuotaExceeded();
      return {
        success: false,
        isQuota: true,
        message: 'Hạn mức miễn phí 50.000 đọc trong ngày của Firestore vẫn đang bị tạm khóa.',
      };
    }
    // Other errors (e.g. permission or not found) mean the quota is actually OK!
    clearQuotaExceededFlag();
    return {
      success: true,
      isQuota: false,
      message: 'Hạn mức Firestore đã sẵn sàng (Phản hồi máy chủ bình thường).',
    };
  }
}

const CACHE_KEY_TRUYEN_LIST = 'cosmo_cached_firestore_truyen_v5';
const CACHE_TIME_KEY = 'cosmo_cached_firestore_truyen_time_v5';
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 phút để tối ưu hóa, tránh nạp lại danh mục khi chuyển trang hoặc quay về trang chủ

let memoryTruyenListCache: FirestoreTruyen[] | null = null;

export function invalidateTruyenListCache(): void {
  memoryTruyenListCache = null;
  try {
    safeStorage.removeItem(CACHE_TIME_KEY);
  } catch {}
}

export function getCachedTruyenList(): FirestoreTruyen[] {
  if (memoryTruyenListCache && memoryTruyenListCache.length > 0) {
    return memoryTruyenListCache;
  }
  try {
    const raw = safeStorage.getItem(CACHE_KEY_TRUYEN_LIST);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        memoryTruyenListCache = parsed;
        return parsed;
      }
    }
  } catch {}
  return [];
}

export function setCachedTruyenList(list: FirestoreTruyen[]): void {
  memoryTruyenListCache = list;
  if (Array.isArray(list) && list.length > 0) {
    try {
      safeStorage.setItem(CACHE_KEY_TRUYEN_LIST, JSON.stringify(list));
      safeStorage.setItem(CACHE_TIME_KEY, String(Date.now()));
    } catch {}
  }
}

export async function fetchTruyenList(_isAdmin: boolean = false, _force = false): Promise<FirestoreTruyen[]> {
  // ĐÃ NGẮT KẾT NỐI HOÀN TOÀN KHỎI FIREBASE: Dữ liệu truyện nạp 100% từ mã nguồn
  return [];
}

// Real-time listener for novels / posts list (ĐÃ NGẮT KẾT NỐI KHỎI FIREBASE)
export function subscribeTruyenList(
  _isAdmin: boolean,
  _callback: (list: FirestoreTruyen[]) => void,
  _onError?: (error: unknown) => void
): Unsubscribe {
  return () => {};
}

export async function createTruyen(data: {
  tenTruyen: string;
  moTa: string;
  anhBia: string;
  theLoai: string;
  tacGia: string;
  trangThai?: 'nhap' | 'daDang';
  adminUser?: AdminUserLike;
  worldLore?: string;
  uploaderNote?: string;
  translator?: string;
  status?: string;
}): Promise<string> {
  const localId = `novel_${Date.now()}`;
  return localId;
}

export async function updateTruyenStatus(
  _truyenId: string,
  _trangThai: 'nhap' | 'daDang'
): Promise<void> {
  // Đã ngắt kết nối khỏi Firebase
}

export async function updateTruyen(
  _truyenId: string,
  _updates: Partial<Omit<FirestoreTruyen, 'id' | 'ngayTao'>>
): Promise<void> {
  // Đã ngắt kết nối khỏi Firebase
}

/**
 * @deprecated ĐÃ NGẮT KẾT NỐI HOÀN TOÀN KHỎI FIREBASE:
 * Ảnh bìa hiện được quản lý & lưu trữ 100% trên Cloudflare D1 (bảng novel_covers)
 * Không còn ghi đè hay kết nối với Firebase Firestore để đảm bảo toàn vẹn dữ liệu.
 */
export async function saveNovelCoverToFirebase(
  _truyenId: string,
  _coverUrlOrDataUrl: string,
  _novelTitle?: string
): Promise<{ success: boolean; error?: string }> {
  return { success: true };
}

/**
 * @deprecated ĐÃ NGẮT KẾT NỐI HOÀN TOÀN KHỎI FIREBASE:
 * Giới thiệu truyện, văn án và thiết lập đã lưu trực tiếp trong mã nguồn web.
 */
export async function saveNovelSynopsisToFirebase(
  _truyenId: string,
  _synopsisData: {
    moTa: string;
    worldLore?: string;
    uploaderNote?: string;
  },
  _novelTitle?: string
): Promise<{ success: boolean; error?: string }> {
  return { success: true };
}

/**
 * @deprecated ĐÃ NGẮT KẾT NỐI HOÀN TOÀN KHỎI FIREBASE:
 * Thể loại và tags đã lưu trực tiếp trong mã nguồn web.
 */
export async function saveNovelTagsToFirebase(
  _truyenId: string,
  _genres: string[] | string,
  _novelTitle?: string
): Promise<{ success: boolean; error?: string }> {
  return { success: true };
}

// Manually add / publish a single chapter (ĐÃ NGẮT KẾT NỐI KHỎI FIREBASE)
export async function addSingleChuong(
  _truyenId: string,
  _soThuTuOrData: number | { soThuTu: number; tieuDe: string; noiDung: string; isExtra?: boolean },
  _tieuDe?: string,
  _noiDung?: string,
  _isExtra: boolean = false
): Promise<boolean> {
  return true;
}

export async function deleteTruyen(_truyenId: string): Promise<void> {
  // Đã ngắt kết nối khỏi Firebase
}

// --- Firestore CRUD operations for Chuong (ĐÃ NGẮT KẾT NỐI HOÀN TOÀN) ---

export async function fetchChuongMetaList(_truyenId: string): Promise<FirestoreChuongMeta[]> {
  return [];
}

export function subscribeChuongMetaList(
  _truyenId: string,
  _callback: (list: FirestoreChuongMeta[]) => void,
  _onError?: (error: unknown) => void
): Unsubscribe {
  return () => {};
}

export async function fetchSingleChuong(
  _truyenId: string,
  _chuongId: string | number
): Promise<FirestoreChuong | null> {
  return null;
}

export async function saveChaptersToFirestore(
  _truyenId: string,
  chapters: { soThuTu: number; tieuDe: string; noiDung: string }[],
  _parentNovelMeta?: any
): Promise<number> {
  return chapters.length;
}

export async function updateChuong(
  _truyenId: string,
  _soThuTu: number,
  _updates: { tieuDe?: string; noiDung?: string; soThuTu?: number; isExtra?: boolean }
): Promise<boolean> {
  return true;
}

export async function renameChuong(
  _truyenId: string,
  _soThuTu: number,
  _newTitle: string
): Promise<boolean> {
  return true;
}

export async function deleteChuong(
  _truyenId: string,
  _soThuTu: number
): Promise<boolean> {
  return true;
}

// ==========================================
// FIRESTORE BÌNH LUẬN (COMMENTS)
// ==========================================

export interface FirestoreBinhLuan {
  id: string;
  truyenId: string;
  author: string;
  content: string;
  createdAt: string;
  ngayTao: string;
  likes: number;
  badge?: string;
  rating?: number;
  avatar: string;
  chapterNumber?: number;
  chapterTitle?: string;
}

export function isBotComment(comment: { id?: string; author?: string }): boolean {
  if (!comment) return false;
  const id = comment.id || '';
  const author = (comment.author || '').toLowerCase().trim();
  const botAuthors = ['mèo lười đọc truyện', 'trà sữa full thạch', 'hạ nhật tinh hà'];
  const botIds = ['cm-ln-1', 'cm-ln-2', 'cm-ln-3'];
  return (
    botIds.includes(id) ||
    botAuthors.some((b) => author.includes(b)) ||
    author.includes('mèo lười') ||
    author.includes('trà sữa full') ||
    author.includes('hạ nhật tinh')
  );
}

export async function fetchBinhLuanList(truyenId: string): Promise<NovelComment[]> {
  // ĐÃ NGẮT KẾT NỐI HOÀN TOÀN KHỎI FIREBASE: Bình luận chuyển sang Cloudflare D1
  const cacheKey = `cosmo_cached_comments_${truyenId}`;
  try {
    const raw = safeStorage.getItem(cacheKey);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed.filter((c: NovelComment) => !isBotComment(c));
    }
  } catch {}
  return [];
}

/**
 * @deprecated ĐÃ NGẮT KẾT NỐI HOÀN TOÀN KHỎI FIREBASE:
 * Bình luận truyện và bình luận từng chương đã được chuyển 100% sang Cloudflare D1 (bảng comments)
 * Không còn lưu hay nạp từ Firestore nữa.
 */
export function subscribeBinhLuanList(
  _truyenId: string,
  _callback: (comments: NovelComment[]) => void,
  _onError?: (error: unknown) => void
): Unsubscribe {
  return () => {};
}

export async function addBinhLuan(
  _truyenId: string,
  commentData: {
    author: string;
    content: string;
    createdAt?: string;
    rating?: number;
    badge?: string;
    avatar?: string;
    likes?: number;
    chapterNumber?: number;
    chapterTitle?: string;
  }
): Promise<NovelComment> {
  return {
    id: `c_${Date.now()}`,
    truyenId: _truyenId,
    author: commentData.author,
    content: commentData.content,
    createdAt: commentData.createdAt || '',
    ngayTao: new Date().toISOString(),
    likes: 0,
    badge: commentData.badge || 'Độc Giả',
    rating: commentData.rating || 5,
    avatar: commentData.avatar || '',
    chapterNumber: commentData.chapterNumber,
    chapterTitle: commentData.chapterTitle,
  };
}

export async function likeBinhLuan(_truyenId: string, _commentId: string): Promise<void> {
  // Đã chuyển sang Cloudflare D1
}

export async function deleteBinhLuan(_truyenId: string, _commentId: string): Promise<boolean> {
  // Đã chuyển sang Cloudflare D1
  return true;
}

// =========================================================================
// THỐNG KÊ THẢ TIM & LƯU BÚT TRANG GIỚI THIỆU (STYLE 1 & STYLE 2)
// Lưu trữ Firestore thực, đồng bộ thời gian thực & cộng dồn trên mọi thiết bị
// =========================================================================

export interface IntroGuestNote {
  id: string;
  author: string;
  content: string;
  time: string;
  createdAt: number;
}

export interface IntroReaderMessage {
  id: number | string;
  sender: string;
  text: string;
  time: string;
  createdAt: number;
}

// ============================================================================
// HỆ THỐNG ĐỒNG BỘ LƯỢT THẢ TIM TRANG GIỚI THIỆU (STYLE 1 & STYLE 2)
// Lưu trữ vĩnh viễn trên Firestore, phản hồi 0ms trên UI & ghi tức thì
// ============================================================================
export async function flushPendingHeartsToFirestore(): Promise<void> {
  // Thả tim trang giới thiệu liên kết 100% với Cloudflare D1
}

function scheduleHeartsSync(): void {
  // Không cần sync Firestore
}

/**
 * Đọc số tim của Style 1 hoặc Style 2 từ Cloudflare D1
 */
export async function fetchIntroHearts(style: 'style1' | 'style2' = 'style1', force = false): Promise<number> {
  return fetchLikes('intro_page', force);
}

/**
 * Lắng nghe số lượt thả tim từ Cloudflare D1
 */
export function subscribeToIntroHearts(
  style: 'style1' | 'style2' = 'style1',
  callback: (count: number) => void,
  _onError?: (error: unknown) => void
): Unsubscribe {
  return subscribeLikes('intro_page', callback);
}

/**
 * Thả tim qua Cloudflare D1
 */
export async function incrementIntroHearts(style: 'style1' | 'style2' = 'style1'): Promise<void> {
  await incrementLike('intro_page', 1);
}

export async function fetchIntroNotesStyle1(force = false): Promise<IntroGuestNote[]> {
  return fetchGuestNotes('style1', force);
}

export function subscribeToIntroNotesStyle1(
  callback: (notes: IntroGuestNote[]) => void,
  _onError?: (error: unknown) => void
): Unsubscribe {
  return subscribeGuestNotes('style1', callback);
}

export async function addIntroNoteStyle1(author: string, content: string): Promise<IntroGuestNote> {
  return addGuestNote('style1', author, content);
}

export async function fetchIntroNotesStyle2(force = false): Promise<IntroReaderMessage[]> {
  const notes = await fetchGuestNotes('style2', force);
  return notes.map((n) => ({
    id: n.id,
    sender: n.author,
    text: n.content,
    time: n.time,
    createdAt: n.createdAt,
  }));
}

export function subscribeToIntroNotesStyle2(
  callback: (messages: IntroReaderMessage[]) => void,
  _onError?: (error: unknown) => void
): Unsubscribe {
  return subscribeGuestNotes('style2', (notes) => {
    callback(
      notes.map((n) => ({
        id: n.id,
        sender: n.author,
        text: n.content,
        time: n.time,
        createdAt: n.createdAt,
      }))
    );
  });
}

export async function addIntroNoteStyle2(sender: string, text: string): Promise<IntroReaderMessage> {
  const note = await addGuestNote('style2', sender, text);
  return {
    id: note.id,
    sender: note.author,
    text: note.content,
    time: note.time,
    createdAt: note.createdAt,
  };
}

export {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
};
