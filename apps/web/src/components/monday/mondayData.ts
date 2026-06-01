export type StatusKey = 'done' | 'working' | 'stuck' | 'notStarted';
export type PriorityKey = 'low' | 'mid' | 'high';
export type DateState = 'overdue' | 'done' | 'neutral';

export const STATUSES: Record<StatusKey, { label: string; color: string }> = {
  done: { label: 'Tamamlandı', color: '#00C875' },
  working: { label: 'Yapılmakta', color: '#FDAB3D' },
  stuck: { label: 'Takılı', color: '#E2445C' },
  notStarted: { label: 'Başlamadı', color: '#C4C4C4' }
};

export const PRIORITIES: Record<PriorityKey, { label: string; color: string }> = {
  low: { label: 'Düşük', color: '#579BFC' },
  mid: { label: 'Orta', color: '#5559DF' },
  high: { label: 'Yüksek', color: '#401694' }
};

export type MondayUpdate = { id: string; author: string; body: string; ts: string };
export type MondayActivity = { id: string; text: string; ts: string };

export type MondayRow = {
  id: string;
  task: string;
  owner: 'filled' | 'empty';
  status: StatusKey;
  date: string;
  dateState: DateState;
  selected?: boolean;
  priority: PriorityKey;
  notes: string;
  budget: number;
  files: number;
  timeline: string;
  timelineColor: string;
  updated: string;
  updates?: MondayUpdate[];
  activity?: MondayActivity[];
};

export const MEMBERS = ['Orkun Tarhan', 'Alice Yılmaz', 'Bob Demir', 'Ceyda Arslan'];

export const QUOTES = [
  'Başlamak, bitirmenin yarısıdır.',
  'Küçük adımlar büyük yolculuklar yaratır.',
  'Bugün yapabileceğini yarına bırakma.',
  'Disiplin, hedef ile başarı arasındaki köprüdür.',
  'En iyi zaman şu an.'
];

export type SystemRole = 'ADMIN' | 'MEMBER' | 'VIEWER';

// Parse a "MMM D" label (e.g. "May 29") to a Date in the given year.
export const parseDateLabel = (label: string, year = 2026): Date | null => {
  if (!label) return null;
  const d = new Date(`${label} ${year}`);
  return isNaN(d.getTime()) ? null : d;
};

export type MondayGroup = {
  id: string;
  name: string;
  color: string;
  rows: MondayRow[];
};

export const INITIAL_GROUPS: MondayGroup[] = [
  {
    id: 'g-todo',
    name: 'Yapılacaklar',
    color: '#00C9C9',
    rows: [
      { id: 'r1', task: 'Görev 1', owner: 'filled', status: 'working', date: 'May 29', dateState: 'overdue', priority: 'low', notes: 'Eylem Öğeleri', budget: 100, files: 1, timeline: 'May 29 - 30', timelineColor: '#579BFC', updated: '7 dakika ön...' },
      { id: 'r2', task: 'Görev 2', owner: 'empty', status: 'done', date: 'May 30', dateState: 'done', priority: 'high', notes: 'Toplantı Notları', budget: 1000, files: 0, timeline: 'May 31 - ...', timelineColor: '#00C875', updated: '7 dakika ön...' },
      { id: 'r3', task: 'Görev 3', owner: 'empty', status: 'stuck', date: 'May 31', dateState: 'neutral', selected: true, priority: 'mid', notes: 'Diğer', budget: 500, files: 0, timeline: 'Haz 2 - 3', timelineColor: '#333333', updated: '7 dakika ön...' }
    ]
  },
  {
    id: 'g-done',
    name: 'Bitti',
    color: '#00C875',
    rows: []
  }
];
