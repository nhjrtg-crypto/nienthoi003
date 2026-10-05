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
    const testSnap = await getDoc(doc(db, 'he_thong', 'daily_reads_tracker'));
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
  if (isSyncing) return;
  if (pendingTrackerReads === 0 && pendingNovelReads.size === 0) return;

  const readsToSync = pendingTrackerReads;
  const novelsToSync = new Map(pendingNovelReads);

  // Reset trước để gom các lượt mới trong lúc đang sync
  pendingTrackerReads = 0;
  pendingNovelReads.clear();

  if (syncTimer) {
    clearTimeout(syncTimer);
    syncTimer = null;
  }

  isSyncing = true;
  try {
    const promises: Promise<any>[] = [];
    const activeCycle = getCycleKey();

    // 1. Đồng bộ lên tracker toàn web (Cộng dồn vĩnh viễn)
    if (readsToSync > 0) {
      const trackerDocRef = doc(db, 'he_thong', 'daily_reads_tracker');
      promises.push(
        setDoc(
          trackerDocRef,
          {
            totalWebsiteReads: increment(readsToSync),
            totalWebsiteViews: increment(readsToSync),
            todayReads: increment(readsToSync),
            cycleKey: activeCycle,
            dailyLimit: 50000,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        ).catch((err) => {
          if (isFirestoreQuotaError(err)) markQuotaExceeded();
          console.warn('[Firestore] Notice syncing tracker reads:', err);
        })
      );
    }

    // 2. Đồng bộ lên từng bộ truyện (Cộng dồn vĩnh viễn)
    novelsToSync.forEach((count, nId) => {
      if (count > 0 && nId) {
        const novelDocRef = doc(db, 'truyen', nId);
        promises.push(
          setDoc(
            novelDocRef,
            {
              views: increment(count),
              luotDoc: increment(count),
              ngayCapNhat: new Date().toISOString(),
            },
            { merge: true }
          ).catch((err) => {
            console.warn(`[Firestore] Notice syncing novel ${nId} reads:`, err);
          })
        );
      }
    });

    await Promise.allSettled(promises);
  } catch (err) {
    console.warn('[Firestore] Error flushing batched reads:', err);
  } finally {
    isSyncing = false;
  }
}

