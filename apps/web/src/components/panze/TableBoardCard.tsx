import React, { useEffect, useMemo, useState } from 'react';
import type { DemoWorkspace, DemoTable, TableColumnType } from '../../lib/demoData';

const typeLabel: Record<TableColumnType, string> = {
  text: 'Text',
  status: 'Status',
  date: 'Date',
  person: 'Person',
  number: 'Number'
};

const defaultValue = (type: TableColumnType) => {
  if (type === 'status') return 'To Do';
  if (type === 'date') return new Date().toISOString().slice(0, 10);
  if (type === 'number') return '0';
  return '';
};

interface TableBoardCardProps {
  workspace: DemoWorkspace;
  onWorkspaceChange: (workspace: DemoWorkspace) => void;
}

export const TableBoardCard: React.FC<TableBoardCardProps> = ({ workspace, onWorkspaceChange }) => {
  const [activeTableId, setActiveTableId] = useState(() => workspace.tables?.[0]?.id ?? '');
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [showCreateTableForm, setShowCreateTableForm] = useState(false);
  const [showCreateColumnForm, setShowCreateColumnForm] = useState(false);
  const [newTableName, setNewTableName] = useState('');
  const [newColumnName, setNewColumnName] = useState('');
  const [newColumnType, setNewColumnType] = useState<TableColumnType>('text');

  useEffect(() => {
    if (!activeTableId && workspace.tables?.[0]?.id) {
      setActiveTableId(workspace.tables[0].id);
    }
  }, [activeTableId, workspace.tables]);

  const table = useMemo(
    () => workspace.tables?.find((table) => table.id === activeTableId) ?? workspace.tables?.[0],
    [activeTableId, workspace.tables]
  );

  const updateTable = (update: (table: DemoTable) => DemoTable) => {
    if (!table) return;
    const updated = workspace.tables.map((item) => (item.id === table.id ? update(item) : item));
    onWorkspaceChange({ ...workspace, tables: updated });
  };

  const addTable = () => {
    if (!newTableName.trim()) return;
    const next = {
      id: `table-${Date.now()}`,
      name: newTableName,
      columns: [
        { id: `col-${Date.now() + 1}`, name: 'Task Name', type: 'text' as TableColumnType }
      ],
      rows: []
    };
    onWorkspaceChange({ ...workspace, tables: [...workspace.tables, next] });
    setActiveTableId(next.id);
    setSelectedRowId(null);
    setNewTableName('');
    setShowCreateTableForm(false);
  };

  const addColumn = () => {
    if (!table || !newColumnName.trim()) return;
    const column = { id: `col-${Date.now()}`, name: newColumnName, type: newColumnType, options: newColumnType === 'status' ? ['To Do', 'Doing', 'Done'] : undefined };
    updateTable((curr) => ({
      ...curr,
      columns: [...curr.columns, column],
      rows: curr.rows.map((row) => ({
        ...row,
        values: { ...row.values, [column.id]: defaultValue(newColumnType) }
      }))
    }));
    setNewColumnName('');
    setNewColumnType('text');
    setShowCreateColumnForm(false);
  };

  const addRow = () => {
    if (!table) return;
    const row = {
      id: `row-${Date.now()}`,
      values: Object.fromEntries(table.columns.map((col) => [col.id, defaultValue(col.type)]))
    };
    updateTable((curr) => ({ ...curr, rows: [...curr.rows, row] }));
    setSelectedRowId(row.id);
  };

  const setColumnType = (columnId: string, type: TableColumnType) => {
    updateTable((curr) => ({
      ...curr,
      columns: curr.columns.map((column) =>
        column.id === columnId
          ? {
              ...column,
              type,
              options: type === 'status' ? ['To Do', 'Doing', 'Done'] : undefined
            }
          : column
      ),
      rows: curr.rows.map((row) => ({
        ...row,
        values: {
          ...row.values,
          [columnId]: defaultValue(type)
        }
      }))
    }));
  };

  if (!table) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-card">
        <p className="text-sm text-muted">Henüz tablo yok.</p>
      </div>
    );
  }

  const selectedRow = table.rows.find((row) => row.id === selectedRowId) ?? table.rows[0] ?? null;

  return (
    <div className="bg-white rounded-2xl p-8 shadow-card">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-muted">Table / Board</p>
          <h2 className="text-3xl font-extrabold text-ink mt-2">Workspace Table</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          {workspace.tables.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTableId(tab.id);
                setSelectedRowId(null);
              }}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                tab.id === table.id ? 'bg-accent-blue text-white' : 'bg-neutral-100 text-ink hover:bg-neutral-200'
              }`}
            >
              {tab.name}
            </button>
          ))}
          <button onClick={() => setShowCreateTableForm((prev) => !prev)} className="rounded-full bg-gradient-from px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-95">
            Yeni Table
          </button>
        </div>
      </div>

      {showCreateTableForm && (
        <div className="mt-6 rounded-[28px] border border-slate-200 bg-slate-50 p-6">
          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-slate-500">Table Adı</label>
              <input
                value={newTableName}
                onChange={(e) => setNewTableName(e.target.value)}
                placeholder="Yeni tablo adı"
                className="mt-3 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink outline-none"
              />
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <button onClick={addTable} className="rounded-full bg-accent-blue px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95">
              Table Oluştur
            </button>
            <button onClick={() => setShowCreateTableForm(false)} className="rounded-full bg-white border border-slate-200 px-5 py-3 text-sm font-semibold text-ink transition hover:bg-slate-100">
              İptal
            </button>
          </div>
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-slate-50 p-4">
        <div className="flex flex-wrap gap-3">
          <button onClick={() => setShowCreateColumnForm((prev) => !prev)} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink shadow-sm hover:bg-neutral-100">
            Kolon Ekle
          </button>
          <button onClick={addRow} className="rounded-full bg-accent-orange px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95">
            Satır Ekle
          </button>
        </div>
        <p className="text-sm text-slate-500">{table.columns.length} kolon · {table.rows.length} satır</p>
      </div>

      {showCreateColumnForm && (
        <div className="mt-6 rounded-[28px] border border-slate-200 bg-slate-50 p-6">
          <div className="grid gap-4 lg:grid-cols-3">
            <div>
              <label className="text-sm font-semibold text-slate-500">Kolon Adı</label>
              <input
                value={newColumnName}
                onChange={(e) => setNewColumnName(e.target.value)}
                placeholder="Kolon adı"
                className="mt-3 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-500">Kolon Türü</label>
              <select
                value={newColumnType}
                onChange={(e) => setNewColumnType(e.target.value as TableColumnType)}
                className="mt-3 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink outline-none"
              >
                {Object.entries(typeLabel).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <button onClick={addColumn} className="rounded-full bg-accent-blue px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95">
              Kolon Oluştur
            </button>
            <button onClick={() => setShowCreateColumnForm(false)} className="rounded-full bg-white border border-slate-200 px-5 py-3 text-sm font-semibold text-ink transition hover:bg-slate-100">
              İptal
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 overflow-x-auto rounded-3xl border border-slate-200 bg-white">
        <table className="min-w-full border-separate border-spacing-0">
          <thead className="bg-slate-100 text-left text-xs uppercase tracking-[0.3em] text-slate-500">
            <tr>
              {table.columns.map((column) => (
                <th key={column.id} className="whitespace-nowrap px-4 py-4">
                  <div className="flex flex-col gap-2">
                    <span>{column.name}</span>
                    <select
                      value={column.type}
                      onChange={(e) => setColumnType(column.id, e.target.value as TableColumnType)}
                      className="rounded-full border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600"
                    >
                      {Object.entries(typeLabel).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.length === 0 ? (
              <tr>
                <td colSpan={table.columns.length} className="px-4 py-8 text-center text-sm text-slate-500">
                  Bu tabloya henüz satır eklenmedi.
                </td>
              </tr>
            ) : (
              table.rows.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => setSelectedRowId(row.id)}
                  className={`cursor-pointer border-t border-slate-100 transition hover:bg-slate-50 ${row.id === selectedRowId ? 'bg-slate-100' : ''}`}
                >
                  {table.columns.map((column) => (
                    <td key={column.id} className="px-4 py-4 align-top text-sm text-slate-700">
                      {row.values[column.id]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedRow && (
        <div className="mt-6 rounded-3xl bg-slate-50 p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-muted">Task details</p>
              <h3 className="text-xl font-semibold text-ink mt-2">{selectedRow.values[table.columns[0]?.id] || 'Yeni Task'}</h3>
            </div>
            <span className="rounded-full bg-accent-blue/10 px-3 py-1 text-sm font-semibold text-accent-blue">Açık</span>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {table.columns.map((column) => (
              <div key={column.id} className="rounded-3xl bg-white p-4 shadow-sm">
                <p className="text-xs uppercase tracking-[0.3em] text-muted">{column.name}</p>
                <p className="mt-2 text-sm text-ink">{selectedRow.values[column.id]}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
