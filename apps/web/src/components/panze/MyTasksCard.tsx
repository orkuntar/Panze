import React from 'react';
import { CheckCircle2, MapPin } from 'lucide-react';
import { mockTasks } from '../../data/mock';

export const MyTasksCard: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-card">
      <h2 className="text-3xl font-extrabold text-ink mb-6">My Tasks</h2>
      <div className="space-y-3">
        {mockTasks.map((task) => (
          <div
            key={task.id}
            className={`rounded-xl px-4 py-3.5 flex items-start gap-3 ${
              task.category === 'peach' ? 'bg-task-peach' : 'bg-task-blue'
            }`}
          >
            {/* Left icon */}
            <div className={`mt-0.5 ${task.category === 'peach' ? 'text-gradient-from' : 'text-accent-blue'}`}>
              {task.icon === 'brand' ? (
                <MapPin size={20} />
              ) : (
                <MapPin size={20} />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-ink text-sm">{task.title}</h3>
              <p className="text-xs text-muted mt-0.5">{task.description}</p>
            </div>

            {/* Right check icon */}
            <button className="flex-shrink-0 mt-0.5 hover:opacity-70 transition-opacity">
              <CheckCircle2
                size={20}
                className={task.category === 'peach' ? 'text-gradient-from' : 'text-accent-blue'}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
