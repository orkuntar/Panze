import React, { useMemo } from 'react';
import type { DemoWorkspace } from '../../lib/demoData';
import { allItems, categorize } from '../../lib/analytics';

export const InvoiceOverviewCard: React.FC<{ workspace: DemoWorkspace }> = ({ workspace }) => {
  const rows = useMemo(() => {
    const items = allItems(workspace);
    const total = items.length || 1;
    const build = (label: string, cat: 'done' | 'progress' | 'todo') => {
      const matched = items.filter((item) => categorize(item.status) === cat);
      const points = matched.reduce((sum, item) => sum + (item.storyPoints || 0), 0);
      return { label, count: matched.length, points, pct: Math.round((matched.length / total) * 100) };
    };
    return [build('Completed', 'done'), build('In Progress', 'progress'), build('Not Started', 'todo')];
  }, [workspace]);

  return (
    <div className="bg-white rounded-2xl p-8 shadow-card">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-muted">Workload Overview</p>
          <h2 className="text-3xl font-extrabold text-ink mt-2">Task Distribution</h2>
        </div>
        <div className="rounded-full bg-neutral-100 px-4 py-2 text-sm font-semibold text-ink">All Projects</div>
      </div>

      <div className="space-y-6">
        {rows.map((row) => (
          <div key={row.label} className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-base font-semibold text-ink">{row.label}</p>
                <p className="text-sm text-muted">{row.count} tasks · {row.points} pts</p>
              </div>
              <p className="text-base font-semibold text-ink">{row.pct}%</p>
            </div>
            <div className="h-3 rounded-full bg-neutral-100 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-purple-700 to-indigo-500" style={{ width: `${row.pct}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
