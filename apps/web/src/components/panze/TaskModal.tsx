import React, { useState } from 'react';
import type { DemoItem } from '../../lib/demoData';
import { useT } from '../../lib/i18n';

export type TaskModalMode = 'create' | 'edit';

const PRIORITIES: DemoItem['priority'][] = ['HIGHEST', 'HIGH', 'MEDIUM', 'LOW', 'LOWEST'];
const TYPES: DemoItem['type'][] = ['EPIC', 'STORY', 'TASK', 'BUG', 'SUBTASK'];

const itemTypeEmoji = (type: DemoItem['type']) => {
  switch (type) {
    case 'EPIC':
      return '🏔️';
    case 'STORY':
      return '📖';
    case 'BUG':
      return '🐛';
    case 'TASK':
      return '☐';
    case 'SUBTASK':
      return '↳';
    default:
      return '📝';
  }
};

interface TaskModalProps {
  mode: TaskModalMode;
  item: DemoItem;
  members: string[];
  workflow: string[];
  onClose: () => void;
  onSave: (item: DemoItem, mode: TaskModalMode) => void;
  onDelete: (itemId: string) => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({ mode, item, members, workflow, onClose, onSave, onDelete }) => {
  const t = useT();
  const [draft, setDraft] = useState<DemoItem>(item);

  const update = <K extends keyof DemoItem>(key: K, value: DemoItem[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const canSave = draft.title.trim().length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[32px] bg-white p-8 shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="text-lg">{itemTypeEmoji(draft.type)}</span>
            <span className="font-semibold">{mode === 'create' ? t('task.new') : draft.key}</span>
          </div>
          <button onClick={onClose} className="rounded-full bg-neutral-100 px-3 py-1 text-sm font-semibold text-ink hover:bg-neutral-200">
            ✕
          </button>
        </div>

        <div className="mt-6 space-y-5">
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{t('task.title')}</label>
            <input
              autoFocus
              value={draft.title}
              onChange={(e) => update('title', e.target.value)}
              placeholder={t('task.titlePlaceholder')}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base font-semibold text-ink outline-none focus:border-accent-blue"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <Field label={t('task.status')}>
              <select value={draft.status} onChange={(e) => update('status', e.target.value)} className={selectClass}>
                {workflow.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </Field>
            <Field label={t('task.type')}>
              <select value={draft.type} onChange={(e) => update('type', e.target.value as DemoItem['type'])} className={selectClass}>
                {TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </Field>
            <Field label={t('task.priority')}>
              <select value={draft.priority} onChange={(e) => update('priority', e.target.value as DemoItem['priority'])} className={selectClass}>
                {PRIORITIES.map((priority) => (
                  <option key={priority} value={priority}>{priority}</option>
                ))}
              </select>
            </Field>
            <Field label={t('task.assignee')}>
              <select value={draft.assignee} onChange={(e) => update('assignee', e.target.value)} className={selectClass}>
                {members.map((member) => (
                  <option key={member} value={member}>{member}</option>
                ))}
              </select>
            </Field>
            <Field label={t('task.points')}>
              <input
                type="number"
                min={0}
                value={draft.storyPoints}
                onChange={(e) => update('storyPoints', Number(e.target.value))}
                className={selectClass}
              />
            </Field>
            <Field label={t('task.due')}>
              <input type="date" value={draft.dueDate} onChange={(e) => update('dueDate', e.target.value)} className={selectClass} />
            </Field>
          </div>

          <div className="text-xs text-slate-500">{t('task.reporter')}: <span className="font-semibold text-ink">{draft.reporter}</span></div>
        </div>

        <div className="mt-8 flex items-center justify-between gap-3">
          {mode === 'edit' ? (
            <button
              onClick={() => onDelete(draft.id)}
              className="rounded-full border border-brand-red/30 px-5 py-3 text-sm font-semibold text-brand-red transition hover:bg-brand-red/10"
            >
              {t('action.delete')}
            </button>
          ) : (
            <span />
          )}
          <div className="flex gap-3">
            <button onClick={onClose} className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:bg-slate-100">
              {t('action.cancel')}
            </button>
            <button
              onClick={() => onSave(draft, mode)}
              disabled={!canSave}
              className="rounded-full bg-accent-blue px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95 disabled:opacity-40"
            >
              {mode === 'create' ? t('action.add') : t('action.save')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const selectClass = 'mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink outline-none focus:border-accent-blue';

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div>
    <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{label}</label>
    {children}
  </div>
);
