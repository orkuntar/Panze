import React, { useMemo, useState } from 'react';
import type { DemoProject, DemoItem, DemoSprint } from '../../lib/demoData';
import { TaskModal, type TaskModalMode } from './TaskModal';
import { useT } from '../../lib/i18n';

const sprintStatusBadge = (status: DemoSprint['status']) => {
  switch (status) {
    case 'ACTIVE':
      return 'bg-emerald-100 text-emerald-700';
    case 'FUTURE':
      return 'bg-slate-100 text-slate-600';
    case 'CLOSED':
      return 'bg-neutral-200 text-slate-500';
  }
};

interface SprintBoardCardProps {
  project: DemoProject;
  members: string[];
  onProjectChange: (project: DemoProject) => void;
}

export const SprintBoardCard: React.FC<SprintBoardCardProps> = ({ project, members, onProjectChange }) => {
  const t = useT();
  const [newSprintName, setNewSprintName] = useState('');
  const [newSprintGoal, setNewSprintGoal] = useState('');
  const [showSprintForm, setShowSprintForm] = useState(false);
  const [modal, setModal] = useState<{ mode: TaskModalMode; item: DemoItem } | null>(null);

  const backlog = useMemo(() => project.items.filter((item) => !item.sprintId), [project.items]);
  const itemsBySprint = useMemo(() => {
    const map: Record<string, DemoItem[]> = {};
    for (const sprint of project.sprints) map[sprint.id] = [];
    for (const item of project.items) {
      if (item.sprintId && map[item.sprintId]) map[item.sprintId].push(item);
    }
    return map;
  }, [project.items, project.sprints]);

  const points = (items: DemoItem[]) => items.reduce((sum, item) => sum + (item.storyPoints || 0), 0);

  const assignToSprint = (itemId: string, sprintId: string | null) => {
    onProjectChange({
      ...project,
      items: project.items.map((item) => (item.id === itemId ? { ...item, sprintId } : item))
    });
  };

  const setSprintStatus = (sprintId: string, status: DemoSprint['status']) => {
    let items = project.items;
    if (status === 'CLOSED') {
      // Incomplete items roll back to the backlog on sprint close.
      items = items.map((item) =>
        item.sprintId === sprintId && item.status !== 'Done' ? { ...item, sprintId: null } : item
      );
    }
    onProjectChange({
      ...project,
      items,
      sprints: project.sprints.map((sprint) => (sprint.id === sprintId ? { ...sprint, status } : sprint))
    });
  };

  const createSprint = () => {
    if (!newSprintName.trim()) return;
    const sprint: DemoSprint = {
      id: `sprint-${project.id}-${Date.now()}`,
      name: newSprintName,
      goal: newSprintGoal,
      status: 'FUTURE',
      startDate: new Date().toISOString().slice(0, 10),
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
    };
    onProjectChange({ ...project, sprints: [...project.sprints, sprint] });
    setNewSprintName('');
    setNewSprintGoal('');
    setShowSprintForm(false);
  };

  const handleSave = (updated: DemoItem) => {
    onProjectChange({
      ...project,
      items: project.items.map((entry) => (entry.id === updated.id ? updated : entry))
    });
    setModal(null);
  };

  const handleDelete = (itemId: string) => {
    onProjectChange({ ...project, items: project.items.filter((entry) => entry.id !== itemId) });
    setModal(null);
  };

  const renderItem = (item: DemoItem) => (
    <div key={item.id} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition hover:-translate-y-0.5 hover:border-accent-blue/40 hover:shadow-md">
      <button onClick={() => setModal({ mode: 'edit', item })} className="min-w-0 flex-1 text-left">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="font-semibold">{item.key}</span>
          <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">{item.type}</span>
        </div>
        <p className="mt-1 truncate text-sm font-semibold text-ink">{item.title || 'Başlıksız'}</p>
      </button>
      <span className="hidden text-xs text-slate-500 sm:block">{item.assignee}</span>
      <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-600">{item.status}</span>
      <span className="rounded-full bg-neutral-100 px-2 py-1 text-[11px] font-semibold text-slate-600">{item.storyPoints} pt</span>
      <select
        value={item.sprintId ?? 'backlog'}
        onChange={(e) => assignToSprint(item.id, e.target.value === 'backlog' ? null : e.target.value)}
        className="rounded-full border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600 outline-none"
        title="Sprint'e taşı"
      >
        <option value="backlog">Backlog</option>
        {project.sprints.filter((s) => s.status !== 'CLOSED').map((sprint) => (
          <option key={sprint.id} value={sprint.id}>{sprint.name}</option>
        ))}
      </select>
    </div>
  );

  if (project.type !== 'SCRUM') {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-card">
        <p className="text-sm uppercase tracking-[0.3em] text-muted">{t('sprint.backlog')}</p>
        <h2 className="text-3xl font-extrabold text-ink mt-2">{project.name}</h2>
        <p className="mt-4 text-sm text-muted">{t('sprint.kanbanNote')}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-8 shadow-card">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-muted">{t('sprint.backlog')}</p>
          <h2 className="text-3xl font-extrabold text-ink mt-2">{project.name}</h2>
        </div>
        <button onClick={() => setShowSprintForm((p) => !p)} className="rounded-full bg-accent-orange px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95">
          {t('sprint.new')}
        </button>
      </div>

      {showSprintForm && (
        <div className="mt-6 grid gap-4 rounded-[28px] border border-slate-200 bg-slate-50 p-6 lg:grid-cols-2">
          <input
            value={newSprintName}
            onChange={(e) => setNewSprintName(e.target.value)}
            placeholder={t('sprint.name')}
            className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink outline-none"
          />
          <input
            value={newSprintGoal}
            onChange={(e) => setNewSprintGoal(e.target.value)}
            placeholder={t('sprint.goal')}
            className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink outline-none"
          />
          <div className="flex gap-3">
            <button onClick={createSprint} className="rounded-full bg-accent-blue px-5 py-3 text-sm font-semibold text-white hover:opacity-95">{t('action.create')}</button>
            <button onClick={() => setShowSprintForm(false)} className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-ink hover:bg-slate-100">{t('action.cancel')}</button>
          </div>
        </div>
      )}

      <div className="mt-8 space-y-6 stagger">
        {project.sprints.map((sprint) => {
          const sprintItems = itemsBySprint[sprint.id] ?? [];
          const done = sprintItems.filter((i) => i.status === 'Done').length;
          return (
            <div key={sprint.id} className="rounded-[28px] border border-slate-200 bg-slate-50 p-6">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-ink">{sprint.name}</h3>
                    <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${sprintStatusBadge(sprint.status)}`}>{sprint.status}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted">{sprint.goal}</p>
                  <p className="mt-1 text-xs text-slate-500">{sprint.startDate} → {sprint.endDate} · {done}/{sprintItems.length} done · {points(sprintItems)} pts</p>
                </div>
                <div className="flex gap-2">
                  {sprint.status === 'FUTURE' && (
                    <button onClick={() => setSprintStatus(sprint.id, 'ACTIVE')} className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:opacity-95">{t('sprint.start')}</button>
                  )}
                  {sprint.status === 'ACTIVE' && (
                    <button onClick={() => setSprintStatus(sprint.id, 'CLOSED')} className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white hover:opacity-95">{t('sprint.complete')}</button>
                  )}
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {sprintItems.length === 0 ? (
                  <p className="text-xs text-slate-500">{t('sprint.empty')}</p>
                ) : (
                  sprintItems.map(renderItem)
                )}
              </div>
            </div>
          );
        })}

        <div className="rounded-[28px] border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-ink">Backlog</h3>
            <span className="text-xs text-slate-500">{backlog.length} item · {points(backlog)} pts</span>
          </div>
          <div className="mt-4 space-y-2">
            {backlog.length === 0 ? (
              <p className="text-xs text-slate-500">{t('sprint.backlogEmpty')}</p>
            ) : (
              backlog.map(renderItem)
            )}
          </div>
        </div>
      </div>

      {modal && (
        <TaskModal
          mode={modal.mode}
          item={modal.item}
          members={members}
          workflow={project.workflow}
          onClose={() => setModal(null)}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};
