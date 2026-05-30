import { useMemo, useState } from 'react';
import { type DemoProject, type DemoItem } from '../lib/demoData';
import { IconPlus, IconCheck } from '../lib/icons';

interface ProjectsViewProps {
  projects: DemoProject[];
  onSelectItem?: (item: DemoItem) => void;
}

function priorityColor(priority: string) {
  if (priority === 'HIGHEST') return 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300';
  if (priority === 'HIGH') return 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300';
  if (priority === 'MEDIUM') return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300';
  if (priority === 'LOW') return 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300';
  return 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200';
}

function statusColor(status: string) {
  if (status === 'Done') return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300';
  if (status === 'In Progress' || status === 'Doing') return 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300';
  if (status === 'Selected' || status === 'To Do' || status === 'Backlog') return 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300';
  return 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200';
}

function typeIcon(type: string) {
  const icons: Record<string, string> = {
    EPIC: '🏔️',
    STORY: '📖',
    TASK: '☐',
    BUG: '🐛',
    SUBTASK: '↳'
  };
  return icons[type] || '📝';
}

export default function ProjectsView({ projects }: ProjectsViewProps) {
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id);
  const [sortBy, setSortBy] = useState<'status' | 'priority' | 'assignee'>('status');

  const selectedProject = projects.find((p) => p.id === selectedProjectId);
  const sortedItems = useMemo(() => {
    if (!selectedProject) return [];
    const items = [...selectedProject.items];
    if (sortBy === 'status') items.sort((a, b) => a.status.localeCompare(b.status));
    if (sortBy === 'priority') items.sort((a, b) => ['HIGHEST', 'HIGH', 'MEDIUM', 'LOW', 'LOWEST'].indexOf(a.priority) - ['HIGHEST', 'HIGH', 'MEDIUM', 'LOW', 'LOWEST'].indexOf(b.priority));
    if (sortBy === 'assignee') items.sort((a, b) => a.assignee.localeCompare(b.assignee));
    return items;
  }, [selectedProject, sortBy]);

  const statusCounts = useMemo(() => {
    if (!selectedProject) return {};
    return selectedProject.items.reduce(
      (acc, item) => {
        acc[item.status] = (acc[item.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
  }, [selectedProject]);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Project selector */}
      <div className="border-b border-slate-200 px-8 py-6 dark:border-slate-800">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{selectedProject?.name}</h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{selectedProject?.description}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
            >
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.key} • {project.name}
                </option>
              ))}
            </select>
            <button className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700">
              <IconPlus className="h-4 w-4" />
              Item Ekle
            </button>
          </div>
        </div>
      </div>

      {/* Status overview */}
      <div className="border-b border-slate-200 px-8 py-4 dark:border-slate-800">
        <div className="flex flex-wrap gap-4">
          {selectedProject?.workflow.map((status) => (
            <div key={status} className="flex items-center gap-2">
              <div className={`h-3 w-3 rounded-full ${statusColor(status).split(' ')[0]}`}></div>
              <span className="text-sm text-slate-600 dark:text-slate-400">{status}: {statusCounts[status] ?? 0}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sort and filter */}
      <div className="border-b border-slate-200 px-8 py-4 dark:border-slate-800">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
        >
          <option value="status">Duruma göre sırala</option>
          <option value="priority">Önceliğe göre sırala</option>
          <option value="assignee">Atanacak kişiye göre sırala</option>
        </select>
      </div>

      {/* Items grid */}
      <div className="flex-1 overflow-auto px-8 py-6">
        <div className="grid gap-4 auto-rows-max">
          {sortedItems.map((item) => (
            <div
              key={item.id}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md hover:border-indigo-300 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-indigo-500/50"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{typeIcon(item.type)}</span>
                    <div>
                      <p className="text-xs font-semibold uppercase text-slate-400">{item.key}</p>
                      <h3 className="mt-1 font-medium text-slate-900 dark:text-white">{item.title}</h3>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusColor(item.status)}`}>{item.status}</span>
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${priorityColor(item.priority)}`}>{item.priority}</span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">{item.type}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 text-xs font-bold text-white">
                    {item.assignee.charAt(0)}
                  </div>
                  <p className="text-xs text-slate-500">{item.storyPoints} pt</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Assigned: {item.assignee}</span>
                <span>{item.dueDate}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
