import React, { useState } from 'react';
import { STATUSES, PRIORITIES, parseDateLabel, type MondayGroup, type MondayRow, type StatusKey, type PriorityKey } from './mondayData';

export interface ViewProps {
  groups: MondayGroup[];
  onMutate: (rowId: string, patch: Partial<MondayRow>, activity?: string) => void;
  onOpenItem: (rowId: string) => void;
  onAddItem: (groupId: string, patch?: Partial<MondayRow>) => void;
}

const flatRows = (groups: MondayGroup[]) => groups.flatMap((g) => g.rows.map((r) => ({ ...r, groupId: g.id })));
const MONTHS = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];

/* ============================ Kanban ============================ */
export const KanbanView: React.FC<ViewProps> = ({ groups, onMutate, onOpenItem }) => {
  const [dragId, setDragId] = useState<string | null>(null);
  const [over, setOver] = useState<StatusKey | null>(null);
  const rows = flatRows(groups);
  const statusKeys = Object.keys(STATUSES) as StatusKey[];

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {statusKeys.map((key) => {
        const col = rows.filter((r) => r.status === key);
        return (
          <div
            key={key}
            onDragOver={(e) => { e.preventDefault(); setOver(key); }}
            onDragLeave={() => setOver((p) => (p === key ? null : p))}
            onDrop={() => { if (dragId) onMutate(dragId, { status: key }, `Durum → ${STATUSES[key].label}`); setDragId(null); setOver(null); }}
            className={`flex w-72 shrink-0 flex-col rounded-xl p-3 transition ${over === key ? 'bg-md-primary/10 ring-2 ring-md-primary/30' : 'bg-md-hover'}`}
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="rounded-full px-3 py-1 text-[13px] font-semibold text-white" style={{ backgroundColor: STATUSES[key].color }}>{STATUSES[key].label}</span>
              <span className="text-[12px] text-md-muted">{col.length}</span>
            </div>
            <div className="space-y-2">
              {col.map((row) => (
                <div
                  key={row.id}
                  draggable
                  onDragStart={() => setDragId(row.id)}
                  onDragEnd={() => setDragId(null)}
                  onClick={() => onOpenItem(row.id)}
                  className={`cursor-pointer rounded-lg border border-md-line bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${dragId === row.id ? 'opacity-50' : ''}`}
                >
                  <p className="text-[13px] font-medium text-md-ink">{row.task}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="rounded px-2 py-0.5 text-[11px] font-medium text-white" style={{ backgroundColor: PRIORITIES[row.priority].color }}>{PRIORITIES[row.priority].label}</span>
                    <span className="text-[11px] text-md-muted">{row.date || '—'}</span>
                  </div>
                </div>
              ))}
              {col.length === 0 && <p className="py-4 text-center text-[12px] text-md-muted">Boş</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ============================ Calendar ============================ */
export const CalendarView: React.FC<ViewProps> = ({ groups, onOpenItem, onAddItem }) => {
  const [cur, setCur] = useState({ y: 2026, m: 4 }); // May 2026
  const rows = flatRows(groups);
  const first = new Date(cur.y, cur.m, 1);
  const startDow = (first.getDay() + 6) % 7; // Monday-first
  const daysInMonth = new Date(cur.y, cur.m + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(startDow).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  const itemsOn = (day: number) =>
    rows.filter((r) => {
      const d = parseDateLabel(r.date, cur.y);
      return d && d.getMonth() === cur.m && d.getDate() === day;
    });

  const shift = (delta: number) => setCur((c) => { const d = new Date(c.y, c.m + delta, 1); return { y: d.getFullYear(), m: d.getMonth() }; });

  return (
    <div className="rounded-xl border border-md-line bg-white p-4">
      <div className="mb-4 flex items-center justify-between">
        <button onClick={() => shift(-1)} className="rounded-md px-3 py-1 text-md-muted hover:bg-md-hover">‹</button>
        <h3 className="text-[15px] font-semibold text-md-ink">{MONTHS[cur.m]} {cur.y}</h3>
        <button onClick={() => shift(1)} className="rounded-md px-3 py-1 text-md-muted hover:bg-md-hover">›</button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-md-muted">
        {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map((d) => (<div key={d} className="py-1">{d}</div>))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => (
          <div
            key={i}
            onClick={() => day && onAddItem(groups[0].id, { date: new Date(cur.y, cur.m, day).toLocaleString('en-US', { month: 'short', day: 'numeric' }) })}
            className={`min-h-[84px] rounded-md border p-1 text-left ${day ? 'cursor-pointer border-md-line hover:bg-md-hover' : 'border-transparent'}`}
          >
            {day && <div className="mb-1 text-[11px] text-md-muted">{day}</div>}
            <div className="space-y-1">
              {day && itemsOn(day).map((row) => (
                <button key={row.id} onClick={(e) => { e.stopPropagation(); onOpenItem(row.id); }} className="block w-full truncate rounded px-1.5 py-0.5 text-left text-[11px] font-medium text-white" style={{ backgroundColor: STATUSES[row.status].color }}>
                  {row.task}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[12px] text-md-muted">Boş bir güne tıklayarak o tarihte yeni görev oluşturun.</p>
    </div>
  );
};

/* ============================ Form ============================ */
export const FormView: React.FC<ViewProps> = ({ groups, onAddItem }) => {
  const [task, setTask] = useState('');
  const [status, setStatus] = useState<StatusKey>('notStarted');
  const [priority, setPriority] = useState<PriorityKey>('low');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [sent, setSent] = useState(false);

  const submit = () => {
    if (!task.trim()) return;
    const label = date ? new Date(date).toLocaleString('en-US', { month: 'short', day: 'numeric' }) : '';
    onAddItem(groups[0].id, { task: task.trim(), status, priority, date: label, notes });
    setTask(''); setNotes(''); setDate(''); setStatus('notStarted'); setPriority('low');
    setSent(true);
    setTimeout(() => setSent(false), 2500);
  };

  const inp = 'mt-1 w-full rounded-lg border border-md-line bg-white px-3 py-2 text-[14px] text-md-ink outline-none focus:border-md-primary';

  return (
    <div className="mx-auto max-w-xl">
      <div className="overflow-hidden rounded-2xl border border-md-line bg-white shadow-sm">
        <div className="bg-md-primary px-8 py-6 text-white">
          <h2 className="text-2xl font-bold">Yeni Görev Formu</h2>
          <p className="mt-1 text-[13px] opacity-90">Bu formu doldurarak panoya yeni bir görev gönderin.</p>
        </div>
        <div className="space-y-4 p-8">
          {sent && <div className="rounded-lg bg-md-green/10 px-4 py-3 text-[13px] font-medium text-md-green animate-scale-in">✓ Görev oluşturuldu, teşekkürler!</div>}
          <div>
            <label className="text-[13px] font-semibold text-md-ink">Görev adı <span className="text-md-red">*</span></label>
            <input value={task} onChange={(e) => setTask(e.target.value)} placeholder="Ne yapılması gerekiyor?" className={inp} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[13px] font-semibold text-md-ink">Durum</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as StatusKey)} className={inp}>
                {Object.entries(STATUSES).map(([k, v]) => (<option key={k} value={k}>{v.label}</option>))}
              </select>
            </div>
            <div>
              <label className="text-[13px] font-semibold text-md-ink">Öncelik</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value as PriorityKey)} className={inp}>
                {Object.entries(PRIORITIES).map(([k, v]) => (<option key={k} value={k}>{v.label}</option>))}
              </select>
            </div>
          </div>
          <div>
            <label className="text-[13px] font-semibold text-md-ink">Son tarih</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inp} />
          </div>
          <div>
            <label className="text-[13px] font-semibold text-md-ink">Notlar</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className={inp} />
          </div>
          <button onClick={submit} disabled={!task.trim()} className="w-full rounded-lg bg-md-primary py-3 text-[15px] font-semibold text-white transition hover:brightness-95 disabled:opacity-40">Gönder</button>
        </div>
      </div>
    </div>
  );
};

/* ============================ Gantt ============================ */
export const GanttView: React.FC<ViewProps> = ({ groups, onOpenItem }) => {
  const [cur] = useState({ y: 2026, m: 4 });
  const rows = flatRows(groups);
  const daysInMonth = new Date(cur.y, cur.m + 1, 0).getDate();

  const range = (row: MondayRow) => {
    const parts = row.timeline.split('-').map((s) => s.trim());
    const start = parseDateLabel(parts[0] || row.date, cur.y) ?? parseDateLabel(row.date, cur.y);
    const end = parseDateLabel(parts[1] || '', cur.y) ?? start;
    if (!start) return null;
    return { s: start.getMonth() === cur.m ? start.getDate() : 1, e: (end && end.getMonth() === cur.m ? end.getDate() : start.getDate()) };
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-md-line bg-white p-4">
      <h3 className="mb-3 text-[15px] font-semibold text-md-ink">{MONTHS[cur.m]} {cur.y} — Gantt</h3>
      <div className="mb-2 grid text-center text-[10px] text-md-muted" style={{ gridTemplateColumns: `180px repeat(${daysInMonth}, 1fr)` }}>
        <div />
        {Array.from({ length: daysInMonth }, (_, i) => (<div key={i} className="border-l border-md-line/50 py-0.5">{i + 1}</div>))}
      </div>
      <div className="space-y-1">
        {rows.map((row) => {
          const r = range(row);
          return (
            <div key={row.id} className="grid items-center" style={{ gridTemplateColumns: `180px repeat(${daysInMonth}, 1fr)` }}>
              <button onClick={() => onOpenItem(row.id)} className="truncate pr-2 text-left text-[12px] text-md-ink hover:text-md-primary">{row.task}</button>
              <div className="relative col-span-full col-start-2 h-6">
                {r && (
                  <div
                    onClick={() => onOpenItem(row.id)}
                    className="absolute top-1 h-4 cursor-pointer rounded-full"
                    style={{
                      left: `${((r.s - 1) / daysInMonth) * 100}%`,
                      width: `${((Math.max(r.e, r.s) - r.s + 1) / daysInMonth) * 100}%`,
                      backgroundColor: STATUSES[row.status].color
                    }}
                    title={`${row.task} (${row.timeline || row.date})`}
                  />
                )}
              </div>
            </div>
          );
        })}
        {rows.length === 0 && <p className="py-6 text-center text-[13px] text-md-muted">Görev yok.</p>}
      </div>
    </div>
  );
};
