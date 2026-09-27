/**
 * Safe localStorage wrapper with in-memory fallback.
 * Prevents "SecurityError: Access is denied for this document" in sandboxed or cross-origin iframes.
 */
class SafeStorage {
  private memoryFallback: Map<string, string> = new Map();
  private sessionMemoryFallback: Map<string, string> = new Map();

  getItem(key: string): string | null {
    try {
      if (typeof window !== 'undefined' && 'localStorage' in window) {
        return window.localStorage.getItem(key);
      }
    } catch {
      // In sandboxed iframes or private browsing modes, accessing window.localStorage may throw
    }
    return this.memoryFallback.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    try {
      if (typeof window !== 'undefined' && 'localStorage' in window) {
        window.localStorage.setItem(key, value);
        return;
      }
    } catch {
      // Sandboxed or storage quota exceeded
    }
    this.memoryFallback.set(key, value);
  }

  removeItem(key: string): void {
    try {
      if (typeof window !== 'undefined' && 'localStorage' in window) {
        window.localStorage.removeItem(key);
        return;
      }
    } catch {
      // Sandboxed
    }
    this.memoryFallback.delete(key);
  }

  getSessionItem(key: string): string | null {
    try {
      if (typeof window !== 'undefined' && 'sessionStorage' in window) {
        return window.sessionStorage.getItem(key);
      }
    } catch {
      // Sandboxed or storage blocked
    }
    return this.sessionMemoryFallback.get(key) ?? null;
  }

  setSessionItem(key: string, value: string): void {
    try {
      if (typeof window !== 'undefined' && 'sessionStorage' in window) {
        window.sessionStorage.setItem(key, value);
        return;
      }
    } catch {
      // Sandboxed
    }
    this.sessionMemoryFallback.set(key, value);
  }

  removeSessionItem(key: string): void {
    try {
      if (typeof window !== 'undefined' && 'sessionStorage' in window) {
        window.sessionStorage.removeItem(key);
        return;
      }
    } catch {
      // Sandboxed
    }
    this.sessionMemoryFallback.delete(key);
  }
}

export const safeStorage = new SafeStorage();
