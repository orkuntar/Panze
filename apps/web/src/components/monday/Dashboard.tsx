import React, { useEffect, useMemo, useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { STATUSES, QUOTES, MEMBERS, type MondayGroup, type StatusKey } from './mondayData';

type WidgetType = 'numbers' | 'battery' | 'goal' | 'chart' | 'cards' | 'countdown' | 'quote' | 'text' | 'todo' | 'time';
type Widget = { id: string; type: WidgetType; title: string; opt?: any };

const STORAGE = 'panze-monday-dashboard';
const uid = () => `w-${Date.now()}-${Math.round(Math.random() * 1e5)}`;

const DEFAULT: Widget[] = [
  { id: 'w1', type: 'numbers', title: 'Toplam Görev', opt: { metric: 'count' } },
  { id: 'w2', type: 'battery', title: 'İlerleme' },
  { id: 'w3', type: 'goal', title: 'Tamamlanma Hedefi', opt: { target: 5 } },
  { id: 'w4', type: 'chart', title: 'Duruma Göre Dağılım' },
  { id: 'w5', type: 'numbers', title: 'Toplam Bütçe', opt: { metric: 'budget' } },
  { id: 'w6', type: 'countdown', title: 'Teslim Tarihi', opt: { date: '2026-06-30' } },
  { id: 'w7', type: 'quote', title: 'Günün Alıntısı' },
  { id: 'w8', type: 'cards', title: 'Görev Kartları' }
];

const MENU: { type: WidgetType; label: string; opt?: any }[] = [
  { type: 'numbers', label: 'Sayı — Görev sayısı', opt: { metric: 'count' } },
  { type: 'numbers', label: 'Sayı — Toplam bütçe', opt: { metric: 'budget' } },
  { type: 'battery', label: 'Pil (Battery)' },
  { type: 'goal', label: 'Hedef (Goal)', opt: { target: 5 } },
  { type: 'chart', label: 'Grafik — Durum' },
  { type: 'cards', label: 'Kartlar (Cards)' },
  { type: 'countdown', label: 'Geri Sayım', opt: { date: '2026-06-30' } },
  { type: 'quote', label: 'Günün Alıntısı' },
  { type: 'text', label: 'Metin bloğu', opt: { text: 'Not yazın...' } },
  { type: 'todo', label: 'Yapılacaklar listesi' },
  { type: 'time', label: 'Zaman Takibi' }
];

const loadWidgets = (): Widget[] => {
  try { const raw = localStorage.getItem(STORAGE); if (raw) return JSON.parse(raw) as Widget[]; } catch { /* seed */ }
  return DEFAULT;
};

export const Dashboard: React.FC<{ groups: MondayGroup[] }> = ({ groups }) => {
  const [widgets, setWidgets] = useState<Widget[]>(loadWidgets);
  const [menuOpen, setMenuOpen] = useState(false);
  const rows = useMemo(() => groups.flatMap((g) => g.rows), [groups]);

  useEffect(() => { localStorage.setItem(STORAGE, JSON.stringify(widgets)); }, [widgets]);

  const counts = useMemo(() => {
    const c: Record<StatusKey, number> = { done: 0, working: 0, stuck: 0, notStarted: 0 };
    rows.forEach((r) => (c[r.status] += 1));
    return c;
  }, [rows]);

  const add = (m: typeof MENU[number]) => { setWidgets((w) => [...w, { id: uid(), type: m.type, title: m.label.split('—')[0].trim(), opt: m.opt }]); setMenuOpen(false); };
  const remove = (id: string) => setWidgets((w) => w.filter((x) => x.id !== id));
  const patch = (id: string, opt: any) => setWidgets((w) => w.map((x) => (x.id === id ? { ...x, opt: { ...x.opt, ...opt } } : x)));

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[18px] font-bold text-md-ink">Dashboard</h2>
        <div className="relative">
          <button onClick={() => setMenuOpen((o) => !o)} className="rounded-md bg-md-primary px-3 py-1.5 text-[13px] font-medium text-white hover:brightness-95">+ Gösterge Ekle</button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 z-40 mt-1 w-64 rounded-lg border border-md-line bg-white p-1 shadow-2xl animate-scale-in">
                {MENU.map((m, i) => (
                  <button key={i} onClick={() => add(m)} className="block w-full rounded-md px-3 py-2 text-left text-[13px] text-md-ink hover:bg-md-hover">{m.label}</button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {widgets.map((w) => (
          <div key={w.id} className="group relative rounded-xl border border-md-line bg-white p-5 shadow-sm card-hover">
            <button onClick={() => remove(w.id)} className="absolute right-3 top-3 text-md-line opacity-0 transition group-hover:opacity-100 hover:text-md-red" title="Kaldır">✕</button>
            <p className="mb-3 text-[13px] font-semibold text-md-muted">{w.title}</p>
            <WidgetBody widget={w} rows={rows} counts={counts} patch={patch} />
          </div>
        ))}
      </div>
    </div>
  );
};

const WidgetBody: React.FC<{ widget: Widget; rows: any[]; counts: Record<StatusKey, number>; patch: (id: string, opt: any) => void }> = ({ widget: w, rows, counts, patch }) => {
  const total = rows.length || 1;
  switch (w.type) {
    case 'numbers': {
      const val = w.opt?.metric === 'budget' ? `$${rows.reduce((s, r) => s + r.budget, 0).toLocaleString('tr-TR')}` : rows.length;
      return <div className="text-4xl font-extrabold text-md-ink">{val}</div>;
    }
    case 'battery':
      return (
        <div>
          <div className="flex h-4 w-full overflow-hidden rounded-full bg-md-line">
            {(Object.keys(counts) as StatusKey[]).filter((k) => counts[k] > 0).map((k) => (
              <div key={k} style={{ width: `${(counts[k] / total) * 100}%`, backgroundColor: STATUSES[k].color }} />
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-3 text-[12px] text-md-muted">
            {(Object.keys(counts) as StatusKey[]).map((k) => (
              <span key={k} className="flex items-center gap-1"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: STATUSES[k].color }} />{STATUSES[k].label} {counts[k]}</span>
            ))}
          </div>
        </div>
      );
    case 'goal': {
      const done = counts.done;
      const target = w.opt?.target ?? 5;
      const pct = Math.min(100, Math.round((done / target) * 100));
      return (
        <div>
          <div className="flex items-end justify-between"><span className="text-3xl font-bold text-md-ink">{pct}%</span><span className="text-[12px] text-md-muted">{done}/{target} tamamlandı</span></div>
          <div className="mt-2 h-3 overflow-hidden rounded-full bg-md-line"><div className="h-full rounded-full bg-md-green transition-[width] duration-700" style={{ width: `${pct}%` }} /></div>
          <label className="mt-2 block text-[11px] text-md-muted">Hedef: <input type="number" value={target} onChange={(e) => patch(w.id, { target: Number(e.target.value) })} className="w-14 rounded border border-md-line px-1" /></label>
        </div>
      );
    }
    case 'chart': {
      const data = (Object.keys(STATUSES) as StatusKey[]).map((k) => ({ name: STATUSES[k].label, value: counts[k], color: STATUSES[k].color }));
      return (
        <div className="h-44">
          <ResponsiveContainer width="99%" height="100%" minWidth={0}>
            <BarChart data={data}>
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#676879' }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: '#676879' }} axisLine={false} tickLine={false} width={20} />
              <Tooltip />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>{data.map((d, i) => (<Cell key={i} fill={d.color} />))}</Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      );
    }
    case 'cards':
      return (
        <div className="grid grid-cols-2 gap-2">
          {rows.slice(0, 6).map((r) => (
            <div key={r.id} className="rounded-lg border border-md-line p-2">
              <p className="truncate text-[12px] font-medium text-md-ink">{r.task}</p>
              <span className="mt-1 inline-block rounded px-1.5 py-0.5 text-[10px] font-medium text-white" style={{ backgroundColor: STATUSES[r.status as StatusKey].color }}>{STATUSES[r.status as StatusKey].label}</span>
            </div>
          ))}
          {rows.length === 0 && <p className="text-[12px] text-md-muted">Kart yok</p>}
        </div>
      );
    case 'countdown': {
      const date = w.opt?.date ?? '2026-06-30';
      const days = Math.ceil((new Date(date).getTime() - Date.now()) / 86400000);
      return (
        <div>
          <div className="text-4xl font-extrabold text-md-primary">{days > 0 ? days : 0}<span className="ml-1 text-base font-normal text-md-muted">gün</span></div>
          <input type="date" value={date} onChange={(e) => patch(w.id, { date: e.target.value })} className="mt-2 rounded border border-md-line px-2 py-1 text-[12px]" />
        </div>
      );
    }
    case 'quote':
      return <p className="text-[15px] font-medium italic text-md-ink">“{QUOTES[new Date().getDate() % QUOTES.length]}”</p>;
    case 'text':
      return <textarea value={w.opt?.text ?? ''} onChange={(e) => patch(w.id, { text: e.target.value })} rows={4} className="w-full resize-none rounded-md border border-md-line p-2 text-[13px] text-md-ink outline-none focus:border-md-primary" />;
    case 'todo':
      return <TodoWidget />;
    case 'time':
      return (
        <div className="space-y-2">
          {MEMBERS.map((m, i) => (
            <div key={m} className="flex items-center justify-between text-[13px]">
              <span className="text-md-ink">{m}</span>
              <span className="font-semibold text-md-muted">{[8, 5, 6, 3][i] ?? 2}s {[30, 0, 15, 45][i] ?? 0}dk</span>
            </div>
          ))}
        </div>
      );
    default:
      return null;
  }
};

const TodoWidget: React.FC = () => {
  const [items, setItems] = useState<{ id: string; text: string; done: boolean }[]>([{ id: '1', text: 'Sprint planı', done: false }]);
  const [text, setText] = useState('');
  return (
    <div>
      <div className="space-y-1">
        {items.map((it) => (
          <label key={it.id} className="flex items-center gap-2 text-[13px]">
            <input type="checkbox" checked={it.done} onChange={() => setItems((xs) => xs.map((x) => (x.id === it.id ? { ...x, done: !x.done } : x)))} className="accent-md-primary" />
            <span className={it.done ? 'text-md-muted line-through' : 'text-md-ink'}>{it.text}</span>
          </label>
        ))}
      </div>
      <div className="mt-2 flex gap-1">
        <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && text.trim()) { setItems((xs) => [...xs, { id: `${Date.now()}`, text: text.trim(), done: false }]); setText(''); } }} placeholder="Ekle + Enter" className="flex-1 rounded border border-md-line px-2 py-1 text-[12px] outline-none" />
      </div>
    </div>
  );
};
