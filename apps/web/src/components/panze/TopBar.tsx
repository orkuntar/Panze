import React, { useState } from 'react';
import { Search, Sun, Moon, Globe, Palette, Check } from 'lucide-react';
import { useUiStore, type Accent } from '../../store/uiStore';
import { useT } from '../../lib/i18n';

interface PanzeTopBarProps {
  workspaceName: string;
  membersCount: number;
  activeView: 'dashboard' | 'board' | 'sprint' | 'table' | 'report';
  onViewChange: (view: 'dashboard' | 'board' | 'sprint' | 'table' | 'report') => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const ACCENTS: { id: Accent; color: string }[] = [
  { id: 'blue', color: '#2F8BFB' },
  { id: 'violet', color: '#7C4DFF' },
  { id: 'emerald', color: '#10B981' },
  { id: 'rose', color: '#F43F5E' },
  { id: 'amber', color: '#F8852C' }
];

export const PanzeTopBar: React.FC<PanzeTopBarProps> = ({ workspaceName, membersCount, activeView, onViewChange, searchQuery, onSearchChange }) => {
  const t = useT();
  const { theme, accent, language, toggleTheme, setAccent, setLanguage } = useUiStore();
  const [showAppearance, setShowAppearance] = useState(false);

  const views = [
    { id: 'dashboard', label: t('nav.dashboard') },
    { id: 'board', label: t('nav.board') },
    { id: 'sprint', label: t('nav.sprint') },
    { id: 'table', label: t('nav.table') },
    { id: 'report', label: t('nav.report') }
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
          {workspaceName} · {membersCount} {t('topbar.members')}
        </div>
      </div>

      <div className="flex gap-2">
        {views.map((view) => (
          <button
            key={view.id}
            onClick={() => onViewChange(view.id as PanzeTopBarProps['activeView'])}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              activeView === view.id ? 'bg-accent-blue text-white' : 'bg-neutral-100 text-ink hover:bg-neutral-200'
            }`}
          >
            {view.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-56">
          <div className="bg-neutral-100 rounded-full px-4 py-2.5 flex items-center gap-3 transition-colors focus-within:ring-2 focus-within:ring-accent-blue/40">
            <Search size={18} className="text-muted" />
            <input
              type="text"
              placeholder={t('topbar.search')}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="bg-transparent outline-none text-sm text-ink placeholder-muted w-full"
            />
          </div>
        </div>

        {/* Language toggle */}
        <button
          onClick={() => setLanguage(language === 'tr' ? 'en' : 'tr')}
          className="flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-2.5 text-sm font-semibold text-ink hover:bg-neutral-200"
          title={t('topbar.language')}
        >
          <Globe size={16} />
          <span className="uppercase">{language}</span>
        </button>

        {/* Dark mode toggle */}
        <button
          onClick={toggleTheme}
          className="rounded-full bg-neutral-100 p-2.5 text-ink hover:bg-neutral-200"
          title={theme === 'light' ? t('topbar.dark') : t('topbar.light')}
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {/* Accent / appearance */}
        <div className="relative">
          <button
            onClick={() => setShowAppearance((p) => !p)}
            className="rounded-full bg-neutral-100 p-2.5 text-ink hover:bg-neutral-200"
            title={t('topbar.appearance')}
          >
            <Palette size={18} />
          </button>
          {showAppearance && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowAppearance(false)} />
              <div className="absolute right-0 z-50 mt-2 w-52 rounded-3xl border border-line bg-white p-4 shadow-2xl animate-scale-in origin-top-right">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{t('topbar.accent')}</p>
                <div className="mt-3 flex gap-2">
                  {ACCENTS.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setAccent(option.id)}
                      className="relative h-8 w-8 rounded-full transition hover:scale-110"
                      style={{ backgroundColor: option.color }}
                      title={option.id}
                    >
                      {accent === option.id && <Check size={16} className="absolute inset-0 m-auto text-white" />}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
