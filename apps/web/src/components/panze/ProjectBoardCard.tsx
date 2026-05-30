import React, { useMemo, useState } from 'react';
import type { DemoProject, DemoItem } from '../../lib/demoData';
import { TaskModal, type TaskModalMode } from './TaskModal';
import { useT } from '../../lib/i18n';

const statusBadgeColor = (status: string) => {
  if (status === 'Done') return 'bg-emerald-100 text-emerald-700';
  if (status === 'In Progress' || status === 'Doing') return 'bg-amber-100 text-amber-700';
  if (status === 'Selected' || status === 'To Do' || status === 'Backlog') return 'bg-slate-100 text-slate-700';
  return 'bg-slate-100 text-slate-700';
};

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

const PRIORITY_ORDER: Record<DemoItem['priority'], number> = {
  HIGHEST: 0,
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3,
  LOWEST: 4
};

type SortKey = 'none' | 'priority' | 'dueDate' | 'storyPoints' | 'title';

interface ProjectBoardCardProps {
  project: DemoProject;
  members: string[];
  searchQuery: string;
  onProjectChange: (project: DemoProject) => void;
}

export const ProjectBoardCard: React.FC<ProjectBoardCardProps> = ({ project, members, searchQuery, onProjectChange }) => {
  const t = useT();
  const [statusFilter, setStatusFilter] = useState('All');
  const [assigneeFilter, setAssigneeFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [sortBy, setSortBy] = useState<SortKey>('none');

  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverStatus, setDragOverStatus] = useState<string | null>(null);
  const [modal, setModal] = useState<{ mode: TaskModalMode; item: DemoItem } | null>(null);

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const result = project.items.filter((item) => {
      const matchesQuery =
        item.title.toLowerCase().includes(query) ||
        item.key.toLowerCase().includes(query) ||
        item.assignee.toLowerCase().includes(query);
      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
      const matchesAssignee = assigneeFilter === 'All' || item.assignee === assigneeFilter;
      const matchesPriority = priorityFilter === 'All' || item.priority === priorityFilter;
      return matchesQuery && matchesStatus && matchesAssignee && matchesPriority;
    });

    if (sortBy !== 'none') {
      result.sort((a, b) => {
        switch (sortBy) {
          case 'priority':
            return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
          case 'dueDate':
            return a.dueDate.localeCompare(b.dueDate);
          case 'storyPoints':
            return b.storyPoints - a.storyPoints;
          case 'title':
            return a.title.localeCompare(b.title);
          default:
            return 0;
        }
      });
    }
    return result;
  }, [project.items, searchQuery, statusFilter, assigneeFilter, priorityFilter, sortBy]);

  const grouped = project.workflow.reduce((acc, status) => {
    acc[status] = filteredItems.filter((item) => item.status === status);
    return acc;
  }, {} as Record<string, DemoItem[]>);

  const openCreate = () => {
    const draft: DemoItem = {
      id: `item-${project.id}-${Date.now()}`,
      key: `${project.key}-${project.items.length + 1}`,
      title: '',
      type: 'TASK',
      status: project.workflow[0],
      priority: 'MEDIUM',
      assignee: members[0] ?? 'Demo Kullanıcı',
      reporter: members[0] ?? 'Alice Yılmaz',
      storyPoints: 3,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      projectId: project.id,
      sprintId: null
    };
    setModal({ mode: 'create', item: draft });
  };

  const moveItemToStatus = (itemId: string, status: string) => {
    const item = project.items.find((entry) => entry.id === itemId);
    if (!item || item.status === status) return;
    onProjectChange({
      ...project,
      items: project.items.map((entry) => (entry.id === itemId ? { ...entry, status } : entry))
    });
  };

  const handleSave = (updated: DemoItem, mode: TaskModalMode) => {
    if (mode === 'create') {
      onProjectChange({ ...project, items: [...project.items, updated] });
    } else {
      onProjectChange({
        ...project,
        items: project.items.map((entry) => (entry.id === updated.id ? updated : entry))
      });
    }
    setModal(null);
  };

  const handleDelete = (itemId: string) => {
    onProjectChange({ ...project, items: project.items.filter((entry) => entry.id !== itemId) });
    setModal(null);
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-card">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-muted">{t('board.title')}</p>
          <h2 className="text-3xl font-extrabold text-ink mt-2">{project.name}</h2>
          <p className="mt-2 text-sm text-muted max-w-2xl">{project.description}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-ink">{project.type} Board</div>
          <button onClick={openCreate} className="rounded-full bg-accent-orange px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95">
            {t('board.newTask')}
          </button>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3 rounded-3xl bg-slate-50 p-4">
        <div className="flex flex-wrap gap-2">
          {['All', ...project.workflow].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                statusFilter === status ? 'bg-accent-blue text-white' : 'bg-white text-ink hover:bg-neutral-100'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          <select
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-ink outline-none"
          >
            <option value="All">{t('board.allAssignees')}</option>
            {members.map((member) => (
              <option key={member} value={member}>{member}</option>
            ))}
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-ink outline-none"
          >
            <option value="All">{t('board.allPriorities')}</option>
            {Object.keys(PRIORITY_ORDER).map((priority) => (
              <option key={priority} value={priority}>{priority}</option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortKey)}
            className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-ink outline-none"
          >
            <option value="none">{t('board.sortNone')}</option>
            <option value="priority">{t('board.sortPriority')}</option>
            <option value="dueDate">{t('board.sortDue')}</option>
            <option value="storyPoints">{t('board.sortPoints')}</option>
            <option value="title">{t('board.sortTitle')}</option>
          </select>
        </div>
      </div>

      <div className="mt-3 text-right text-sm text-slate-500">{filteredItems.length} {t('board.found')}</div>

      <div className="mt-5 grid gap-4 stagger xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
        {project.workflow.map((status) => (
          <div
            key={status}
            onDragOver={(e) => {
              e.preventDefault();
              if (dragOverStatus !== status) setDragOverStatus(status);
            }}
            onDragLeave={() => setDragOverStatus((prev) => (prev === status ? null : prev))}
            onDrop={(e) => {
              e.preventDefault();
              if (draggedId) moveItemToStatus(draggedId, status);
              setDraggedId(null);
              setDragOverStatus(null);
            }}
            className={`rounded-[28px] p-4 shadow-sm transition ${
              dragOverStatus === status ? 'bg-accent-blue/10 ring-2 ring-accent-blue/40' : 'bg-slate-50'
            }`}
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-ink">{status}</p>
                <p className="text-xs text-muted">{grouped[status].length} item{grouped[status].length !== 1 ? 's' : ''}</p>
              </div>
              <span className={`h-2.5 w-2.5 rounded-full ${statusBadgeColor(status)}`} />
            </div>
            <div className="space-y-3">
              {grouped[status].map((item) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={() => setDraggedId(item.id)}
                  onDragEnd={() => {
                    setDraggedId(null);
                    setDragOverStatus(null);
                  }}
                  onClick={() => setModal({ mode: 'edit', item })}
                  className={`cursor-pointer rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-accent-blue/50 hover:shadow-md ${
                    draggedId === item.id ? 'opacity-50 scale-95' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span>{itemTypeEmoji(item.type)}</span>
                        <span className="font-semibold">{item.key}</span>
                      </div>
                      <h3 className="mt-2 truncate text-sm font-semibold text-ink">{item.title}</h3>
                    </div>
                    <div className="rounded-full bg-neutral-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                      {item.priority}
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                    <span>{item.assignee}</span>
                    <span>{item.storyPoints} pt</span>
                  </div>
                </div>
              ))}
              {grouped[status].length === 0 && <p className="text-xs text-slate-500">{t('board.noTasks')}</p>}
            </div>
          </div>
        ))}
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
