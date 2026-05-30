import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Bell, Inbox, UserPlus, HelpCircle, Grid3x3, Star, MoreHorizontal,
  ChevronDown, ChevronRight, Plus, Filter, ArrowUpDown, EyeOff, Home,
  LayoutDashboard, Table2, AlertCircle, Check, Clock, MessageSquarePlus,
  Sparkles, Users, Bookmark, Layers
} from 'lucide-react';
import {
  INITIAL_GROUPS, STATUSES, PRIORITIES,
  type MondayGroup, type MondayRow, type StatusKey, type PriorityKey
} from '../components/monday/mondayData';

const fmtMoney = (n: number) => `$${n.toLocaleString('tr-TR')}`;

/* ============================ Status / Priority editor popup ============================ */
type EditorState =
  | { kind: 'status'; groupId: string; rowId: string; x: number; y: number }
  | { kind: 'priority'; groupId: string; rowId: string; x: number; y: number }
  | null;

const StatusEditorPopup: React.FC<{
  editor: NonNullable<EditorState>;
  onPick: (value: string) => void;
  onClose: () => void;
}> = ({ editor, onPick, onClose }) => {
  const options =
    editor.kind === 'status'
      ? Object.entries(STATUSES).map(([key, v]) => ({ key, ...v }))
      : Object.entries(PRIORITIES).map(([key, v]) => ({ key, ...v }));

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        className="fixed z-50 w-56 rounded-xl border border-md-line bg-white p-2 shadow-2xl animate-scale-in origin-top"
        style={{ top: editor.y, left: editor.x }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-1.5">
          {options.map((opt) => (
            <button
              key={opt.key}
              onClick={() => onPick(opt.key)}
              className="block w-full rounded-md px-3 py-2 text-center text-[13px] font-medium text-white transition hover:brightness-95"
              style={{ backgroundColor: opt.color }}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div className="my-2 border-t border-md-line" />
        <button className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-[13px] text-md-ink hover:bg-md-hover">
          <span>✏️</span> Etiketleri düzenle
        </button>
        <button className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-[13px] text-md-ink hover:bg-md-hover">
          <Sparkles size={15} className="text-prio-mid" /> Etiketleri Otomatik Ata
        </button>
      </div>
    </>
  );
};

/* ============================ Cells ============================ */
const PeopleCell: React.FC<{ owner: 'filled' | 'empty' }> = ({ owner }) =>
  owner === 'filled' ? (
    <div className="flex justify-center">
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-prio-mid text-[11px] font-bold text-white">OT</div>
    </div>
  ) : (
    <div className="flex justify-center">
      <div className="flex h-7 w-7 items-center justify-center rounded-full border border-dashed border-md-line text-md-muted">
        <UserPlus size={13} />
      </div>
    </div>
  );

const LabelCell: React.FC<{ label: string; color: string; onClick: (e: React.MouseEvent) => void }> = ({ label, color, onClick }) => (
  <button
    onClick={onClick}
    className="group relative flex h-9 w-full items-center justify-center text-[13px] font-medium text-white transition hover:brightness-95"
    style={{ backgroundColor: color }}
  >
    {label}
    <span className="absolute bottom-0 right-0 h-0 w-0 border-b-[6px] border-l-[6px] border-b-white/40 border-l-transparent opacity-0 transition group-hover:opacity-100" />
  </button>
);

const DateCell: React.FC<{ date: string; state: MondayRow['dateState'] }> = ({ date, state }) => {
  const icon =
    state === 'overdue' ? <AlertCircle size={15} className="text-md-red" /> :
    state === 'done' ? <Check size={15} className="text-md-green" /> :
    <Clock size={15} className="text-md-muted" />;
  return (
    <div className="flex items-center gap-1.5">
      {icon}
      <span className={`text-[13px] text-md-ink ${state === 'done' ? 'line-through text-md-muted' : ''}`}>{date}</span>
    </div>
  );
};

const TimelineCell: React.FC<{ label: string; color: string; done?: boolean }> = ({ label, color, done }) => (
  <div className="flex h-6 w-full items-center rounded-full bg-md-line/60 px-1">
    <div className="flex h-5 items-center gap-1 rounded-full px-2 text-[11px] font-medium text-white" style={{ backgroundColor: color, width: '100%' }}>
      {done && <Check size={11} />}
      <span className="truncate">{label}</span>
    </div>
  </div>
);

/* ============================ Board table ============================ */
const COLS = [
  { key: 'check', w: 40 },
  { key: 'task', w: 240 },
  { key: 'owner', w: 90 },
  { key: 'status', w: 140 },
  { key: 'date', w: 120 },
  { key: 'priority', w: 130 },
  { key: 'notes', w: 150 },
  { key: 'budget', w: 110 },
  { key: 'files', w: 80 },
  { key: 'timeline', w: 170 },
  { key: 'updated', w: 150 }
];
const HEADERS = ['Görev', 'Sorumlu', 'Durum', 'Son tarih', 'Öncelik', 'Notlar', 'Bütçe', 'Belge', 'Zaman Çizelgesi', 'Son Güncelleme'];

const Group: React.FC<{
  group: MondayGroup;
  selected: Set<string>;
  onToggleRow: (id: string) => void;
  onToggleAll: (rows: MondayRow[], checked: boolean) => void;
  onOpenEditor: (e: React.MouseEvent, kind: 'status' | 'priority', groupId: string, rowId: string) => void;
  onAddRow: (groupId: string) => void;
  onRename: (groupId: string, name: string) => void;
  onToggleCollapse: (groupId: string) => void;
  collapsed: boolean;
}> = ({ group, selected, onToggleRow, onToggleAll, onOpenEditor, onAddRow, onRename, onToggleCollapse, collapsed }) => {
  const rows = group.rows;
  const allChecked = rows.length > 0 && rows.every((r) => selected.has(r.id));
  const budgetTotal = rows.reduce((s, r) => s + r.budget, 0);
  const filesTotal = rows.reduce((s, r) => s + r.files, 0);

  const battery = useMemo(() => {
    const counts: Record<StatusKey, number> = { done: 0, working: 0, stuck: 0, notStarted: 0 };
    rows.forEach((r) => (counts[r.status] += 1));
    return (Object.keys(counts) as StatusKey[]).filter((k) => counts[k] > 0).map((k) => ({ color: STATUSES[k].color, pct: (counts[k] / rows.length) * 100 }));
  }, [rows]);

  return (
    <div className="mb-7 animate-fade-in-up">
      <div className="mb-1 flex items-center gap-1.5">
        <button onClick={() => onToggleCollapse(group.id)} style={{ color: group.color }}>
          <ChevronRight size={18} className={`transition-transform ${collapsed ? '' : 'rotate-90'}`} />
        </button>
        <input
          value={group.name}
          onChange={(e) => onRename(group.id, e.target.value)}
          className="rounded bg-transparent px-1 text-[15px] font-bold outline-none focus:bg-md-hover"
          style={{ color: group.color }}
        />
        <span className="text-[13px] text-md-muted">{rows.length} Görev{rows.length === 1 ? '' : 'ler'}</span>
      </div>

      {!collapsed && (
        <div className="overflow-x-auto rounded-md">
          <table className="border-separate border-spacing-0" style={{ tableLayout: 'fixed' }}>
            <colgroup>
              {COLS.map((c) => (<col key={c.key} style={{ width: c.w }} />))}
            </colgroup>
            <thead>
              <tr className="text-left text-[13px] text-md-muted">
                <th className="sticky left-0 bg-white px-2 py-2" style={{ borderLeft: `6px solid ${group.color}`, borderTopLeftRadius: 6 }}>
                  <input type="checkbox" checked={allChecked} onChange={(e) => onToggleAll(rows, e.target.checked)} className="h-4 w-4 cursor-pointer accent-md-primary" />
                </th>
                {HEADERS.map((h, i) => (
                  <th key={h} className="border-b border-md-line bg-white px-3 py-2 font-normal">
                    <span className="flex items-center gap-1">{h}{i === 2 && <AlertCircle size={12} className="text-md-muted" />}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className={`group text-[13px] ${row.id && selected.has(row.id) ? 'bg-md-sel' : 'hover:bg-md-hover'}`}>
                  <td className="sticky left-0 px-2 py-1.5" style={{ borderLeft: `6px solid ${group.color}`, backgroundColor: selected.has(row.id) ? '#D7E9FF' : undefined }}>
                    <input type="checkbox" checked={selected.has(row.id)} onChange={() => onToggleRow(row.id)} className="h-4 w-4 cursor-pointer accent-md-primary" />
                  </td>
                  <td className="border-b border-r border-md-line px-3 py-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-md-ink">{row.task}</span>
                      <MessageSquarePlus size={15} className="shrink-0 text-md-muted opacity-0 transition group-hover:opacity-100" />
                    </div>
                  </td>
                  <td className="border-b border-r border-md-line px-2 py-1.5"><PeopleCell owner={row.owner} /></td>
                  <td className="border-b border-r border-md-line p-0">
                    <LabelCell label={STATUSES[row.status].label} color={STATUSES[row.status].color} onClick={(e) => onOpenEditor(e, 'status', group.id, row.id)} />
                  </td>
                  <td className="border-b border-r border-md-line px-3 py-1.5"><DateCell date={row.date} state={row.dateState} /></td>
                  <td className="border-b border-r border-md-line p-0">
                    <LabelCell label={PRIORITIES[row.priority].label} color={PRIORITIES[row.priority].color} onClick={(e) => onOpenEditor(e, 'priority', group.id, row.id)} />
                  </td>
                  <td className="border-b border-r border-md-line px-3 py-1.5 text-md-ink">{row.notes}</td>
                  <td className="border-b border-r border-md-line px-3 py-1.5 text-right text-md-ink">{fmtMoney(row.budget)}</td>
                  <td className="border-b border-r border-md-line px-3 py-1.5 text-center text-md-muted">{row.files > 0 ? '📎' : ''}</td>
                  <td className="border-b border-r border-md-line px-2 py-1.5"><TimelineCell label={row.timeline} color={row.timelineColor} done={row.dateState === 'done'} /></td>
                  <td className="border-b border-md-line px-3 py-1.5">
                    <div className="flex items-center gap-1.5">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-prio-mid text-[9px] font-bold text-white">OT</div>
                      <span className="truncate text-[12px] text-md-muted">{row.updated}</span>
                    </div>
                  </td>
                </tr>
              ))}

              {/* Add row */}
              <tr>
                <td className="sticky left-0 bg-white" style={{ borderLeft: `6px solid ${group.color}` }} />
                <td colSpan={HEADERS.length} className="border-b border-md-line px-3 py-1.5">
                  <button onClick={() => onAddRow(group.id)} className="flex items-center gap-1.5 text-[13px] text-md-muted hover:text-md-primary">
                    <Plus size={14} /> görev ekle
                  </button>
                </td>
              </tr>
            </tbody>

            {/* Footer summary */}
            <tfoot>
              <tr className="text-[12px]">
                <td className="sticky left-0 bg-white" style={{ borderLeft: `6px solid ${group.color}` }} />
                <td /><td />
                <td className="px-3 py-2 align-middle">
                  {rows.length > 0 && (
                    <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-md-line">
                      {battery.map((b, i) => (<div key={i} style={{ width: `${b.pct}%`, backgroundColor: b.color }} />))}
                    </div>
                  )}
                </td>
                <td />
                <td className="px-3 py-1 text-center text-md-muted" />
                <td />
                <td className="px-3 py-1 text-right">
                  <div className="font-semibold text-md-ink">{fmtMoney(budgetTotal)}</div>
                  <div className="text-[10px] text-md-muted">Toplam</div>
                </td>
                <td className="px-3 py-1 text-center">
                  <div className="font-semibold text-md-ink">{filesTotal}</div>
                  <div className="text-[10px] text-md-muted">Belge</div>
                </td>
                <td /><td />
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
};

/* ============================ Chrome (rail / sidebar / topbar / header / toolbar) ============================ */
const IconRail: React.FC = () => {
  const items = [
    { Icon: Grid3x3, label: 'Çalışma al...', active: true },
    { Icon: Sparkles, label: 'Sidekick' },
    { Icon: Users, label: 'Temsilciler' },
    { Icon: Layers, label: 'Vibe' },
    { Icon: Bookmark, label: 'Not tutucu' },
    { Icon: Star, label: 'Favoriler' },
    { Icon: MoreHorizontal, label: 'Daha fazla' }
  ];
  return (
    <div className="flex w-[70px] shrink-0 flex-col items-center gap-1 bg-md-sidebar py-3">
      {items.map(({ Icon, label, active }) => (
        <button key={label} className={`flex w-full flex-col items-center gap-1 rounded-lg py-2 text-[10px] ${active ? 'bg-white text-md-primary shadow-sm' : 'text-md-muted hover:bg-white/60'}`}>
          <Icon size={20} />
          <span className="w-full truncate px-1 text-center leading-tight">{label}</span>
        </button>
      ))}
    </div>
  );
};

const WorkspaceSidebar: React.FC = () => (
  <div className="flex w-[280px] shrink-0 flex-col border-r border-md-line bg-white">
    <div className="flex items-center justify-between px-4 py-3">
      <span className="text-[15px] font-semibold text-md-ink">Çalışma alanı</span>
      <div className="flex items-center gap-2 text-md-muted">
        <MoreHorizontal size={16} /><Search size={16} /><ChevronDown className="-rotate-90" size={16} />
      </div>
    </div>
    <div className="flex items-center gap-2 px-4 pb-3">
      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#ff642e] text-sm font-bold text-white">A</div>
      <span className="flex-1 text-[14px] font-medium text-md-ink">Ana çalışma alanı</span>
      <ChevronDown size={16} className="text-md-muted" />
      <button className="flex h-7 w-7 items-center justify-center rounded-md border border-md-line text-md-muted hover:bg-md-hover"><Plus size={16} /></button>
    </div>
    <div className="px-2">
      <div className="flex items-center justify-between rounded-md px-2 py-2 text-[13px] font-medium text-md-ink hover:bg-md-hover">
        Çalışma Alanı Temsilcilerim <ChevronRight size={14} className="text-md-muted" />
      </div>
      <div className="flex items-center gap-1 px-2 py-2 text-[13px] font-medium text-md-ink">İçerik <ChevronDown size={14} className="text-md-muted" /></div>
      <NavItem Icon={Home} label="Çalışma Alanı Ana Sayfası" />
      <NavItem Icon={Table2} label="Test" active />
      <NavItem Icon={LayoutDashboard} label="Gösterge tabloları ve raporlama" />
    </div>
  </div>
);

const NavItem: React.FC<{ Icon: React.ComponentType<any>; label: string; active?: boolean }> = ({ Icon, label, active }) => (
  <div className={`flex items-center gap-2 rounded-md px-2 py-2 text-[13px] ${active ? 'bg-md-sel/60 font-semibold text-md-ink' : 'text-md-ink hover:bg-md-hover'}`}>
    <Icon size={16} className="text-md-muted" />
    <span className="truncate">{label}</span>
  </div>
);

const TopBar: React.FC<{ onExit: () => void }> = ({ onExit }) => (
  <div className="flex h-14 shrink-0 items-center justify-between border-b border-md-line bg-white px-4">
    <div className="flex items-center gap-3">
      <button onClick={onExit} className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-[#ff3d57] via-[#ffcb00] to-[#00d647] text-sm font-extrabold text-white" title="Panze'ye dön">m</button>
      <button className="flex items-center gap-1.5 rounded-md border border-md-line px-3 py-1.5 text-[13px] font-medium text-md-ink hover:bg-md-hover">
        <span className="text-md-primary">◆</span> Planlara göz atın
      </button>
    </div>
    <div className="flex w-[420px] items-center gap-2 rounded-md bg-md-hover px-3 py-2">
      <Search size={16} className="text-md-muted" />
      <input placeholder="Her şeyi arayın . . ." className="flex-1 bg-transparent text-[13px] text-md-ink outline-none placeholder:text-md-muted" />
      <span className="rounded bg-white px-1.5 py-0.5 text-[11px] text-md-muted shadow-sm">Ctrl K</span>
    </div>
    <div className="flex items-center gap-1 text-md-muted">
      <IconBtn Icon={Bell} />
      <div className="relative"><IconBtn Icon={Inbox} /><span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-md-red text-[9px] font-bold text-white">1</span></div>
      <IconBtn Icon={UserPlus} />
      <IconBtn Icon={Grid3x3} />
      <IconBtn Icon={HelpCircle} />
      <div className="ml-1 flex h-8 w-8 items-center justify-center rounded-full bg-prio-high text-[11px] font-bold text-white">OT</div>
    </div>
  </div>
);

const IconBtn: React.FC<{ Icon: React.ComponentType<any> }> = ({ Icon }) => (
  <button className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-md-hover"><Icon size={19} /></button>
);

const BoardHeader: React.FC = () => (
  <div className="px-6 pt-5">
    <div className="flex items-center gap-2">
      <h1 className="text-[26px] font-bold text-md-ink">Test</h1>
      <ChevronDown size={22} className="text-md-muted" />
    </div>
    <div className="mt-3 flex items-center gap-4 border-b border-md-line">
      <button className="border-b-2 border-md-primary px-1 pb-2 text-[14px] font-medium text-md-ink">Ana Tablo</button>
      <button className="pb-2 text-md-muted"><MoreHorizontal size={16} /></button>
      <button className="pb-2 text-md-muted"><Plus size={16} /></button>
    </div>
  </div>
);

const BoardToolbar: React.FC<{ onNewTask: () => void }> = ({ onNewTask }) => (
  <div className="flex items-center gap-2 px-6 py-3">
    <div className="flex items-stretch">
      <button onClick={onNewTask} className="rounded-l-md bg-md-primary px-4 py-2 text-[14px] font-medium text-white hover:brightness-95">Yeni görev</button>
      <button onClick={onNewTask} className="rounded-r-md border-l border-white/20 bg-md-primary px-2 text-white hover:brightness-95"><ChevronDown size={16} /></button>
    </div>
    <ToolBtn Icon={Search} label="Aramalar" />
    <ToolBtn Icon={Users} label="Kişi" />
    <ToolBtn Icon={Filter} label="Filtre" caret />
    <ToolBtn Icon={ArrowUpDown} label="Sırala" />
    <ToolBtn Icon={EyeOff} label="Gizle" />
    <ToolBtn Icon={Layers} label="Grupla:" />
    <button className="flex h-8 w-8 items-center justify-center rounded-md text-md-muted hover:bg-md-hover"><MoreHorizontal size={18} /></button>
  </div>
);

const ToolBtn: React.FC<{ Icon: React.ComponentType<any>; label: string; caret?: boolean }> = ({ Icon, label, caret }) => (
  <button className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[13px] text-md-ink hover:bg-md-hover">
    <Icon size={16} className="text-md-muted" /> {label}{caret && <ChevronDown size={13} className="text-md-muted" />}
  </button>
);

/* ============================ Page ============================ */
export const MondayBoardPage: React.FC = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState<MondayGroup[]>(INITIAL_GROUPS);
  const [selected, setSelected] = useState<Set<string>>(() => new Set(INITIAL_GROUPS.flatMap((g) => g.rows.filter((r) => r.selected).map((r) => r.id))));
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [editor, setEditor] = useState<EditorState>(null);

  const mutateRow = (groupId: string, rowId: string, patch: Partial<MondayRow>) =>
    setGroups((gs) => gs.map((g) => (g.id === groupId ? { ...g, rows: g.rows.map((r) => (r.id === rowId ? { ...r, ...patch } : r)) } : g)));

  const openEditor = (e: React.MouseEvent, kind: 'status' | 'priority', groupId: string, rowId: string) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setEditor({ kind, groupId, rowId, x: rect.left, y: rect.bottom + 4 });
  };

  const pickValue = (value: string) => {
    if (!editor) return;
    if (editor.kind === 'status') mutateRow(editor.groupId, editor.rowId, { status: value as StatusKey });
    else mutateRow(editor.groupId, editor.rowId, { priority: value as PriorityKey });
    setEditor(null);
  };

  const addRow = (groupId: string) =>
    setGroups((gs) =>
      gs.map((g) =>
        g.id === groupId
          ? {
              ...g,
              rows: [...g.rows, {
                id: `r-${g.rows.length}-${g.id}-${g.rows.length + 1}`,
                task: `Görev ${g.rows.length + 1}`, owner: 'empty', status: 'notStarted', date: '', dateState: 'neutral',
                priority: 'low', notes: '', budget: 0, files: 0, timeline: '', timelineColor: '#579BFC', updated: 'şimdi'
              }]
            }
          : g
      )
    );

  const addGroup = () =>
    setGroups((gs) => [...gs, { id: `g-${gs.length}-new`, name: `Yeni grup ${gs.length + 1}`, color: '#a25ddc', rows: [] }]);

  const toggleRow = (id: string) =>
    setSelected((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const toggleAll = (rows: MondayRow[], checked: boolean) =>
    setSelected((prev) => { const n = new Set(prev); rows.forEach((r) => (checked ? n.add(r.id) : n.delete(r.id))); return n; });

  return (
    <div className="flex h-screen flex-col bg-white text-md-ink" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <TopBar onExit={() => navigate('/dashboard')} />
      <div className="flex min-h-0 flex-1">
        <IconRail />
        <WorkspaceSidebar />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <BoardHeader />
          <BoardToolbar onNewTask={() => addRow(groups[0].id)} />
          <div className="flex-1 overflow-auto px-6 pb-10">
            {groups.map((group) => (
              <Group
                key={group.id}
                group={group}
                selected={selected}
                collapsed={collapsed.has(group.id)}
                onToggleRow={toggleRow}
                onToggleAll={toggleAll}
                onOpenEditor={openEditor}
                onAddRow={addRow}
                onRename={(gid, name) => setGroups((gs) => gs.map((g) => (g.id === gid ? { ...g, name } : g)))}
                onToggleCollapse={(gid) => setCollapsed((prev) => { const n = new Set(prev); n.has(gid) ? n.delete(gid) : n.add(gid); return n; })}
              />
            ))}
            <button onClick={addGroup} className="mt-2 flex items-center gap-1.5 rounded-md border border-md-line px-3 py-2 text-[13px] text-md-muted hover:bg-md-hover">
              <Plus size={15} /> Yeni grup ekle
            </button>
          </div>
        </div>
      </div>

      {/* Floating help/AI bubble */}
      <button className="fixed bottom-5 right-5 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#ff3d57] via-[#ffcb00] to-[#00d647] shadow-lg" title="Nasıl yardımcı olabilirim?">
        <Sparkles size={22} className="text-white" />
      </button>

      {editor && <StatusEditorPopup editor={editor} onPick={pickValue} onClose={() => setEditor(null)} />}
    </div>
  );
};
