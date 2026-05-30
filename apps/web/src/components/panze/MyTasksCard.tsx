import React, { useMemo } from 'react';
import { CheckCircle2, MapPin } from 'lucide-react';
import type { DemoWorkspace } from '../../lib/demoData';
import { allItems, categorize } from '../../lib/analytics';

interface MyTasksCardProps {
  workspace: DemoWorkspace;
  currentUserName: string | null;
}

export const MyTasksCard: React.FC<MyTasksCardProps> = ({ workspace, currentUserName }) => {
  const tasks = useMemo(() => {
    const items = allItems(workspace);
    const mine = currentUserName ? items.filter((item) => item.assignee === currentUserName) : [];
    const source = mine.length > 0 ? mine : items;
    return source
      .filter((item) => categorize(item.status) !== 'done')
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
      .slice(0, 5);
  }, [workspace, currentUserName]);

  return (
    <div className="bg-white rounded-2xl p-8 shadow-card card-hover">
      <h2 className="text-3xl font-extrabold text-ink mb-6">My Tasks</h2>
      <div className="space-y-3 stagger">
        {tasks.length === 0 && <p className="text-sm text-muted">Açık task yok 🎉</p>}
        {tasks.map((task, index) => {
          const peach = index % 2 === 0;
          return (
            <div
              key={task.id}
              className={`rounded-xl px-4 py-3.5 flex items-start gap-3 ${peach ? 'bg-task-peach' : 'bg-task-blue'}`}
            >
              <div className={`mt-0.5 ${peach ? 'text-gradient-from' : 'text-accent-blue'}`}>
                <MapPin size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-ink text-sm truncate">{task.key} · {task.title}</h3>
                <p className="text-xs text-muted mt-0.5">{task.status} · {task.assignee} · {task.dueDate}</p>
              </div>
              <button className="flex-shrink-0 mt-0.5 hover:opacity-70 transition-opacity">
                <CheckCircle2 size={20} className={peach ? 'text-gradient-from' : 'text-accent-blue'} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
