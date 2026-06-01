import React, { useState } from 'react';
import { STATUSES, PRIORITIES, MEMBERS, type MondayRow, type StatusKey, type PriorityKey } from './mondayData';

interface ItemPanelProps {
  row: MondayRow;
  onClose: () => void;
  onMutate: (patch: Partial<MondayRow>, activity?: string) => void;
  onAddUpdate: (body: string) => void;
}

const field = 'mt-1 w-full rounded-md border border-md-line bg-white px-3 py-2 text-[13px] text-md-ink outline-none focus:border-md-primary';
const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <label className="text-[11px] font-semibold uppercase tracking-wide text-md-muted">{children}</label>
);

export const ItemPanel: React.FC<ItemPanelProps> = ({ row, onClose, onMutate, onAddUpdate }) => {
  const [tab, setTab] = useState<'detay' | 'updates' | 'activity'>('detay');
  const [comment, setComment] = useState('');
  const updates = row.updates ?? [];
  const activity = row.activity ?? [];

  // @mention: detect the last "@token" being typed.
  const mentionMatch = comment.match(/@(\w*)$/);
  const mentionList = mentionMatch ? MEMBERS.filter((m) => m.toLowerCase().includes(mentionMatch[1].toLowerCase())) : [];
  const pickMention = (name: string) => setComment((c) => c.replace(/@\w*$/, `@${name} `));

  const submitComment = () => {
    if (!comment.trim()) return;
    onAddUpdate(comment.trim());
    setComment('');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-md-ink/30" onClick={onClose}>
      <div className="flex h-full w-full max-w-lg flex-col bg-white shadow-2xl animate-slide-in-right" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-md-line px-6 py-4">
          <input
            value={row.task}
            onChange={(e) => onMutate({ task: e.target.value })}
            className="flex-1 rounded-md bg-transparent px-1 text-xl font-bold text-md-ink outline-none focus:bg-md-hover"
          />
          <button onClick={onClose} className="rounded-md px-2 py-1 text-md-muted hover:bg-md-hover">✕</button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-md-line px-6">
          {([['detay', 'Detaylar'], ['updates', `Güncellemeler${updates.length ? ` (${updates.length})` : ''}`], ['activity', 'Aktivite']] as const).map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)} className={`-mb-px border-b-2 py-3 text-[13px] font-medium ${tab === id ? 'border-md-primary text-md-ink' : 'border-transparent text-md-muted hover:text-md-ink'}`}>
              {label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {tab === 'detay' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Sorumlu</Label>
                <button onClick={() => onMutate({ owner: row.owner === 'filled' ? 'empty' : 'filled' }, 'Sorumlu güncellendi')} className={field + ' flex items-center gap-2'}>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-prio-mid text-[10px] font-bold text-white">{row.owner === 'filled' ? 'OT' : '?'}</span>
                  {row.owner === 'filled' ? 'Orkun Tarhan' : 'Atanmadı'}
                </button>
              </div>
              <div>
                <Label>Durum</Label>
                <select value={row.status} onChange={(e) => onMutate({ status: e.target.value as StatusKey }, `Durum → ${STATUSES[e.target.value as StatusKey].label}`)} className={field} style={{ color: STATUSES[row.status].color }}>
                  {Object.entries(STATUSES).map(([k, v]) => (<option key={k} value={k}>{v.label}</option>))}
                </select>
              </div>
              <div>
                <Label>Öncelik</Label>
                <select value={row.priority} onChange={(e) => onMutate({ priority: e.target.value as PriorityKey }, `Öncelik → ${PRIORITIES[e.target.value as PriorityKey].label}`)} className={field}>
                  {Object.entries(PRIORITIES).map(([k, v]) => (<option key={k} value={k}>{v.label}</option>))}
                </select>
              </div>
              <div>
                <Label>Son tarih</Label>
                <input type="date" onChange={(e) => {
                  if (!e.target.value) return;
                  const d = new Date(e.target.value);
                  onMutate({ date: d.toLocaleString('en-US', { month: 'short', day: 'numeric' }), dateState: d < new Date(new Date().toDateString()) ? 'overdue' : 'neutral' }, 'Tarih güncellendi');
                }} className={field} />
                <p className="mt-1 text-[12px] text-md-muted">{row.date || '—'}</p>
              </div>
              <div>
                <Label>Bütçe</Label>
                <input type="number" value={row.budget} onChange={(e) => onMutate({ budget: Number(e.target.value) })} className={field} />
              </div>
              <div>
                <Label>Zaman Çizelgesi</Label>
                <input value={row.timeline} onChange={(e) => onMutate({ timeline: e.target.value })} className={field} placeholder="May 29 - 30" />
              </div>
              <div className="col-span-2">
                <Label>Notlar</Label>
                <textarea value={row.notes} onChange={(e) => onMutate({ notes: e.target.value })} rows={3} className={field} />
              </div>
            </div>
          )}

          {tab === 'updates' && (
            <div>
              <div className="relative rounded-lg border border-md-line p-3">
                <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={3} placeholder="Bir güncelleme yazın, @ ile birini etiketleyin..." className="w-full resize-none text-[13px] text-md-ink outline-none" />
                {mentionList.length > 0 && (
                  <div className="absolute left-3 top-full z-10 mt-1 w-56 rounded-lg border border-md-line bg-white p-1 shadow-xl animate-scale-in">
                    {mentionList.map((name) => (
                      <button key={name} onClick={() => pickMention(name)} className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13px] hover:bg-md-hover">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-prio-mid text-[10px] font-bold text-white">{name.split(' ').map((w) => w[0]).join('').slice(0, 2)}</span>
                        {name}
                      </button>
                    ))}
                  </div>
                )}
                <div className="mt-2 flex justify-end">
                  <button onClick={submitComment} disabled={!comment.trim()} className="rounded-md bg-md-primary px-4 py-1.5 text-[13px] font-medium text-white disabled:opacity-40">Gönder</button>
                </div>
              </div>
              <div className="mt-4 space-y-3">
                {updates.length === 0 && <p className="text-center text-[13px] text-md-muted">Henüz güncelleme yok.</p>}
                {updates.slice().reverse().map((u) => (
                  <div key={u.id} className="rounded-lg border border-md-line p-3">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-prio-mid text-[10px] font-bold text-white">OT</span>
                      <span className="text-[13px] font-semibold text-md-ink">{u.author}</span>
                      <span className="text-[11px] text-md-muted">{u.ts}</span>
                    </div>
                    <p className="whitespace-pre-wrap text-[13px] text-md-ink">{u.body}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'activity' && (
            <div className="space-y-2">
              {activity.length === 0 && <p className="text-center text-[13px] text-md-muted">Henüz aktivite yok.</p>}
              {activity.slice().reverse().map((a) => (
                <div key={a.id} className="flex items-start gap-3 border-b border-md-line py-2 text-[13px]">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-prio-mid text-[10px] font-bold text-white">OT</span>
                  <div><span className="text-md-ink">{a.text}</span><div className="text-[11px] text-md-muted">{a.ts}</div></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
