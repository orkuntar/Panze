import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { mockProjectsData } from '../../data/mock';

const pieData = [
  { name: 'In Progress', value: mockProjectsData.inProgress, color: '#F8852C' },
  { name: 'Completed', value: mockProjectsData.completed, color: '#2F8BFB' },
  { name: 'Not Started', value: mockProjectsData.notStarted, color: '#E6E8EB' }
];

export const ProjectsOverviewCard: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-card">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-muted">Projects Overview</p>
          <h2 className="text-3xl font-extrabold text-ink mt-2">Project Status</h2>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <div className="w-[180px] h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
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
                  <p className="text-xs text-muted">{segment.value} Projects</p>
                </div>
              </div>
              <p className="text-sm font-semibold text-ink">{segment.value}%</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
