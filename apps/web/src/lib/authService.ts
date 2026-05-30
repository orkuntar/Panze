export type BrowserUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'MEMBER';
};

const USERS_KEY = 'monday-clone-users';
const CURRENT_USER_KEY = 'monday-clone-current-user';

function loadUsers(): BrowserUser[] {
  const raw = localStorage.getItem(USERS_KEY);
  if (!raw) {
    const defaults: BrowserUser[] = [
      { id: crypto.randomUUID(), name: 'Alice Yılmaz', email: 'alice@example.com', password: 'Password123!', role: 'ADMIN' },
      { id: crypto.randomUUID(), name: 'Bob Demir', email: 'bob@example.com', password: 'Password123!', role: 'MEMBER' },
      { id: crypto.randomUUID(), name: 'Ceyda Arslan', email: 'ceyda@example.com', password: 'Password123!', role: 'MEMBER' },
      { id: crypto.randomUUID(), name: 'Demo Kullanıcı', email: 'demo@example.com', password: 'Password123!', role: 'MEMBER' }
    ];
    localStorage.setItem(USERS_KEY, JSON.stringify(defaults));
    return defaults;
  }
  try {
    return JSON.parse(raw) as BrowserUser[];
  } catch {
    return [];
  }
}

function saveUsers(users: BrowserUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function registerUser(name: string, email: string, password: string) {
  const users = loadUsers();
  const existing = users.find((user) => user.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    throw new Error('Bu email zaten kayıtlı.');
  }
  const user: BrowserUser = { id: crypto.randomUUID(), name, email, password, role: 'MEMBER' };
  users.push(user);
  saveUsers(users);
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  return user;
}

export function loginUser(email: string, password: string) {
  const users = loadUsers();
  const user = users.find((entry) => entry.email.toLowerCase() === email.toLowerCase() && entry.password === password);
  if (!user) {
    throw new Error('Geçersiz email veya parola.');
  }
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  return user;
}

export function getCurrentUser() {
  const raw = localStorage.getItem(CURRENT_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as BrowserUser;
  } catch {
    return null;
  }
}

export function logoutUser() {
  localStorage.removeItem(CURRENT_USER_KEY);
}
