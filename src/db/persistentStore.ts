import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

export interface PersistentDataStore {
  announcements: any[];
  events: any[];
  fellowships: any[];
  executives: any[];
  historicalExecutives: any[];
  media: any[];
  resources: any[];
  donations: any[];
  systemSettings: Record<string, string>;
  users: any[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const STORE_FILE = path.join(DATA_DIR, 'persistent_records.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (_) {}
}

const getDefaultInitialStore = (): PersistentDataStore => {
  const superEmail = (process.env.SUPERADMIN_EMAIL || 'jayeobapeace19459@gmail.com').toLowerCase().trim();
  const superPin = (process.env.SUPERADMIN_PIN || '1945').trim();
  const proEmail = (process.env.PRO_ADMIN_EMAIL || 'pro@jccf-futa.org').toLowerCase().trim();
  const proPin = (process.env.PRO_ADMIN_PIN || '1945').trim();

  // Pre-hashed default credentials using bcrypt
  const superHash = bcrypt.hashSync(superPin, 10);
  const proHash = bcrypt.hashSync(proPin, 10);

  return {
    // Pure clean database: No dummy data pre-filled.
    announcements: [],
    events: [],
    fellowships: [],
    executives: [],
    historicalExecutives: [],
    media: [],
    resources: [],
    donations: [],
    systemSettings: {
      superadmin_email: superEmail,
      superadmin_pin: superPin,
      pro_admin_email: proEmail,
      pro_admin_pin: proPin,
      academicSession: '2025/2026 Academic Session',
      annualTheme: 'Reigning by Grace & Wisdom',
      themeScripture: 'Romans 5:17 • Daniel 1:17',
      officeEmail: 'futajccf@gmail.com',
      officePhone: '+234 813 456 7890',
      chapelAddress: 'JCCF Secretariat, Near ETF Lecture Theatre, FUTA South Gate',
      youtubeChannel: '@jccf_futa'
    },
    users: [
      {
        id: 1,
        uid: 'superadmin-jayeoba-peace',
        email: superEmail,
        display_name: 'Jayeoba Peace Olamide',
        displayName: 'Jayeoba Peace Olamide',
        role: 'superadmin',
        portfolio: 'Central Executive Council / Superadmin',
        photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        password_hash: superHash,
        passwordHash: superHash,
        phone: '+234 813 987 6543',
        created_at: new Date().toISOString(),
        last_login_at: new Date().toISOString()
      },
      {
        id: 2,
        uid: 'admin-futa-pro',
        email: proEmail,
        display_name: 'JCCF PRO Directorate',
        displayName: 'JCCF PRO Directorate',
        role: 'admin',
        portfolio: 'Public Relations Directorate',
        photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        password_hash: proHash,
        passwordHash: proHash,
        phone: '+234 814 567 8901',
        created_at: new Date().toISOString(),
        last_login_at: new Date().toISOString()
      }
    ]
  };
};

class PersistentStoreService {
  private data: PersistentDataStore;

  constructor() {
    this.data = this.loadFromDisk();
  }

  private loadFromDisk(): PersistentDataStore {
    try {
      if (fs.existsSync(STORE_FILE)) {
        const raw = fs.readFileSync(STORE_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          const defaults = getDefaultInitialStore();
          const loaded: PersistentDataStore = {
            announcements: Array.isArray(parsed.announcements) ? parsed.announcements : [],
            events: Array.isArray(parsed.events) ? parsed.events : [],
            fellowships: Array.isArray(parsed.fellowships) ? parsed.fellowships : [],
            executives: Array.isArray(parsed.executives) ? parsed.executives : [],
            historicalExecutives: Array.isArray(parsed.historicalExecutives) ? parsed.historicalExecutives : [],
            media: Array.isArray(parsed.media) ? parsed.media : [],
            resources: Array.isArray(parsed.resources) ? parsed.resources : [],
            donations: Array.isArray(parsed.donations) ? parsed.donations : [],
            users: (Array.isArray(parsed.users) && parsed.users.length > 0) ? parsed.users : defaults.users,
            systemSettings: { ...defaults.systemSettings, ...(parsed.systemSettings || {}) }
          };
          return loaded;
        }
      }
    } catch (err) {
      console.warn('PersistentStore: Could not load existing store, initializing defaults.', err);
    }

    const initial = getDefaultInitialStore();
    this.saveToDisk(initial);
    return initial;
  }

  private saveToDisk(dataToSave?: PersistentDataStore): void {
    try {
      const data = dataToSave || this.data;
      fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('PersistentStore: Failed to save store to disk:', err);
    }
  }

  public getData(): PersistentDataStore {
    return this.data;
  }

  public getTable<T = any>(table: keyof Omit<PersistentDataStore, 'systemSettings'>): T[] {
    return (this.data[table] || []) as T[];
  }

  public insert<T = any>(table: keyof Omit<PersistentDataStore, 'systemSettings'>, item: any): T {
    const list = this.data[table] as any[];
    const nextId = list.reduce((max, curr) => Math.max(max, Number(curr.id) || 0), 0) + 1;
    const record = {
      ...item,
      id: item.id || nextId,
      created_at: item.created_at || new Date().toISOString()
    };
    list.push(record);
    this.saveToDisk();
    return record as T;
  }

  public update<T = any>(table: keyof Omit<PersistentDataStore, 'systemSettings'>, id: number | string, patch: any): T | null {
    const list = this.data[table] as any[];
    const idx = list.findIndex(r => String(r.id) === String(id));
    if (idx === -1) return null;
    const updated = { ...list[idx], ...patch, updated_at: new Date().toISOString() };
    list[idx] = updated;
    this.saveToDisk();
    return updated as T;
  }

  public delete(table: keyof Omit<PersistentDataStore, 'systemSettings'>, id: number | string): boolean {
    const list = this.data[table] as any[];
    const prevLen = list.length;
    this.data[table] = list.filter(r => String(r.id) !== String(id)) as any;
    const changed = this.data[table].length !== prevLen;
    if (changed) this.saveToDisk();
    return changed;
  }

  public getSetting(key: string): string | undefined {
    return this.data.systemSettings[key];
  }

  public setSetting(key: string, value: string): void {
    this.data.systemSettings[key] = value;
    this.saveToDisk();
  }

  public getAllSettings(): Record<string, string> {
    return { ...this.data.systemSettings };
  }
}

export const persistentStore = new PersistentStoreService();
