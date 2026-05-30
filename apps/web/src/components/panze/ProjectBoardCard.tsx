import React, { useMemo, useState } from 'react';
import type { DemoProject, DemoItem } from '../../lib/demoData';

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

interface ProjectBoardCardProps {
  project: DemoProject;
  searchQuery: string;
  onProjectChange: (project: DemoProject) => void;
}

export const ProjectBoardCard: React.FC<ProjectBoardCardProps> = ({ project, searchQuery, onProjectChange }) => {
  const [statusFilter, setStatusFilter] = useState('All');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('Demo Kullanıcı');
  const [newTaskPriority, setNewTaskPriority] = useState('MEDIUM');
  const [newTaskDueDate, setNewTaskDueDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10));

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return project.items.filter((item) => {
      const matchesQuery =
        item.title.toLowerCase().includes(query) ||
        item.key.toLowerCase().includes(query) ||
        item.assignee.toLowerCase().includes(query);
      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [project.items, searchQuery, statusFilter]);

  const grouped = project.workflow.reduce((acc, status) => {
    acc[status] = filteredItems.filter((item) => item.status === status);
    return acc;
  }, {} as Record<string, DemoItem[]>);

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    const nextId = `item-${project.id}-${Date.now()}`;
    const nextKey = `${project.key}-${project.items.length + 1}`;
    const newTask: DemoItem = {
      id: nextId,
      key: nextKey,
      title: newTaskTitle,
      type: 'TASK',
      status: project.workflow[0],
      priority: newTaskPriority as DemoItem['priority'],
      assignee: newTaskAssignee,
      reporter: 'Alice Yılmaz',
      storyPoints: 3,
      dueDate: newTaskDueDate,
      projectId: project.id
    };
    onProjectChange({ ...project, items: [...project.items, newTask] });
    setNewTaskTitle('');
    setShowTaskForm(false);
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-card">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-muted">Board View</p>
          <h2 className="text-3xl font-extrabold text-ink mt-2">{project.name}</h2>
          <p className="mt-2 text-sm text-muted max-w-2xl">{project.description}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-ink">{project.type} Board</div>
          <button onClick={() => setShowTaskForm((prev) => !prev)} className="rounded-full bg-accent-orange px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95">
            Yeni Task Oluştur
          </button>
        </div>
      </div>

      {showTaskForm && (
        <div className="mt-6 rounded-[28px] border border-slate-200 bg-slate-50 p-6">
          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-slate-500">Task Başlığı</label>
              <input
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Task title"
                className="mt-3 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-500">Atanan</label>
              <input
                value={newTaskAssignee}
                onChange={(e) => setNewTaskAssignee(e.target.value)}
                className="mt-3 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-500">Öncelik</label>
              <select
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value)}
                className="mt-3 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink outline-none"
              >
                <option value="HIGHEST">Highest</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
                <option value="LOWEST">Lowest</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-500">Bitiş Tarihi</label>
              <input
                type="date"
                value={newTaskDueDate}
                onChange={(e) => setNewTaskDueDate(e.target.value)}
                className="mt-3 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink outline-none"
              />
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <button onClick={addTask} className="rounded-full bg-accent-blue px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95">
              Task Ekle
            </button>
            <button onClick={() => setShowTaskForm(false)} className="rounded-full bg-white border border-slate-200 px-5 py-3 text-sm font-semibold text-ink transition hover:bg-slate-100">
              İptal
            </button>
          </div>
        </div>
      )}

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
        <div className="ml-auto text-sm text-slate-500">{filteredItems.length} task found</div>
      </div>

      <div className="mt-8 grid gap-4 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
        {project.workflow.map((status) => (
          <div key={status} className="rounded-[28px] bg-slate-50 p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-ink">{status}</p>
                <p className="text-xs text-muted">{grouped[status].length} item{grouped[status].length !== 1 ? 's' : ''}</p>
              </div>
              <span className={`h-2.5 w-2.5 rounded-full ${statusBadgeColor(status)}`} />
            </div>
            <div className="space-y-3">
              {grouped[status].map((item) => (
                <div key={item.id} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
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
              {grouped[status].length === 0 && <p className="text-xs text-slate-500">No tasks yet</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
