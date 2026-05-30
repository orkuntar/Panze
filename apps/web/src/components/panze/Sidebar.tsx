import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid3x3,
  Layers,
  Repeat,
  Table,
  FileText,
  Settings,
  Table2
} from 'lucide-react';
import { useT } from '../../lib/i18n';

interface PanzeSidebarProps {
  activeView: 'dashboard' | 'board' | 'sprint' | 'table' | 'report';
  onViewChange: (view: 'dashboard' | 'board' | 'sprint' | 'table' | 'report') => void;
}

export const PanzeSidebar: React.FC<PanzeSidebarProps> = ({ activeView, onViewChange }) => {
  const t = useT();
  const navigate = useNavigate();
  const icons = [
    { Icon: Grid3x3, label: t('nav.dashboard'), view: 'dashboard' as const },
    { Icon: Layers, label: t('nav.board'), view: 'board' as const },
    { Icon: Repeat, label: t('nav.sprint'), view: 'sprint' as const },
    { Icon: Table, label: t('nav.table'), view: 'table' as const },
    { Icon: FileText, label: t('nav.report'), view: 'report' as const }
  ];

  return (
    <div className="w-24 bg-white border-r border-line flex flex-col items-center py-6 gap-4 h-screen">
      <div className="flex flex-col gap-3">
        {icons.map((item) => (
          <button
            key={item.label}
            onClick={() => onViewChange(item.view)}
            className="relative"
            title={item.label}
          >
            <div
              className={`w-[52px] h-[52px] rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 ${
                activeView === item.view
                  ? 'bg-ink text-white scale-105 shadow-lg'
                  : 'bg-neutral-100 text-ink hover:bg-neutral-200'
              }`}
            >
              <item.Icon size={24} />
            </div>
          </button>
        ))}
      </div>

      <div className="flex-1" />
      <button onClick={() => navigate('/board')} className="relative" title="Monday Board">
        <div className="w-[52px] h-[52px] rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 bg-md-primary text-white shadow-lg">
          <Table2 size={24} />
        </div>
      </button>
      <button
        onClick={() => onViewChange('dashboard')}
        className="relative"
        title="Settings"
      >
        <div
          className={`w-[52px] h-[52px] rounded-full flex items-center justify-center transition-all ${
            activeView === 'dashboard'
              ? 'bg-ink text-white'
              : 'bg-neutral-100 text-ink hover:bg-neutral-200'
          }`}
        >
          <Settings size={24} />
        </div>
      </button>
    </div>
  );
};
