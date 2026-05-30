import React, { useEffect, useMemo, useState } from 'react';
import { Star, ExternalLink, Paperclip, ChevronRight, Plus, Trash2 } from 'lucide-react';
import type { DemoWorkspace, DemoTable, DemoTableGroup, DemoTableRow, TableColumnType } from '../../lib/demoData';
import { useT } from '../../lib/i18n';

const typeLabel: Record<TableColumnType, string> = {
  text: 'Text',
  longtext: 'Long Text',
  status: 'Status',
  date: 'Date',
  person: 'Person',
  number: 'Number',
  checkbox: 'Checkbox',
  rating: 'Rating',
  url: 'Link',
  file: 'File',
  tags: 'Tags'
};

const GROUP_COLORS = ['#579bfc', '#00c875', '#a25ddc', '#fdab3d', '#df2f4a', '#9cd326', '#66ccff', '#ff5ac4'];

// Monday-like status coloring: match common keywords first, else cycle the palette by option index.
const STATUS_PALETTE = ['#c4c4c4', '#fdab3d', '#00c875', '#df2f4a', '#579bfc', '#a25ddc', '#9cd326', '#ff5ac4'];
const statusColor = (value: string, options: string[] = []) => {
  const v = value.toLowerCase();
  if (/(done|tamamla|complete|bitti|paid)/.test(v)) return '#00c875';
  if (/(doing|progress|working|yapıl|çalış|pending)/.test(v)) return '#fdab3d';
  if (/(stuck|block|takıl|overdue|hata)/.test(v)) return '#df2f4a';
  if (/(to do|todo|backlog|yapılacak|new)/.test(v)) return '#c4c4c4';
  const idx = options.indexOf(value);
  return STATUS_PALETTE[(idx >= 0 ? idx : 0) % STATUS_PALETTE.length];
};

const defaultValue = (type: TableColumnType) => {
  if (type === 'status') return 'To Do';
  if (type === 'date') return new Date().toISOString().slice(0, 10);
  if (type === 'number') return '0';
  if (type === 'checkbox') return 'false';
  if (type === 'rating') return '0';
  return '';
};

interface TableBoardCardProps {
  workspace: DemoWorkspace;
  onWorkspaceChange: (workspace: DemoWorkspace) => void;
}

