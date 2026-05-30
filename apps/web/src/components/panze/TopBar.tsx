import React from 'react';
import { Search } from 'lucide-react';

interface PanzeTopBarProps {
  workspaceName: string;
  membersCount: number;
  activeView: 'dashboard' | 'board' | 'table' | 'report';
  onViewChange: (view: 'dashboard' | 'board' | 'table' | 'report') => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export const PanzeTopBar: React.FC<PanzeTopBarProps> = ({ workspaceName, membersCount, activeView, onViewChange, searchQuery, onSearchChange }) => {
  const views = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'board', label: 'Board' },
    { id: 'table', label: 'Table' },
    { id: 'report', label: 'Report' }
  ];

  return (
    <div className="h-20 bg-white border-b border-line px-8 flex items-center justify-between gap-6">
      <div className="flex items-center gap-4">
        <div className="flex items-baseline gap-1">
          <h1 className="text-2xl font-extrabold text-ink">panze</h1>
          <span className="text-2xl text-gradient-from">🌿</span>
          <span className="text-sm font-semibold text-muted">studio.</span>
        </div>
        <div className="rounded-3xl bg-slate-50 px-4 py-2 text-sm text-slate-600">
          {workspaceName} · {membersCount} members
        </div>
      </div>

      <div className="flex gap-2">
        {views.map((view) => (
          <button
            key={view.id}
            onClick={() => onViewChange(view.id as any)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              activeView === view.id ? 'bg-accent-blue text-white' : 'bg-neutral-100 text-ink hover:bg-neutral-200'
            }`}
          >
            {view.label}
          </button>
        ))}
      </div>

      <div className="relative w-72">
        <div className="bg-neutral-100 rounded-full px-4 py-2.5 flex items-center gap-3 hover:bg-neutral-200 transition-colors">
          <Search size={18} className="text-muted" />
          <input
            type="text"
            placeholder="Search tasks, boards, projects..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="bg-transparent outline-none text-sm text-ink placeholder-muted w-full"
          />
        </div>
      </div>
    </div>
  );
};
