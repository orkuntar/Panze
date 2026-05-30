import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import type { DemoWorkspace } from '../../lib/demoData';
import { perProjectPoints } from '../../lib/analytics';

export const IncomeExpenseCard: React.FC<{ workspace: DemoWorkspace }> = ({ workspace }) => {
  const data = useMemo(
    () => perProjectPoints(workspace).map((row) => ({ name: row.name, planned: row.planned, completed: row.completed })),
    [workspace]
  );

  return (
    <div className="bg-white rounded-2xl p-8 shadow-card">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-muted">Planned VS Completed</p>
          <h2 className="text-3xl font-extrabold text-ink mt-2">Story Points</h2>
        </div>
        <div className="rounded-full bg-neutral-100 px-4 py-2 text-sm font-semibold text-ink">By Project</div>
      </div>

      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="plannedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2F8BFB" stopOpacity={0.24} />
                <stop offset="95%" stopColor="#2F8BFB" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="completedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F8852C" stopOpacity={0.24} />
                <stop offset="95%" stopColor="#F8852C" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#ECEDEF" vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#8A8F98', fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#8A8F98', fontSize: 12 }} tickFormatter={(value) => `${value}`} />
            <Tooltip
              formatter={(value) => `${value} pts`}
              contentStyle={{
                backgroundColor: '#fff',
                borderRadius: 16,
                border: '1px solid #E6E8EB',
                boxShadow: '0 10px 30px rgba(0,0,0,0.08)'
              }}
            />
            <Area type="monotone" dataKey="planned" stroke="#2F8BFB" strokeWidth={3} fill="url(#plannedGradient)" fillOpacity={1} />
            <Area type="monotone" dataKey="completed" stroke="#F8852C" strokeWidth={3} fill="url(#completedGradient)" fillOpacity={1} />
            <Line type="monotone" dataKey="planned" stroke="#2F8BFB" strokeWidth={3} dot={false} />
            <Line type="monotone" dataKey="completed" stroke="#F8852C" strokeWidth={3} dot={false} strokeDasharray="6 6" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