export const TableBoardCard: React.FC<TableBoardCardProps> = ({ workspace, onWorkspaceChange }) => {
  const t = useT();
  const [activeTableId, setActiveTableId] = useState(() => workspace.tables?.[0]?.id ?? '');
  const [showCreateTableForm, setShowCreateTableForm] = useState(false);
  const [showCreateColumnForm, setShowCreateColumnForm] = useState(false);
  const [newTableName, setNewTableName] = useState('');
  const [newColumnName, setNewColumnName] = useState('');
  const [newColumnType, setNewColumnType] = useState<TableColumnType>('text');
  const [sort, setSort] = useState<{ columnId: string; dir: 'asc' | 'desc' } | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!activeTableId && workspace.tables?.[0]?.id) setActiveTableId(workspace.tables[0].id);
  }, [activeTableId, workspace.tables]);

  const table = useMemo(
    () => workspace.tables?.find((tbl) => tbl.id === activeTableId) ?? workspace.tables?.[0],
    [activeTableId, workspace.tables]
  );

  const updateTable = (update: (table: DemoTable) => DemoTable) => {
    if (!table) return;
    onWorkspaceChange({ ...workspace, tables: workspace.tables.map((item) => (item.id === table.id ? update(item) : item)) });
  };

  const addTable = () => {
    if (!newTableName.trim()) return;
    const gid = `group-${Date.now()}`;
    const next: DemoTable = {
      id: `table-${Date.now()}`,
      name: newTableName,
      columns: [
        { id: `col-${Date.now() + 1}`, name: 'Task Name', type: 'text' },
        { id: `col-${Date.now() + 2}`, name: 'Status', type: 'status', options: ['To Do', 'Doing', 'Done'] }
      ],
      groups: [{ id: gid, name: 'Grup 1', color: GROUP_COLORS[0] }],
      rows: []
    };
    onWorkspaceChange({ ...workspace, tables: [...workspace.tables, next] });
    setActiveTableId(next.id);
    setNewTableName('');
    setShowCreateTableForm(false);
  };

  const addColumn = () => {
    if (!table || !newColumnName.trim()) return;
    const column = {
      id: `col-${Date.now()}`,
      name: newColumnName,
      type: newColumnType,
      options: newColumnType === 'status' ? ['To Do', 'Doing', 'Done'] : undefined
    };
    updateTable((curr) => ({
      ...curr,
      columns: [...curr.columns, column],
      rows: curr.rows.map((row) => ({ ...row, values: { ...row.values, [column.id]: defaultValue(newColumnType) } }))
    }));
    setNewColumnName('');
    setNewColumnType('text');
    setShowCreateColumnForm(false);
  };

  const addRowToGroup = (groupId: string) => {
    if (!table) return;
    const row: DemoTableRow = {
      id: `row-${Date.now()}`,
      groupId,
      values: Object.fromEntries(table.columns.map((col) => [col.id, defaultValue(col.type)]))
    };
    updateTable((curr) => ({ ...curr, rows: [...curr.rows, row] }));
  };

  const addGroup = () => {
    if (!table) return;
    const color = GROUP_COLORS[table.groups.length % GROUP_COLORS.length];
    updateTable((curr) => ({
      ...curr,
      groups: [...curr.groups, { id: `group-${Date.now()}`, name: `Grup ${curr.groups.length + 1}`, color }]
    }));
  };

  const updateGroup = (groupId: string, patch: Partial<DemoTableGroup>) =>
    updateTable((curr) => ({ ...curr, groups: curr.groups.map((g) => (g.id === groupId ? { ...g, ...patch } : g)) }));

  const cycleGroupColor = (group: DemoTableGroup) => {
    const next = GROUP_COLORS[(GROUP_COLORS.indexOf(group.color) + 1) % GROUP_COLORS.length];
    updateGroup(group.id, { color: next });
  };

  const deleteGroup = (groupId: string) => {
    if (!table || table.groups.length <= 1) return;
    updateTable((curr) => ({ ...curr, groups: curr.groups.filter((g) => g.id !== groupId), rows: curr.rows.filter((r) => r.groupId !== groupId) }));
  };

  const setColumnType = (columnId: string, type: TableColumnType) => {
    updateTable((curr) => ({
      ...curr,
      columns: curr.columns.map((column) =>
        column.id === columnId ? { ...column, type, options: type === 'status' ? ['To Do', 'Doing', 'Done'] : undefined } : column
      ),
      rows: curr.rows.map((row) => ({ ...row, values: { ...row.values, [columnId]: defaultValue(type) } }))
    }));
  };

  const updateCell = (rowId: string, columnId: string, value: string) =>
    updateTable((curr) => ({
      ...curr,
      rows: curr.rows.map((row) => (row.id === rowId ? { ...row, values: { ...row.values, [columnId]: value } } : row))
    }));

  const deleteColumn = (columnId: string) => {
    updateTable((curr) => ({
      ...curr,
      columns: curr.columns.filter((column) => column.id !== columnId),
      rows: curr.rows.map((row) => {
        const { [columnId]: _removed, ...rest } = row.values;
        return { ...row, values: rest };
      })
    }));
    setSort((prev) => (prev?.columnId === columnId ? null : prev));
  };

  const deleteRow = (rowId: string) => {
    updateTable((curr) => ({ ...curr, rows: curr.rows.filter((row) => row.id !== rowId) }));
    setSelected((prev) => {
      const next = new Set(prev);
      next.delete(rowId);
      return next;
    });
  };

  const deleteSelected = () => {
    updateTable((curr) => ({ ...curr, rows: curr.rows.filter((row) => !selected.has(row.id)) }));
    setSelected(new Set());
  };

  const toggleSelect = (rowId: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(rowId) ? next.delete(rowId) : next.add(rowId);
      return next;
    });

  const toggleSort = (columnId: string) =>
    setSort((prev) => (prev?.columnId === columnId ? { columnId, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { columnId, dir: 'asc' }));

  if (!table) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-card">
        <p className="text-sm text-muted">{t('table.empty')}</p>
      </div>
    );
  }

  const sortRows = (rows: DemoTableRow[]) => {
    if (!sort) return rows;
    const column = table.columns.find((col) => col.id === sort.columnId);
    return [...rows].sort((a, b) => {
      const av = a.values[sort.columnId] ?? '';
      const bv = b.values[sort.columnId] ?? '';
      const cmp = column?.type === 'number' ? Number(av) - Number(bv) : av.localeCompare(bv);
      return sort.dir === 'asc' ? cmp : -cmp;
    });
  };

  const renderCell = (row: DemoTableRow, column: { id: string; type: TableColumnType; options?: string[] }) => {
    const value = row.values[column.id] ?? '';
    const base = 'w-full rounded-lg border border-transparent bg-transparent px-2 py-1 text-sm text-slate-700 outline-none focus:border-accent-blue focus:bg-white';
    if (column.type === 'status') {
      const options = column.options ?? ['To Do', 'Doing', 'Done'];
      const color = statusColor(value, options);
      return (
        <select
          value={value}
          onChange={(e) => updateCell(row.id, column.id, e.target.value)}
          className="w-full cursor-pointer rounded-md border-0 px-2 py-1.5 text-center text-xs font-semibold text-white outline-none"
          style={{ backgroundColor: color }}
        >
          {options.map((option) => (
            <option key={option} value={option} className="bg-white text-ink">{option}</option>
          ))}
        </select>
      );
    }
    if (column.type === 'person') {
      return (
        <select value={value} onChange={(e) => updateCell(row.id, column.id, e.target.value)} className={base}>
          <option value="">—</option>
          {workspace.members.map((member) => (
            <option key={member} value={member}>{member}</option>
          ))}
        </select>
      );
    }
    if (column.type === 'checkbox') {
      return (
        <div className="flex justify-center">
          <input
            type="checkbox"
            checked={value === 'true'}
            onChange={(e) => updateCell(row.id, column.id, e.target.checked ? 'true' : 'false')}
            className="h-5 w-5 cursor-pointer accent-[color:var(--accent-blue)]"
          />
        </div>
      );
    }
    if (column.type === 'rating') {
      const rating = Number(value) || 0;
      return (
        <div className="flex items-center justify-center gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <button key={star} onClick={() => updateCell(row.id, column.id, String(star === rating ? star - 1 : star))} className="transition hover:scale-110">
              <Star size={15} className={star <= rating ? 'fill-accent-orange text-accent-orange' : 'text-slate-300'} />
            </button>
          ))}
        </div>
      );
    }
    if (column.type === 'url') {
      return (
        <div className="flex items-center gap-1">
          <input type="url" value={value} placeholder="https://" onChange={(e) => updateCell(row.id, column.id, e.target.value)} className={base} />
          {value && <a href={value} target="_blank" rel="noreferrer" className="text-accent-blue hover:opacity-80"><ExternalLink size={15} /></a>}
        </div>
      );
    }
    if (column.type === 'file') {
      return (
        <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
          <Paperclip size={15} className="text-muted" />
          <span className="truncate max-w-[120px]">{value || 'Dosya'}</span>
          <input type="file" className="hidden" onChange={(e) => updateCell(row.id, column.id, e.target.files?.[0]?.name ?? '')} />
        </label>
      );
    }
    if (column.type === 'longtext') {
      return <textarea value={value} rows={1} onChange={(e) => updateCell(row.id, column.id, e.target.value)} className={`${base} resize-y min-w-[160px]`} />;
    }
    if (column.type === 'tags') {
      const tags = value ? value.split(',').map((tag) => tag.trim()).filter(Boolean) : [];
      return (
        <div className="min-w-[150px]">
          <input value={value} placeholder="etiket1, etiket2" onChange={(e) => updateCell(row.id, column.id, e.target.value)} className={base} />
          {tags.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1">
              {tags.map((tag, i) => (
                <span key={i} className="rounded-full bg-accent-blue/10 px-2 py-0.5 text-[11px] font-semibold text-accent-blue">{tag}</span>
              ))}
            </div>
          )}
        </div>
      );
    }
    return (
      <input
        type={column.type === 'date' ? 'date' : column.type === 'number' ? 'number' : 'text'}
        value={value}
        onChange={(e) => updateCell(row.id, column.id, e.target.value)}
        className={base}
      />
    );
  };

  // Battery distribution bar for a status column within a group's rows.
  const renderStatusBattery = (rows: DemoTableRow[], columnId: string, options: string[]) => {
    if (rows.length === 0) return <div className="h-2.5 w-full rounded-full bg-neutral-100" />;
    const counts = options.map((opt) => rows.filter((r) => (r.values[columnId] ?? '') === opt).length);
    return (
      <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-neutral-100">
        {options.map((opt, i) =>
          counts[i] === 0 ? null : (
            <div
              key={opt}
              title={`${opt}: ${counts[i]}`}
              style={{ width: `${(counts[i] / rows.length) * 100}%`, backgroundColor: statusColor(opt, options) }}
            />
          )
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-card">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-muted">Table / Board</p>
          <h2 className="text-3xl font-extrabold text-ink mt-2">{t('table.title')}</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          {workspace.tables.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTableId(tab.id); setSelected(new Set()); }}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${tab.id === table.id ? 'bg-accent-blue text-white' : 'bg-neutral-100 text-ink hover:bg-neutral-200'}`}
            >
              {tab.name}
            </button>
          ))}
          <button onClick={() => setShowCreateTableForm((p) => !p)} className="rounded-full bg-gradient-from px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-95">
            {t('table.newTable')}
          </button>
        </div>
      </div>

      {showCreateTableForm && (
        <div className="mt-6 rounded-[28px] border border-slate-200 bg-slate-50 p-6">
          <input value={newTableName} onChange={(e) => setNewTableName(e.target.value)} placeholder={t('table.newTable')} className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink outline-none" />
          <div className="mt-6 flex gap-3">
            <button onClick={addTable} className="rounded-full bg-accent-blue px-5 py-3 text-sm font-semibold text-white hover:opacity-95">{t('action.create')}</button>
            <button onClick={() => setShowCreateTableForm(false)} className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-ink hover:bg-slate-100">{t('action.cancel')}</button>
          </div>
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-slate-50 p-4">
        <div className="flex flex-wrap gap-3">
          <button onClick={() => setShowCreateColumnForm((p) => !p)} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink shadow-sm hover:bg-neutral-100">{t('table.addColumn')}</button>
          <button onClick={addGroup} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink shadow-sm hover:bg-neutral-100">+ Grup</button>
        </div>
        <div className="flex items-center gap-3">
          {selected.size > 0 && (
            <button onClick={deleteSelected} className="flex items-center gap-2 rounded-full bg-brand-red px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95 animate-scale-in">
              <Trash2 size={15} /> {selected.size} {t('action.delete')}
            </button>
          )}
          <p className="text-sm text-slate-500">{table.columns.length} {t('table.columns')} · {table.rows.length} {t('table.rows')}</p>
        </div>
      </div>

      {showCreateColumnForm && (
        <div className="mt-6 grid gap-4 rounded-[28px] border border-slate-200 bg-slate-50 p-6 lg:grid-cols-3">
          <div>
            <label className="text-sm font-semibold text-slate-500">{t('table.columnName')}</label>
            <input value={newColumnName} onChange={(e) => setNewColumnName(e.target.value)} placeholder={t('table.columnName')} className="mt-3 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink outline-none" />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-500">{t('table.columnType')}</label>
            <select value={newColumnType} onChange={(e) => setNewColumnType(e.target.value as TableColumnType)} className="mt-3 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink outline-none">
              {Object.entries(typeLabel).map(([value, label]) => (<option key={value} value={value}>{label}</option>))}
            </select>
          </div>
          <div className="flex items-end gap-3">
            <button onClick={addColumn} className="rounded-full bg-accent-blue px-5 py-3 text-sm font-semibold text-white hover:opacity-95">{t('action.create')}</button>
            <button onClick={() => setShowCreateColumnForm(false)} className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-ink hover:bg-slate-100">{t('action.cancel')}</button>
          </div>
        </div>
      )}

      {/* Groups */}
      <div className="mt-6 space-y-8">
        {table.groups.map((group) => {
          const groupRows = sortRows(table.rows.filter((r) => r.groupId === group.id));
          const allSelected = groupRows.length > 0 && groupRows.every((r) => selected.has(r.id));
          return (
            <div key={group.id} className="animate-fade-in-up">
              {/* Group header */}
              <div className="mb-2 flex items-center gap-2">
                <button onClick={() => updateGroup(group.id, { collapsed: !group.collapsed })} className="text-slate-400 hover:text-ink" style={{ color: group.color }}>
                  <ChevronRight size={18} className={`transition-transform ${group.collapsed ? '' : 'rotate-90'}`} />
                </button>
                <button onClick={() => cycleGroupColor(group)} className="h-3.5 w-3.5 rounded-full" style={{ backgroundColor: group.color }} title="Rengi değiştir" />
                <input
                  value={group.name}
                  onChange={(e) => updateGroup(group.id, { name: e.target.value })}
                  className="rounded-md bg-transparent px-1 text-lg font-bold outline-none focus:bg-slate-50"
                  style={{ color: group.color }}
                />
                <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-semibold text-slate-500">{groupRows.length}</span>
                {table.groups.length > 1 && (
                  <button onClick={() => deleteGroup(group.id)} className="ml-1 text-slate-300 hover:text-brand-red" title="Grubu sil"><Trash2 size={14} /></button>
                )}
              </div>

              {!group.collapsed && (
                <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white" style={{ borderLeft: `4px solid ${group.color}` }}>
                  <table className="min-w-full border-separate border-spacing-0">
                    <thead className="bg-slate-50 text-left text-xs uppercase tracking-[0.15em] text-slate-500">
                      <tr>
                        <th className="w-10 px-3 py-3">
                          <input
                            type="checkbox"
                            checked={allSelected}
                            onChange={(e) =>
                              setSelected((prev) => {
                                const next = new Set(prev);
                                groupRows.forEach((r) => (e.target.checked ? next.add(r.id) : next.delete(r.id)));
                                return next;
                              })
                            }
                            className="h-4 w-4 cursor-pointer accent-[color:var(--accent-blue)]"
                          />
                        </th>
                        {table.columns.map((column) => (
                          <th key={column.id} className="whitespace-nowrap px-4 py-3">
                            <div className="flex flex-col gap-1.5">
                              <div className="flex items-center justify-between gap-2">
                                <button onClick={() => toggleSort(column.id)} className="flex items-center gap-1 hover:text-ink">
                                  <span>{column.name}</span>
                                  <span className="text-[10px]">{sort?.columnId === column.id ? (sort.dir === 'asc' ? '▲' : '▼') : '↕'}</span>
                                </button>
                                <button onClick={() => deleteColumn(column.id)} disabled={table.columns.length <= 1} className="text-slate-400 hover:text-brand-red disabled:opacity-30">✕</button>
                              </div>
                              <select value={column.type} onChange={(e) => setColumnType(column.id, e.target.value as TableColumnType)} className="rounded-full border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-600">
                                {Object.entries(typeLabel).map(([value, label]) => (<option key={value} value={value}>{label}</option>))}
                              </select>
                            </div>
                          </th>
                        ))}
                        <th className="w-10 px-2 py-3" />
                      </tr>
                    </thead>
                    <tbody>
                      {groupRows.map((row) => (
                        <tr key={row.id} className={`border-t border-slate-100 transition hover:bg-slate-50 ${selected.has(row.id) ? 'bg-accent-blue/5' : ''}`}>
                          <td className="px-3 py-2 align-middle">
                            <input type="checkbox" checked={selected.has(row.id)} onChange={() => toggleSelect(row.id)} className="h-4 w-4 cursor-pointer accent-[color:var(--accent-blue)]" />
                          </td>
                          {table.columns.map((column) => (
                            <td key={column.id} className="px-2 py-1.5 align-top">{renderCell(row, column)}</td>
                          ))}
                          <td className="px-2 py-1.5 text-center align-middle">
                            <button onClick={() => deleteRow(row.id)} className="text-slate-300 hover:text-brand-red"><Trash2 size={14} /></button>
                          </td>
                        </tr>
                      ))}
                      {/* Add row */}
                      <tr className="border-t border-slate-100">
                        <td />
                        <td colSpan={table.columns.length + 1} className="px-2 py-2">
                          <button onClick={() => addRowToGroup(group.id)} className="flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-accent-blue">
                            <Plus size={15} /> öğe ekle
                          </button>
                        </td>
                      </tr>
                      {/* Footer summaries */}
                      <tr className="border-t-2 border-slate-100 bg-slate-50">
                        <td />
                        {table.columns.map((column) => (
                          <td key={column.id} className="px-4 py-2 align-middle">
                            {column.type === 'status' && renderStatusBattery(groupRows, column.id, column.options ?? ['To Do', 'Doing', 'Done'])}
                            {column.type === 'number' && (
                              <span className="text-xs font-semibold text-slate-500">
                                Σ {groupRows.reduce((sum, r) => sum + (Number(r.values[column.id]) || 0), 0)}
                              </span>
                            )}
                          </td>
                        ))}
                        <td />
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