function scheduleReadsSync(): void {
  if (syncTimer) return;
  syncTimer = setTimeout(() => {
    syncTimer = null;
    flushPendingReadsToFirestore();
  }, 30 * 60 * 1000); // 30 phút gom đồng bộ lượt xem lên Firestore 1 lần theo yêu cầu người dùng
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
      return; // Phiên truy cập này đã được ghi nhận 1 lượt xem, không đếm lặp
    }
  } catch {}

  try {
    if (window.sessionStorage) {
      sessionStorage.setItem(sessionKey, '1');
    }
  } catch {}

  // Tăng biến đếm cục bộ ngay lập tức (Optimistic update)
  sessionFirestoreReads += 1;
  globalTodayReads += 1;
  globalWebsiteReads += 1;

  try {
    safeStorage.setItem(STORAGE_KEY_TOTAL_READS, String(globalWebsiteReads));
  } catch {}

  notifyReadListeners();
  notifyWebsiteViewListeners();

  // Đưa vào hàng đợi gom lượt đọc để đồng bộ nguyên tử lên Firestore
  queuePendingTrackerRead(1);

  const logItem: FirestoreReadLogItem = {
    id: `${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
    timeStr: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    count: 1,
    source: 'Truy cập website',
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

export async function recordPageView(
  pageType: 'home' | 'about' | 'novel-info' | string,
  pageTitle?: string,
  detailId?: string
): Promise<void> {
  if (typeof window === 'undefined') return;
  if (isAutomatedBot()) return;

  // 1. Khi bấm vào xem trang giới thiệu: tính +1 lượt đọc vào footer (1 lần mỗi phiên đọc)
  if (pageType === 'about') {
    const sessionKey = 'cosmo_about_view_session';
    try {
      if (window.sessionStorage && sessionStorage.getItem(sessionKey)) {
        return; // Đã ghi nhận trong phiên hiện tại
      }
      if (window.sessionStorage) {
        sessionStorage.setItem(sessionKey, '1');
      }
    } catch {}

    // Cập nhật giao diện lập tức (Optimistic update)
    sessionFirestoreReads += 1;
    globalTodayReads += 1;
    globalWebsiteReads += 1;

    try {
      safeStorage.setItem(STORAGE_KEY_TOTAL_READS, String(globalWebsiteReads));
    } catch {}

    notifyReadListeners();
    notifyWebsiteViewListeners();

    // Gom lượt đọc gửi lên Firestore tracker (cộng dồn vĩnh viễn trên server)
    queuePendingTrackerRead(1);

    const logItem: FirestoreReadLogItem = {
      id: `${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      timeStr: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      count: 1,
      source: 'Xem trang Giới thiệu',
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
    return;
  }

  // 2. Khi bấm vào xem trang thông tin truyện: tính +1 lượt đọc cho truyện VÀ +1 vào footer (1 lần mỗi phiên đọc)
  if (pageType === 'novel-info' && detailId) {
    const sessionKey = `cosmo_novel_view_${detailId}`;
    try {
      if (window.sessionStorage && sessionStorage.getItem(sessionKey)) {
        return; // Đã xem truyện này trong phiên hiện tại
      }
      if (window.sessionStorage) {
        sessionStorage.setItem(sessionKey, '1');
      }
    } catch {}

    // Cập nhật giao diện lập tức (Optimistic update)
    sessionFirestoreReads += 1;
    globalTodayReads += 1;
    globalWebsiteReads += 1;

    try {
      safeStorage.setItem(STORAGE_KEY_TOTAL_READS, String(globalWebsiteReads));
    } catch {}

    notifyReadListeners();
    notifyWebsiteViewListeners();

    // Đưa vào hàng đợi gom lượt đọc để đồng bộ nguyên tử lên Firestore
    queuePendingTrackerRead(1);
    queuePendingNovelRead(detailId, 1);

    const logItem: FirestoreReadLogItem = {
      id: `${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      timeStr: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      count: 1,
      source: `Xem thông tin: ${pageTitle || 'Truyện'}`,
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
  const now = Date.now();
  if (!force && now - lastTrackerFetchTime < STATS_CACHE_TTL_MS && globalWebsiteReads > 0) {
    return getFirestoreReadStats();
  }
  if (isFetchingTracker) {
    return getFirestoreReadStats();
  }

  isFetchingTracker = true;
  try {
    const trackerDocRef = doc(db, 'he_thong', 'daily_reads_tracker');
    const snapshot = await getDoc(trackerDocRef);
    lastTrackerFetchTime = Date.now();

    const activeCycle = getCycleKey();
    if (snapshot.exists()) {
      const data = snapshot.data();
      const docCycle = data?.cycleKey;
      const firestoreCount = typeof data?.todayReads === 'number' ? data.todayReads : 0;
      const firestoreTotalReads = typeof data?.totalWebsiteReads === 'number'
        ? data.totalWebsiteReads
        : (typeof data?.totalWebsiteViews === 'number' ? data.totalWebsiteViews : 0);

      globalWebsiteReads = firestoreTotalReads;

      if (docCycle === activeCycle) {
        globalTodayReads = firestoreCount;
      } else {
        // Chu kỳ mới (sau 14:00 ngày hôm sau)
        globalTodayReads = 0;
        setDoc(
          trackerDocRef,
          {
            todayReads: 0,
            cycleKey: activeCycle,
            dailyLimit: 50000,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        ).catch(() => {});
      }

      // Lưu cache an toàn vào safeStorage
      try {
        safeStorage.setItem(STORAGE_KEY_TOTAL_READS, String(globalWebsiteReads));
      } catch {}

      notifyWebsiteViewListeners();
      notifyReadListeners();
    } else {
      // Khởi tạo tài liệu trên Firestore nếu chưa có
      globalTodayReads = 0;
      globalWebsiteReads = Math.max(globalWebsiteReads, 1);
      setDoc(
        trackerDocRef,
        {
          todayReads: 0,
          totalWebsiteReads: globalWebsiteReads,
          totalWebsiteViews: globalWebsiteReads,
          cycleKey: activeCycle,
          dailyLimit: 50000,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      ).catch(() => {});
      notifyWebsiteViewListeners();
      notifyReadListeners();
    }
  } catch (err) {
    if (isFirestoreQuotaError(err)) {
      markQuotaExceeded();
    } else if (!isFirestoreOfflineError(err)) {
      console.warn('[Firestore] Notice fetching daily_reads_tracker:', err);
    }
  } finally {
    isFetchingTracker = false;
  }

  return getFirestoreReadStats();
}

let lastManualRefreshTime = 0;
export async function refreshFirestoreReadStats(): Promise<FirestoreReadStats> {
  const now = Date.now();
  // Chống spam click liên tục vào nút reload: chỉ gọi Firestore nếu cách lần bấm trước > 30 giây
  if (now - lastManualRefreshTime < 30000) {
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

  // 3. Đưa vào hàng đợi gom lượt đọc thông minh (Batched Atomic Writes)
  // Cộng dồn 100% vĩnh viễn trên Firestore cho mọi thiết bị, đồng thời giảm 90% số lượt Write lên Firebase.
  queuePendingTrackerRead(1);
  queuePendingNovelRead(novelId, 1);

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
    const testDoc = doc(db, 'truyen', 'nienthoi_quota_ping_test');
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

export async function fetchTruyenList(isAdmin: boolean, force = false): Promise<FirestoreTruyen[]> {
  const cached = getCachedTruyenList();

  let cacheTime = 0;
  try {
    const savedTime = safeStorage.getItem(CACHE_TIME_KEY);
    if (savedTime) cacheTime = parseInt(savedTime, 10);
  } catch {}

  const isCacheFresh = !force && cached.length > 0 && Date.now() - cacheTime < CACHE_TTL_MS;

  // 1. Nếu cache còn tươi (< 60s) và không force reload, trả về cache ngay (0 lượt đọc Firestore)
  if (isCacheFresh) {
    return cached;
  }

  // 2. Khi quota bị vượt quá gần đây và đã có cache, ưu tiên trả về cache ngay tức thì
  if (isQuotaExceededActive() && cached.length > 0) {
    memoryTruyenListCache = cached;
    return cached;
  }

  try {
    const truyenRef = collection(db, 'truyen');
    const snapshot = await getDocs(truyenRef);

    const list: FirestoreTruyen[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data() as Partial<FirestoreTruyen>;
      // Filter out draft and banned novels
      if ((!isAdmin && data.trangThai === 'nhap') || isBannedOrDraftFirestore(docSnap.id, data.tenTruyen, data.trangThai)) {
        return;
      }
      list.push({
        id: docSnap.id,
        tenTruyen: data.tenTruyen || '',
        moTa: data.moTa || '',
        anhBia: data.anhBia || '',
        theLoai: data.theLoai || '',
        tacGia: data.tacGia || '',
        trangThai: 'daDang',
        adminUid: data.adminUid || '',
        adminEmail: data.adminEmail || '',
        ngayTao: data.ngayTao || new Date().toISOString(),
        ngayCapNhat: data.ngayCapNhat || new Date().toISOString(),
        soChuong: data.soChuong || 0,
        worldLore: data.worldLore || '',
        uploaderNote: data.uploaderNote || '',
      });
    });

    // Sort descending by date
    list.sort((a, b) => new Date(b.ngayCapNhat).getTime() - new Date(a.ngayCapNhat).getTime());

    if (list.length > 0) {
      setCachedTruyenList(list);
    } else if (cached.length > 0) {
      memoryTruyenListCache = cached;
      return cached;
    }
    return list;
  } catch (error) {
    if (isFirestoreQuotaError(error)) {
      markQuotaExceeded();
      console.warn('[Firebase] Firestore daily read quota reached. Serving cached truyen list seamlessly.');
      memoryTruyenListCache = cached;
      return cached;
    }
    console.warn('[Firebase] Non-fatal error fetching truyen list, fallback to cache:', error);
    memoryTruyenListCache = cached;
    return cached;
  }
}

// Real-time listener for novels / posts list
export function subscribeTruyenList(
  isAdmin: boolean,
  callback: (list: FirestoreTruyen[]) => void,
  onError?: (error: unknown) => void
): Unsubscribe {
  const cached = getCachedTruyenList();

  // Độc giả thông thường: Sử dụng cache tức thì 0ms, sau đó nạp ngầm bản cập nhật mới nhất
  if (!isAdmin) {
    if (cached.length > 0) {
      callback(cached);
    }
    fetchTruyenList(false, true)
      .then((list) => {
        if (list && list.length > 0) {
          callback(list);
        }
      })
      .catch((err) => {
        onError?.(err);
      });
    return () => {};
  }

  // Nếu đang trong thời gian quota cạn kiệt và đã có cache, gửi cache ngay cho UI
  if (isQuotaExceededActive() && cached.length > 0) {
    callback(cached);
    return () => {};
  }

  const truyenRef = collection(db, 'truyen');
  return onSnapshot(
    truyenRef,
    (snapshot) => {
      const list: FirestoreTruyen[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as Partial<FirestoreTruyen>;
        if (data.trangThai === 'nhap' || isBannedOrDraftFirestore(docSnap.id, data.tenTruyen, data.trangThai)) {
          return;
        }
        list.push({
          id: docSnap.id,
          tenTruyen: data.tenTruyen || '',
          moTa: data.moTa || '',
          anhBia: data.anhBia || '',
          theLoai: data.theLoai || '',
          tacGia: data.tacGia || '',
          trangThai: 'daDang',
          adminUid: data.adminUid || '',
          adminEmail: data.adminEmail || '',
          ngayTao: data.ngayTao || new Date().toISOString(),
          ngayCapNhat: data.ngayCapNhat || new Date().toISOString(),
          soChuong: data.soChuong || 0,
          worldLore: data.worldLore || '',
          uploaderNote: data.uploaderNote || '',
        });
      });
      list.sort((a, b) => new Date(b.ngayCapNhat).getTime() - new Date(a.ngayCapNhat).getTime());
      if (list.length > 0) {
        setCachedTruyenList(list);
        callback(list);
      } else if (cached.length > 0) {
        callback(cached);
      } else {
        callback(list);
      }
    },
    (err) => {
      if (isFirestoreQuotaError(err)) {
        markQuotaExceeded();
        console.warn('[Firebase] Real-time subscription reached quota limit. Using cached truyen list.');
      } else {
        console.warn('[Firebase] Real-time truyen subscription notice:', err);
      }
      const fallbackList = getCachedTruyenList();
      if (fallbackList.length > 0) {
        callback(fallbackList);
      }
      onError?.(err);
    }
  );
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
  const truyenRef = collection(db, 'truyen');
  const newDoc = doc(truyenRef);
  const now = new Date().toISOString();

  const payload: Omit<FirestoreTruyen, 'id'> = {
    tenTruyen: data.tenTruyen.trim(),
    moTa: data.moTa.trim(),
    anhBia: data.anhBia.trim(),
    theLoai: data.theLoai.trim(),
    tacGia: data.tacGia.trim(),
    trangThai: data.trangThai || 'daDang',
    adminUid: data.adminUser?.uid || 'admin-nhjrtg',
    adminEmail: data.adminUser?.email || ADMIN_EMAIL,
    ngayTao: now,
    ngayCapNhat: now,
    soChuong: 0,
    worldLore: data.worldLore?.trim() || '',
    uploaderNote: data.uploaderNote?.trim() || '',
    translator: data.translator?.trim() || 'Jouriee65',
    status: 'completed',
  };

  await setDoc(newDoc, payload);

  // Directly update local cache and memory cache so it appears immediately on this machine
  const newTruyenItem: FirestoreTruyen = {
    id: newDoc.id,
    ...payload,
  };
  const cached = getCachedTruyenList();
  const updatedCache = [newTruyenItem, ...cached.filter((t) => t.id !== newDoc.id)];
  setCachedTruyenList(updatedCache);

  return newDoc.id;
}

export async function updateTruyenStatus(
  truyenId: string,
  trangThai: 'nhap' | 'daDang'
): Promise<void> {
  const docRef = doc(db, 'truyen', truyenId);
  await setDoc(
    docRef,
    {
      trangThai,
      ngayCapNhat: new Date().toISOString(),
    },
    { merge: true }
  );
}

export async function updateTruyen(
  truyenId: string,
  updates: Partial<Omit<FirestoreTruyen, 'id' | 'ngayTao'>>
): Promise<void> {
  const docRef = doc(db, 'truyen', truyenId);
  await setDoc(
    docRef,
    {
      ...updates,
      ngayCapNhat: new Date().toISOString(),
    },
    { merge: true }
  );
}

/**
 * Lưu trực tiếp ảnh bìa mới vào Firebase Firestore
 * Đảm bảo dữ liệu được cập nhật trên Cloud (Firestore) theo đúng truyenId hoặc tên truyện
 */
export async function saveNovelCoverToFirebase(
  truyenId: string,
  coverUrlOrDataUrl: string,
  novelTitle?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const trimmedCover = coverUrlOrDataUrl.trim();
    if (!trimmedCover) {
      return { success: false, error: 'Dữ liệu ảnh bìa không hợp lệ' };
    }

    const now = new Date().toISOString();

    // 1. Cập nhật trực tiếp document theo truyenId
    if (truyenId) {
      const docRef = doc(db, 'truyen', truyenId);
      await setDoc(
        docRef,
        {
          anhBia: trimmedCover,
          ngayCapNhat: now,
        },
        { merge: true }
      );
    }

    // 2. Nếu có novelTitle, kiểm tra và đồng bộ thêm các document có cùng tên truyện trong Firestore
    if (novelTitle) {
      const q = query(collection(db, 'truyen'), where('tenTruyen', '==', novelTitle.trim()));
      const snap = await getDocs(q);
      const updates = snap.docs.map((d) => {
        if (d.id !== truyenId) {
          return updateDoc(d.ref, {
            anhBia: trimmedCover,
            ngayCapNhat: now,
          });
        }
        return Promise.resolve();
      });
      await Promise.all(updates);
    }

    // 3. Cập nhật ngay bộ nhớ cache cục bộ để cả Admin và Độc giả đều thấy ảnh bìa mới
    const currentCached = getCachedTruyenList();
    if (currentCached && currentCached.length > 0) {
      const updatedCache = currentCached.map((t) =>
        t.id === truyenId || (novelTitle && t.tenTruyen === novelTitle.trim())
          ? { ...t, anhBia: trimmedCover, ngayCapNhat: now }
          : t
      );
      setCachedTruyenList(updatedCache);
    }

    return { success: true };
  } catch (err: any) {
    console.error('Lỗi khi lưu ảnh bìa vào Firebase:', err);
    return { success: false, error: err?.message || 'Không thể lưu lên Firebase' };
  }
}

/**
 * Lưu trực tiếp giới thiệu truyện (văn án, thiết lập nhân vật, lời nhắn người đăng) vào Firebase Firestore
 */
export async function saveNovelSynopsisToFirebase(
  truyenId: string,
  synopsisData: {
    moTa: string;
    worldLore?: string;
    uploaderNote?: string;
  },
  novelTitle?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const trimmedMoTa = synopsisData.moTa.trim();
    if (!trimmedMoTa) {
      return { success: false, error: 'Nội dung giới thiệu không được để trống' };
    }

    const now = new Date().toISOString();
    const payload: Partial<FirestoreTruyen> = {
      moTa: trimmedMoTa,
      gioiThieu: trimmedMoTa,
      ngayCapNhat: now,
    };
    if (synopsisData.worldLore !== undefined) {
      payload.worldLore = synopsisData.worldLore.trim();
    }
    if (synopsisData.uploaderNote !== undefined) {
      payload.uploaderNote = synopsisData.uploaderNote.trim();
    }

    // 1. Cập nhật trực tiếp document theo truyenId
    if (truyenId) {
      const docRef = doc(db, 'truyen', truyenId);
      await setDoc(docRef, payload, { merge: true });
    }

    // 2. Đồng bộ các document có cùng tên truyện trong Firestore nếu có
    if (novelTitle) {
      const q = query(collection(db, 'truyen'), where('tenTruyen', '==', novelTitle.trim()));
      const snap = await getDocs(q);
      const updates = snap.docs.map((d) => {
        if (d.id !== truyenId) {
          return updateDoc(d.ref, payload as any);
        }
        return Promise.resolve();
      });
      await Promise.all(updates);
    }

    return { success: true };
  } catch (err: any) {
    console.error('Lỗi khi lưu giới thiệu truyện vào Firebase:', err);
    return { success: false, error: err?.message || 'Không thể lưu giới thiệu lên Firebase' };
  }
}

/**
 * Lưu trực tiếp danh sách thể loại / tags vào Firebase Firestore
 */
export async function saveNovelTagsToFirebase(
  truyenId: string,
  genres: string[] | string,
  novelTitle?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    let theLoaiString = '';
    if (Array.isArray(genres)) {
      theLoaiString = genres
        .map((g) => g.replace(/^#+/, '').trim())
        .filter(Boolean)
        .join(', ');
    } else if (typeof genres === 'string') {
      theLoaiString = genres.trim();
    }

    if (!theLoaiString) {
      return { success: false, error: 'Danh sách tags không được để trống' };
    }

    const now = new Date().toISOString();
    const payload: Partial<FirestoreTruyen> = {
      theLoai: theLoaiString,
      ngayCapNhat: now,
    };

    // 1. Cập nhật document theo truyenId
    if (truyenId) {
      const docRef = doc(db, 'truyen', truyenId);
      await setDoc(docRef, payload, { merge: true });
    }

    // 2. Đồng bộ các document có cùng tên truyện trong Firestore nếu có
    if (novelTitle) {
      const q = query(collection(db, 'truyen'), where('tenTruyen', '==', novelTitle.trim()));
      const snap = await getDocs(q);
      const updates = snap.docs.map((d) => {
        if (d.id !== truyenId) {
          return updateDoc(d.ref, payload as any);
        }
        return Promise.resolve();
      });
      await Promise.all(updates);
    }

    return { success: true };
  } catch (err: any) {
    console.error('Lỗi khi lưu tags vào Firebase:', err);
    return { success: false, error: err?.message || 'Không thể lưu tags lên Firebase' };
  }
}

// Manually add / publish a single chapter
export async function addSingleChuong(
  truyenId: string,
  soThuTuOrData: number | { soThuTu: number; tieuDe: string; noiDung: string; isExtra?: boolean },
  tieuDe?: string,
  noiDung?: string,
  isExtra: boolean = false
): Promise<boolean> {
  try {
    const soThuTu = typeof soThuTuOrData === 'object' ? soThuTuOrData.soThuTu : soThuTuOrData;
    const finalTieuDe = typeof soThuTuOrData === 'object' ? soThuTuOrData.tieuDe : (tieuDe || `Chương ${soThuTu}`);
    const finalNoiDung = typeof soThuTuOrData === 'object' ? soThuTuOrData.noiDung : (noiDung || '');
    const finalIsExtra = typeof soThuTuOrData === 'object' ? Boolean(soThuTuOrData.isExtra) : Boolean(isExtra);

    const directDocRef = doc(db, 'truyen', truyenId, 'chuong', `c_${soThuTu}`);
    const now = new Date().toISOString();
    await setDoc(
      directDocRef,
      {
        soThuTu,
        tieuDe: finalTieuDe.trim() || `Chương ${soThuTu}`,
        noiDung: finalNoiDung.trim(),
        thoiGianDang: now,
        thoiGianCapNhat: now,
        truyenId,
        isExtra: finalIsExtra,
        adminEmail: ADMIN_EMAIL,
      },
      { merge: true }
    );

    // Update parent novel's soChuong & ngayCapNhat
    try {
      const chuongColl = collection(db, 'truyen', truyenId, 'chuong');
      const snap = await getDocs(chuongColl);
      await setDoc(
        doc(db, 'truyen', truyenId),
        {
          soChuong: snap.size,
          ngayCapNhat: now,
        },
        { merge: true }
      );
    } catch {}

    return true;
  } catch (err) {
    console.error('Error adding single chapter to Firestore:', err);
    return false;
  }
}

export async function deleteTruyen(truyenId: string): Promise<void> {
  // Delete chapters first
  const chuongRef = collection(db, 'truyen', truyenId, 'chuong');
  const chuongSnap = await getDocs(chuongRef);
  const batch = writeBatch(db);
  chuongSnap.forEach((c) => {
    batch.delete(c.ref);
  });
  await batch.commit();

  // Delete parent novel doc
  const docRef = doc(db, 'truyen', truyenId);
  await deleteDoc(docRef);

  // Directly update local cache
  try {
    const cached = getCachedTruyenList();
    const updated = cached.filter((t) => t.id !== truyenId);
    setCachedTruyenList(updated);
  } catch {}
}

// --- Firestore CRUD operations for Chuong ---

// Fetch only chapter metadata (soThuTu, tieuDe, thoiGianDang) - NO full content
export async function fetchChuongMetaList(truyenId: string): Promise<FirestoreChuongMeta[]> {
  const cacheKey = `cosmo_cached_chapters_meta_${truyenId}`;
  const getCached = (): FirestoreChuongMeta[] => {
    try {
      const raw = safeStorage.getItem(cacheKey);
      if (raw) return JSON.parse(raw);
    } catch {}
    return [];
  };

  if (isQuotaExceededActive()) {
    const cached = getCached();
    if (cached.length > 0) return cached;
  }

  try {
    const chuongRef = collection(db, 'truyen', truyenId, 'chuong');
    const q = query(chuongRef, orderBy('soThuTu', 'asc'));
    const snapshot = await getDocs(q);

    const list: FirestoreChuongMeta[] = [];
    snapshot.forEach((docSnap) => {
      const d = docSnap.data();
      list.push({
        id: docSnap.id,
        soThuTu: d.soThuTu ?? 0,
        tieuDe: d.tieuDe || `Chương ${d.soThuTu}`,
        thoiGianDang: d.thoiGianDang || '',
        truyenId,
      });
    });
    if (list.length > 0) {
      try {
        safeStorage.setItem(cacheKey, JSON.stringify(list));
      } catch {}
    }
    return list;
  } catch (error) {
    if (isFirestoreQuotaError(error)) {
      markQuotaExceeded();
      console.warn(`[Firebase] Quota limit for chapters list of ${truyenId}. Returning cached metadata.`);
    } else {
      console.warn(`[Firebase] Notice fetching chapter metadata list for ${truyenId}:`, error);
    }
    return getCached();
  }
}

// Real-time listener for chapter list using onSnapshot
export function subscribeChuongMetaList(
  truyenId: string,
  callback: (list: FirestoreChuongMeta[]) => void,
  onError?: (error: unknown) => void
): Unsubscribe {
  const cacheKey = `cosmo_cached_chapters_meta_${truyenId}`;
  const getCached = (): FirestoreChuongMeta[] => {
    try {
      const raw = safeStorage.getItem(cacheKey);
      if (raw) return JSON.parse(raw);
    } catch {}
    return [];
  };

  if (isQuotaExceededActive()) {
    const cached = getCached();
    if (cached.length > 0) {
      callback(cached);
      return () => {};
    }
  }

  const chuongRef = collection(db, 'truyen', truyenId, 'chuong');
  const q = query(chuongRef, orderBy('soThuTu', 'asc'));
  return onSnapshot(
    q,
    (snapshot) => {
      const list: FirestoreChuongMeta[] = [];
      snapshot.forEach((docSnap) => {
        const d = docSnap.data();
        list.push({
          id: docSnap.id,
          soThuTu: d.soThuTu ?? 0,
          tieuDe: d.tieuDe || `Chương ${d.soThuTu}`,
          thoiGianDang: d.thoiGianDang || '',
          truyenId,
        });
      });
      if (list.length > 0) {
        try {
          safeStorage.setItem(cacheKey, JSON.stringify(list));
        } catch {}
      }
      callback(list);
    },
    (err) => {
      if (isFirestoreQuotaError(err)) {
        markQuotaExceeded();
        console.warn('[Firebase] Real-time chapter subscription reached quota limit. Using cached chapters.');
      } else {
        console.warn('[Firebase] Real-time chapter subscription notice:', err);
      }
      const fallbackList = getCached();
      if (fallbackList.length > 0) {
        callback(fallbackList);
      }
      onError?.(err);
    }
  );
}

// Fetch single chapter full content on reader demand
export async function fetchSingleChuong(
  truyenId: string,
  chuongId: string | number
): Promise<FirestoreChuong | null> {
  const cacheKey = `cosmo_cached_chapter_${truyenId}_${chuongId}`;
  const getCached = (): FirestoreChuong | null => {
    try {
      const raw = safeStorage.getItem(cacheKey);
      if (raw) return JSON.parse(raw);
    } catch {}
    return null;
  };

  const cached = getCached();
  if (cached) return cached;

  if (isQuotaExceededActive()) {
    return cached;
  }

  try {
    const idStr = String(chuongId);
    const docRef = doc(db, 'truyen', truyenId, 'chuong', idStr);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      const d = snap.data();
      const result: FirestoreChuong = {
        id: snap.id,
        soThuTu: d.soThuTu ?? (Number(idStr) || 0),
        tieuDe: d.tieuDe || `Chương ${idStr}`,
        noiDung: d.noiDung || '',
        thoiGianDang: d.thoiGianDang || '',
        truyenId,
      };
      try {
        safeStorage.setItem(cacheKey, JSON.stringify(result));
      } catch {}
      return result;
    }
    return null;
  } catch (error) {
    if (isFirestoreQuotaError(error)) {
      markQuotaExceeded();
    }
    return getCached();
  }
}

// Save parsed chapters in batches (max 500 per batch)
export async function saveChaptersToFirestore(
  truyenId: string,
  chapters: { soThuTu: number; tieuDe: string; noiDung: string }[],
  parentNovelMeta?: {
    tenTruyen?: string;
    moTa?: string;
    anhBia?: string;
    theLoai?: string;
    tacGia?: string;
  }
): Promise<number> {
  const chuongColl = collection(db, 'truyen', truyenId, 'chuong');
  const now = new Date().toISOString();

  // Split into chunks of 450 to comfortably stay below 500 limit
  const chunkSize = 450;
  let savedCount = 0;

  for (let i = 0; i < chapters.length; i += chunkSize) {
    const chunk = chapters.slice(i, i + chunkSize);
    const batch = writeBatch(db);

    for (const c of chunk) {
      // Deterministic or generated doc id
      const cId = `c_${c.soThuTu}`;
      const docRef = doc(chuongColl, cId);
      batch.set(docRef, {
        soThuTu: c.soThuTu,
        tieuDe: c.tieuDe.trim(),
        noiDung: c.noiDung.trim(),
        thoiGianDang: now,
        truyenId,
        adminEmail: ADMIN_EMAIL,
      });
      savedCount++;
    }

    await batch.commit();
  }

  // Update total chapter count on parent novel, creating parent novel document if not yet existing
  const truyenRef = doc(db, 'truyen', truyenId);
  try {
    const truyenSnap = await getDoc(truyenRef);
    const existingTitle = truyenSnap.exists() ? (truyenSnap.data()?.tenTruyen || '') : '';
    const safeTitle = parentNovelMeta?.tenTruyen?.trim() || existingTitle || 'Tiểu Thuyết';

    if (!truyenSnap.exists()) {
      await setDoc(
        truyenRef,
        {
          tenTruyen: safeTitle,
          moTa: parentNovelMeta?.moTa || '',
          anhBia: parentNovelMeta?.anhBia || '',
          theLoai: parentNovelMeta?.theLoai || 'Tiểu Thuyết',
          tacGia: parentNovelMeta?.tacGia || 'Admin',
          trangThai: 'daDang',
          adminUid: 'admin-nhjrtg',
          adminEmail: ADMIN_EMAIL,
          ngayTao: now,
          ngayCapNhat: now,
          soChuong: chapters.length,
        },
        { merge: true }
      );
    } else {
      await updateDoc(truyenRef, {
        soChuong: chapters.length,
        ngayCapNhat: now,
      });
    }
  } catch (updateErr) {
    console.warn('[Firebase] Updating truyen doc fell back to setDoc:', updateErr);
    await setDoc(
      truyenRef,
      {
        soChuong: chapters.length,
        ngayCapNhat: now,
        ...(parentNovelMeta?.tenTruyen?.trim() ? { tenTruyen: parentNovelMeta.tenTruyen.trim() } : {}),
        trangThai: 'daDang',
        adminEmail: ADMIN_EMAIL,
      },
      { merge: true }
    );
  }

  return savedCount;
}

// Update chapter title and/or content in Firestore
export async function updateChuong(
  truyenId: string,
  soThuTu: number,
  updates: { tieuDe?: string; noiDung?: string; soThuTu?: number; isExtra?: boolean }
): Promise<boolean> {
  try {
    const directDocRef = doc(db, 'truyen', truyenId, 'chuong', `c_${soThuTu}`);
    const directSnap = await getDoc(directDocRef);
    const now = new Date().toISOString();

    const dataToUpdate: Record<string, any> = {
      thoiGianCapNhat: now,
    };
    if (updates.tieuDe !== undefined) dataToUpdate.tieuDe = updates.tieuDe.trim();
    if (updates.noiDung !== undefined) dataToUpdate.noiDung = updates.noiDung.trim();
    if (updates.soThuTu !== undefined) dataToUpdate.soThuTu = updates.soThuTu;
    if (updates.isExtra !== undefined) dataToUpdate.isExtra = updates.isExtra;

    if (directSnap.exists()) {
      await updateDoc(directDocRef, dataToUpdate);
    } else {
      // Fallback find by soThuTu
      const chuongColl = collection(db, 'truyen', truyenId, 'chuong');
      const q = query(chuongColl, where('soThuTu', '==', soThuTu), limit(1));
      const querySnap = await getDocs(q);
      if (!querySnap.empty) {
        await updateDoc(querySnap.docs[0].ref, dataToUpdate);
      } else {
        // Create new chapter document if it did not exist
        await setDoc(directDocRef, {
          soThuTu,
          tieuDe: updates.tieuDe?.trim() || `Chương ${soThuTu}`,
          noiDung: updates.noiDung?.trim() || '',
          thoiGianDang: now,
          thoiGianCapNhat: now,
          truyenId,
          isExtra: Boolean(updates.isExtra),
        });
      }
    }

    // Touch parent novel update time
    try {
      await updateDoc(doc(db, 'truyen', truyenId), {
        ngayCapNhat: now,
      });
    } catch {}

    return true;
  } catch (err) {
    console.error('Error updating chapter in Firestore:', err);
    return false;
  }
}

// Rename chapter title
export async function renameChuong(
  truyenId: string,
  soThuTu: number,
  newTitle: string
): Promise<boolean> {
  return updateChuong(truyenId, soThuTu, { tieuDe: newTitle.trim() });
}

// Delete chapter from Firestore
export async function deleteChuong(
  truyenId: string,
  soThuTu: number
): Promise<boolean> {
  try {
    const directDocRef = doc(db, 'truyen', truyenId, 'chuong', `c_${soThuTu}`);
    const directSnap = await getDoc(directDocRef);

    if (directSnap.exists()) {
      await deleteDoc(directDocRef);
    } else {
      const chuongColl = collection(db, 'truyen', truyenId, 'chuong');
      const q = query(chuongColl, where('soThuTu', '==', soThuTu));
      const querySnap = await getDocs(q);
      for (const d of querySnap.docs) {
        await deleteDoc(d.ref);
      }
    }

    // Update chapter count on parent truyen
    try {
      const chuongColl = collection(db, 'truyen', truyenId, 'chuong');
      const remainingSnap = await getDocs(chuongColl);
      await updateDoc(doc(db, 'truyen', truyenId), {
        soChuong: remainingSnap.size,
        ngayCapNhat: new Date().toISOString(),
      });
    } catch {}

    return true;
  } catch (err) {
    console.error('Error deleting chapter from Firestore:', err);
    return false;
  }
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
  const cacheKey = `cosmo_cached_comments_${truyenId}`;
  const getCached = (): NovelComment[] => {
    try {
      const raw = safeStorage.getItem(cacheKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed.filter((c: NovelComment) => !isBotComment(c));
      }
    } catch {}
    return [];
  };

  if (isQuotaExceededActive()) {
    const cached = getCached();
    if (cached.length > 0) return cached;
  }

  try {
    const commentsColl = collection(db, 'truyen', truyenId, 'binh_luan');
    const snap = await getDocs(commentsColl);
    const list: NovelComment[] = [];
    snap.forEach((docSnap) => {
      const data = docSnap.data();
      const item: NovelComment = {
        id: docSnap.id,
        truyenId,
        author: data.author || 'Bạn Đọc',
        content: data.content || '',
        createdAt: data.createdAt ? normalizeCommentDate(data.createdAt) : formatCommentDate(data.ngayTao),
        ngayTao: data.ngayTao || new Date().toISOString(),
        likes: typeof data.likes === 'number' ? data.likes : 0,
        badge: data.badge || 'Độc Giả',
        rating: typeof data.rating === 'number' ? data.rating : 5,
        avatar: data.avatar || '',
        chapterNumber: typeof data.chapterNumber === 'number' ? data.chapterNumber : undefined,
        chapterTitle: data.chapterTitle || undefined,
      };
      if (!isBotComment(item)) {
        list.push(item);
      }
    });
    // Sort descending by ngayTao
    list.sort((a, b) => new Date(b.ngayTao || 0).getTime() - new Date(a.ngayTao || 0).getTime());
    if (list.length > 0) {
      try {
        safeStorage.setItem(cacheKey, JSON.stringify(list));
      } catch {}
    }
    return list;
  } catch (error) {
    if (isFirestoreQuotaError(error)) {
      markQuotaExceeded();
      console.warn(`[Firebase] Quota limit reached for comments of ${truyenId}. Returning cached comments.`);
    } else {
      console.warn(`[Firebase] Notice fetching comments for truyen ${truyenId}:`, error);
    }
    return getCached();
  }
}

export function subscribeBinhLuanList(
  truyenId: string,
  callback: (comments: NovelComment[]) => void,
  onError?: (error: unknown) => void
): Unsubscribe {
  const cacheKey = `cosmo_cached_comments_${truyenId}`;
  const timeKey = `cosmo_comments_time_${truyenId}`;
  const getCached = (): NovelComment[] => {
    try {
      const raw = safeStorage.getItem(cacheKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed.filter((c: NovelComment) => !isBotComment(c));
      }
    } catch {}
    return [];
  };

  const cached = getCached();
  // 1. Trả về cache ngay tức thì nếu có (0ms, 0 Read)
  if (cached.length > 0) {
    callback(cached);
  }

  // 2. Nếu đã nạp trong vòng 30 phút, không gọi lại Firestore để tiết kiệm lượt đọc
  let lastFetchTime = 0;
  try {
    const saved = safeStorage.getItem(timeKey);
    if (saved) lastFetchTime = parseInt(saved, 10);
  } catch {}

  const now = Date.now();
  if (cached.length > 0 && now - lastFetchTime < 30 * 60 * 1000) {
    return () => {};
  }

  // 3. Nạp 1 lần từ Firestore với giới hạn 25 bình luận mới nhất (KHÔNG onSnapshot)
  const commentsColl = collection(db, 'truyen', truyenId, 'binh_luan');
  const q = query(commentsColl, orderBy('ngayTao', 'desc'), limit(25));
  getDocs(q)
    .then((snapshot) => {
      const list: NovelComment[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const item: NovelComment = {
          id: docSnap.id,
          truyenId,
          author: data.author || 'Bạn Đọc',
          content: data.content || '',
          createdAt: data.createdAt ? normalizeCommentDate(data.createdAt) : formatCommentDate(data.ngayTao),
          ngayTao: data.ngayTao || new Date().toISOString(),
          likes: typeof data.likes === 'number' ? data.likes : 0,
          badge: data.badge || 'Độc Giả',
          rating: typeof data.rating === 'number' ? data.rating : 5,
          avatar: data.avatar || '',
          chapterNumber: typeof data.chapterNumber === 'number' ? data.chapterNumber : undefined,
          chapterTitle: data.chapterTitle || undefined,
        };
        if (!isBotComment(item)) {
          list.push(item);
        }
      });
      list.sort((a, b) => new Date(b.ngayTao || 0).getTime() - new Date(a.ngayTao || 0).getTime());
      if (list.length > 0) {
        try {
          safeStorage.setItem(cacheKey, JSON.stringify(list));
          safeStorage.setItem(timeKey, String(Date.now()));
        } catch {}
        callback(list);
      }
    })
    .catch((err) => {
      if (isFirestoreQuotaError(err)) markQuotaExceeded();
      console.warn(`[Firebase] Notice fetching comments for ${truyenId}:`, err);
      onError?.(err);
    });

  return () => {};
}

export async function addBinhLuan(
  truyenId: string,
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
  const commentsColl = collection(db, 'truyen', truyenId, 'binh_luan');
  const newDocRef = doc(commentsColl);
  const now = new Date();
  const formattedDate = commentData.createdAt ? normalizeCommentDate(commentData.createdAt) : formatCommentDate(now);

  const payload: FirestoreBinhLuan = {
    id: newDocRef.id,
    truyenId,
    author: commentData.author.trim() || 'Bạn Đọc',
    content: commentData.content.trim(),
    createdAt: formattedDate,
    ngayTao: now.toISOString(),
    likes: commentData.likes || 0,
    badge: commentData.badge || 'Độc Giả',
    rating: commentData.rating || 5,
    avatar: commentData.avatar || '',
    chapterNumber: typeof commentData.chapterNumber === 'number' ? commentData.chapterNumber : undefined,
    chapterTitle: commentData.chapterTitle ? commentData.chapterTitle.trim() : undefined,
  };

  // Lưu vĩnh viễn lên máy chủ Firestore của bạn (đổi máy không bao giờ mất)
  await setDoc(newDocRef, payload);

  // Cập nhật ngay vào cache local để người gửi thấy ngay lập tức
  try {
    const cacheKey = `cosmo_cached_comments_${truyenId}`;
    const raw = safeStorage.getItem(cacheKey);
    let curList: NovelComment[] = raw ? JSON.parse(raw) : [];
    curList.unshift(payload);
    safeStorage.setItem(cacheKey, JSON.stringify(curList));
  } catch {}

  return payload;
}

export async function likeBinhLuan(truyenId: string, commentId: string): Promise<void> {
  try {
    const commentRef = doc(db, 'truyen', truyenId, 'binh_luan', commentId);
    // Dùng atomic increment(1) trực tiếp - KHÔNG gọi getDoc để tiết kiệm 1 Read
    await updateDoc(commentRef, { likes: increment(1) });
  } catch (err) {
    console.warn(`[Firebase] Failed to like comment ${commentId}:`, err);
  }
}

export async function deleteBinhLuan(truyenId: string, commentId: string): Promise<boolean> {
  try {
    const commentRef = doc(db, 'truyen', truyenId, 'binh_luan', commentId);
    await deleteDoc(commentRef);
    return true;
  } catch (err) {
    console.error(`[Firebase] Failed to delete comment ${commentId}:`, err);
    return false;
  }
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
  id: number;
  sender: string;
  text: string;
  time: string;
  createdAt: number;
}

// ============================================================================
// HỆ THỐNG ĐỒNG BỘ LƯỢT THẢ TIM TRANG GIỚI THIỆU (STYLE 1 & STYLE 2)
// Lưu trữ vĩnh viễn trên Firestore, phản hồi 0ms trên UI & ghi tức thì
// ============================================================================
let pendingStyle1Hearts = 0;
let pendingStyle2Hearts = 0;
let heartsSyncTimer: any = null;
let isHeartsSyncing = false;

// Đọc bộ đệm an toàn từ safeStorage để không bao giờ bị flash số 0 khi tải lại trang
let cachedStyle1Hearts = (() => {
  try {
    const raw = safeStorage.getItem('cosmo_intro_hearts_style1');
    const val = raw ? parseInt(raw, 10) : 0;
    return isNaN(val) || val < 0 ? 0 : val;
  } catch {
    return 0;
  }
})();

let cachedStyle2Hearts = (() => {
  try {
    const raw = safeStorage.getItem('cosmo_intro_hearts_style2');
    const val = raw ? parseInt(raw, 10) : 0;
    return isNaN(val) || val < 0 ? 0 : val;
  } catch {
    return 0;
  }
})();

let lastFetchStyle1HeartsTime = 0;
let lastFetchStyle2HeartsTime = 0;
const style1HeartsListeners = new Set<(count: number) => void>();
const style2HeartsListeners = new Set<(count: number) => void>();

export async function flushPendingHeartsToFirestore(): Promise<void> {
  if (isHeartsSyncing) return;
  if (pendingStyle1Hearts === 0 && pendingStyle2Hearts === 0) return;

  const s1Count = pendingStyle1Hearts;
  const s2Count = pendingStyle2Hearts;
  pendingStyle1Hearts = 0;
  pendingStyle2Hearts = 0;

  if (heartsSyncTimer) {
    clearTimeout(heartsSyncTimer);
    heartsSyncTimer = null;
  }

  isHeartsSyncing = true;
  try {
    const promises: Promise<any>[] = [];
    if (s1Count > 0) {
      const docRef = doc(db, 'gioi_thieu_stats', 'style1');
      promises.push(
        setDoc(
          docRef,
          {
            heartsCount: increment(s1Count),
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        ).catch((err) => console.warn('[Firestore] Error syncing style1 hearts:', err))
      );
    }
    if (s2Count > 0) {
      const docRef = doc(db, 'gioi_thieu_stats', 'style2');
      promises.push(
        setDoc(
          docRef,
          {
            heartsCount: increment(s2Count),
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        ).catch((err) => console.warn('[Firestore] Error syncing style2 hearts:', err))
      );
    }
    await Promise.allSettled(promises);
  } catch (err) {
    console.warn('[Firestore] Error flushing hearts:', err);
  } finally {
    isHeartsSyncing = false;
  }
}

function scheduleHeartsSync(): void {
  if (heartsSyncTimer) return;
  // Đồng bộ nhanh chóng sau 1,5 giây (thay vì đợi 30 phút gây mất tim khi tắt tab)
  heartsSyncTimer = setTimeout(() => {
    heartsSyncTimer = null;
    flushPendingHeartsToFirestore();
  }, 1500);
}

// Bắt sự kiện chuyển tab / đóng trang để đồng bộ tim không bị mất
if (typeof window !== 'undefined') {
  try {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        flushPendingHeartsToFirestore();
      }
    });
    window.addEventListener('pagehide', () => {
      flushPendingHeartsToFirestore();
    });
    window.addEventListener('beforeunload', () => {
      flushPendingHeartsToFirestore();
    });
  } catch {}
}

/**
 * Đọc số tim của Style 1 hoặc Style 2 từ Firestore (Có cache và lưu an toàn)
 */
export async function fetchIntroHearts(style: 'style1' | 'style2', force = false): Promise<number> {
  const now = Date.now();
  const lastTime = style === 'style1' ? lastFetchStyle1HeartsTime : lastFetchStyle2HeartsTime;
  const currentCached = style === 'style1' ? cachedStyle1Hearts : cachedStyle2Hearts;

  if (!force && now - lastTime < 5 * 60 * 1000 && currentCached > 0) {
    return currentCached;
  }

  try {
    const docRef = doc(db, 'gioi_thieu_stats', style);
    const snap = await getDoc(docRef);
    if (style === 'style1') lastFetchStyle1HeartsTime = Date.now();
    else lastFetchStyle2HeartsTime = Date.now();

    if (snap.exists()) {
      const data = snap.data();
      const count = typeof data?.heartsCount === 'number' ? data.heartsCount : 0;
      if (style === 'style1') {
        // Lấy số lớn hơn giữa cache và server để không bị lùi số nếu vừa thả tim
        cachedStyle1Hearts = Math.max(cachedStyle1Hearts, count);
        safeStorage.setItem('cosmo_intro_hearts_style1', String(cachedStyle1Hearts));
        style1HeartsListeners.forEach((fn) => fn(cachedStyle1Hearts));
        return cachedStyle1Hearts;
      } else {
        cachedStyle2Hearts = Math.max(cachedStyle2Hearts, count);
        safeStorage.setItem('cosmo_intro_hearts_style2', String(cachedStyle2Hearts));
        style2HeartsListeners.forEach((fn) => fn(cachedStyle2Hearts));
        return cachedStyle2Hearts;
      }
    } else {
      // Document chưa tồn tại trên Firestore -> tự động khởi tạo document
      setDoc(
        docRef,
        {
          heartsCount: currentCached > 0 ? currentCached : 0,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      ).catch(() => {});
    }
  } catch (err) {
    console.warn(`[Firestore] Notice fetching ${style} hearts:`, err);
  }
  return currentCached;
}

/**
 * Lắng nghe số lượt thả tim thời gian thực từ Firestore và cache bộ nhớ
 */
export function subscribeToIntroHearts(
  style: 'style1' | 'style2',
  callback: (count: number) => void,
  _onError?: (error: unknown) => void
): Unsubscribe {
  const listeners = style === 'style1' ? style1HeartsListeners : style2HeartsListeners;
  listeners.add(callback);

  // Trả về số tim trong cache ngay tức thì (0ms, không độ trễ)
  const initial = style === 'style1' ? cachedStyle1Hearts : cachedStyle2Hearts;
  callback(initial);

  // Nạp từ Firestore lần đầu nếu chưa nạp trong 5 phút qua
  fetchIntroHearts(style, false).then((count) => callback(count)).catch(() => {});

  // Chu kỳ 5 phút làm mới lại 1 lần từ máy chủ nếu độc giả còn ở lại trang
  const intervalId = setInterval(() => {
    fetchIntroHearts(style, true).then((count) => callback(count)).catch(() => {});
  }, 5 * 60 * 1000);

  return () => {
    listeners.delete(callback);
    clearInterval(intervalId);
  };
}

/**
 * Thả tim: Tăng trên giao diện ngay tức thì, lưu safeStorage, sau đó đồng bộ nhanh lên Firestore
 */
export async function incrementIntroHearts(style: 'style1' | 'style2'): Promise<void> {
  if (style === 'style1') {
    cachedStyle1Hearts += 1;
    safeStorage.setItem('cosmo_intro_hearts_style1', String(cachedStyle1Hearts));
    style1HeartsListeners.forEach((fn) => fn(cachedStyle1Hearts));
    pendingStyle1Hearts += 1;
  } else {
    cachedStyle2Hearts += 1;
    safeStorage.setItem('cosmo_intro_hearts_style2', String(cachedStyle2Hearts));
    style2HeartsListeners.forEach((fn) => fn(cachedStyle2Hearts));
    pendingStyle2Hearts += 1;
  }
  scheduleHeartsSync();
}

// In-memory cache for intro notes
let cachedStyle1Notes: IntroGuestNote[] = [];
let cachedStyle2Notes: IntroReaderMessage[] = [];
let lastFetchStyle1NotesTime = 0;
let lastFetchStyle2NotesTime = 0;
const style1NotesListeners = new Set<(notes: IntroGuestNote[]) => void>();
const style2NotesListeners = new Set<(notes: IntroReaderMessage[]) => void>();

export async function fetchIntroNotesStyle1(force = false): Promise<IntroGuestNote[]> {
  const now = Date.now();
  if (!force && now - lastFetchStyle1NotesTime < 30 * 60 * 1000 && cachedStyle1Notes.length > 0) {
    return cachedStyle1Notes;
  }
  try {
    const collRef = collection(db, 'gioi_thieu_notes_style1');
    const q = query(collRef, orderBy('createdAt', 'desc'), limit(25));
    const snapshot = await getDocs(q);
    lastFetchStyle1NotesTime = Date.now();
    const notes: IntroGuestNote[] = [];
    snapshot.forEach((d) => {
      const data = d.data();
      notes.push({
        id: d.id,
        author: data.author || 'Bạn đọc ẩn danh ♡',
        content: data.content || '',
        time: data.time || '',
        createdAt: typeof data.createdAt === 'number' ? data.createdAt : 0,
      });
    });
    cachedStyle1Notes = notes;
    style1NotesListeners.forEach((fn) => fn(notes));
    return notes;
  } catch (err) {
    console.warn('[Firebase] Notice fetching style 1 notes:', err);
    return cachedStyle1Notes;
  }
}

/**
 * Lắng nghe danh sách tin nhắn độc giả trong Sổ Kế Hoạch 2 Mặt (Nạp tĩnh 1 lần + Cache, KHÔNG onSnapshot)
 */
export function subscribeToIntroNotesStyle1(
  callback: (notes: IntroGuestNote[]) => void,
  _onError?: (error: unknown) => void
): Unsubscribe {
  style1NotesListeners.add(callback);
  if (cachedStyle1Notes.length > 0) {
    callback(cachedStyle1Notes);
  }
  fetchIntroNotesStyle1(false).then((notes) => callback(notes)).catch(() => {});
  return () => {
    style1NotesListeners.delete(callback);
  };
}

/**
 * Thêm tin nhắn mới vào Sổ Kế Hoạch 2 Mặt (Style 1) lưu Firestore vĩnh viễn
 */
export async function addIntroNoteStyle1(author: string, content: string): Promise<IntroGuestNote> {
  const collRef = collection(db, 'gioi_thieu_notes_style1');
  const newDocRef = doc(collRef);
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
    now.getMinutes()
  ).padStart(2, '0')} ${String(now.getDate()).padStart(2, '0')}/${String(
    now.getMonth() + 1
  ).padStart(2, '0')}`;

  const payload: IntroGuestNote = {
    id: newDocRef.id,
    author: author.trim() || 'Bạn đọc ẩn danh ♡',
    content: content.trim(),
    time: timeStr,
    createdAt: Date.now(),
  };

  try {
    await setDoc(newDocRef, payload);
    cachedStyle1Notes.unshift(payload);
    style1NotesListeners.forEach((fn) => fn([...cachedStyle1Notes]));
    return payload;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `gioi_thieu_notes_style1/${newDocRef.id}`);
  }
}

export async function fetchIntroNotesStyle2(force = false): Promise<IntroReaderMessage[]> {
  const now = Date.now();
  if (!force && now - lastFetchStyle2NotesTime < 30 * 60 * 1000 && cachedStyle2Notes.length > 0) {
    return cachedStyle2Notes;
  }
  try {
    const collRef = collection(db, 'gioi_thieu_notes_style2');
    const q = query(collRef, orderBy('createdAt', 'desc'), limit(25));
    const snapshot = await getDocs(q);
    lastFetchStyle2NotesTime = Date.now();
    const messages: IntroReaderMessage[] = [];
    snapshot.forEach((d) => {
      const data = d.data();
      messages.push({
        id: typeof data.id === 'number' ? data.id : (data.createdAt || Date.now()),
        sender: data.sender || 'Độc giả ẩn danh',
        text: data.text || '',
        time: data.time || 'Vừa xong',
        createdAt: typeof data.createdAt === 'number' ? data.createdAt : 0,
      });
    });
    cachedStyle2Notes = messages;
    style2NotesListeners.forEach((fn) => fn(messages));
    return messages;
  } catch (err) {
    console.warn('[Firebase] Notice fetching style 2 notes:', err);
    return cachedStyle2Notes;
  }
}

/**
 * Lắng nghe danh sách lời nhắn độc giả Máy Trứng Tamagotchi (Nạp tĩnh 1 lần + Cache, KHÔNG onSnapshot)
 */
export function subscribeToIntroNotesStyle2(
  callback: (messages: IntroReaderMessage[]) => void,
  _onError?: (error: unknown) => void
): Unsubscribe {
  style2NotesListeners.add(callback);
  if (cachedStyle2Notes.length > 0) {
    callback(cachedStyle2Notes);
  }
  fetchIntroNotesStyle2(false).then((msgs) => callback(msgs)).catch(() => {});
  return () => {
    style2NotesListeners.delete(callback);
  };
}

/**
 * Thêm lời nhắn mới vào Máy Trứng Tamagotchi (Style 2) lưu Firestore vĩnh viễn
 */
export async function addIntroNoteStyle2(sender: string, text: string): Promise<IntroReaderMessage> {
  const collRef = collection(db, 'gioi_thieu_notes_style2');
  const newDocRef = doc(collRef);
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
    now.getMinutes()
  ).padStart(2, '0')} ${String(now.getDate()).padStart(2, '0')}/${String(
    now.getMonth() + 1
  ).padStart(2, '0')}`;
  const nowTs = Date.now();

  const payload: IntroReaderMessage = {
    id: nowTs,
    sender: sender.trim() || 'Độc giả ẩn danh',
    text: text.trim(),
    time: timeStr,
    createdAt: nowTs,
  };

  try {
    await setDoc(newDocRef, payload);
    cachedStyle2Notes.unshift(payload);
    style2NotesListeners.forEach((fn) => fn([...cachedStyle2Notes]));
    return payload;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `gioi_thieu_notes_style2/${newDocRef.id}`);
  }
}

export {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
};
