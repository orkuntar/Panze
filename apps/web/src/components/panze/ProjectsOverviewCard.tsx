import React, { useMemo } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import type { DemoWorkspace } from '../../lib/demoData';
import { statusBreakdown } from '../../lib/analytics';

interface ProjectsOverviewCardProps {
  workspace: DemoWorkspace;
}

export const ProjectsOverviewCard: React.FC<ProjectsOverviewCardProps> = ({ workspace }) => {
  const { pieData, total } = useMemo(() => {
    const breakdown = statusBreakdown(workspace);
    return {
      total: breakdown.total,
      pieData: [
        { name: 'In Progress', value: breakdown.progress, color: '#F8852C' },
        { name: 'Completed', value: breakdown.done, color: '#2F8BFB' },
        { name: 'Not Started', value: breakdown.todo, color: '#E6E8EB' }
      ]
    };
  }, [workspace]);

  const pct = (value: number) => (total === 0 ? 0 : Math.round((value / total) * 100));

  return (
    <div className="bg-white rounded-2xl p-8 shadow-card card-hover">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-muted">Projects Overview</p>
          <h2 className="text-3xl font-extrabold text-ink mt-2">Task Status</h2>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <div className="w-[180px] h-[180px]">
          <ResponsiveContainer width="99%" height="100%" minWidth={0}>
            <PieChart>
              <Pie data={pieData} dataKey="value" cx="50%" cy="50%" innerRadius={54} outerRadius={80} startAngle={90} endAngle={-270}>
                {pieData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  borderRadius: 16,
                  border: '1px solid #E6E8EB',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.08)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1">
          {pieData.map((segment) => (
            <div key={segment.name} className="flex items-center justify-between gap-4 py-3">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: segment.color }}></span>
                <div>
                  <p className="text-sm font-medium text-ink">{segment.name}</p>
                  <p className="text-xs text-muted">{segment.value} tasks</p>
                </div>
              </div>
              <p className="text-sm font-semibold text-ink">{pct(segment.value)}%</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
