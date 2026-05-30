import { ReactNode, useState } from 'react';
import { IconGrid, IconChevronDown, IconMenu, IconSearch, IconBell, IconSettings, IconLogout } from '../lib/icons';
import { useAuthStore } from '../store/authStore';

interface LayoutProps {
  children: ReactNode;
  selectedProject?: string;
  onProjectSelect?: (projectId: string) => void;
}

export default function Layout({ children, selectedProject, onProjectSelect }: LayoutProps) {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  const workspaceProjects = [
    { id: 'project-dm', key: 'DM', name: 'Delivery Management', icon: '📦' },
    { id: 'project-mk', key: 'MK', name: 'Marketing Kanban', icon: '📊' }
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <aside className={`${collapsed ? 'w-20' : 'w-64'} border-r border-slate-200 bg-white/95 dark:border-slate-800 dark:bg-slate-900/95 transition-all duration-300`}>
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="border-b border-slate-200 px-6 py-5 dark:border-slate-800">
            <div className="flex items-center justify-between gap-2">
              <div className={`flex items-center gap-2 ${collapsed ? 'justify-center w-full' : ''}`}>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white font-bold">M</div>
                {!collapsed && <span className="text-lg font-bold text-slate-900 dark:text-white">MondayClone</span>}
              </div>
              {!collapsed && (
                <button onClick={() => setCollapsed(true)} className="rounded-lg p-1 hover:bg-slate-100 dark:hover:bg-slate-800">
                  <IconChevronDown className="h-4 w-4 rotate-90" />
                </button>
              )}
            </div>
          </div>

          {/* Projects */}
          <div className="flex-1 overflow-y-auto px-4 py-6">
            <div className={collapsed ? '' : 'mb-6'}>
              {!collapsed && <h3 className="mb-3 px-2 text-xs font-semibold uppercase text-slate-400">Projeler</h3>}
              <div className="space-y-2">
                {workspaceProjects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => onProjectSelect?.(project.id)}
                    className={`w-full rounded-lg px-3 py-3 text-left text-sm font-medium transition ${
                      selectedProject === project.id
                        ? 'bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300'
                        : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{project.icon}</span>
                      {!collapsed && <span>{project.name}</span>}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {!collapsed && (
              <button className="w-full rounded-lg border-2 border-dashed border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800">
                + Proje Ekle
              </button>
            )}
          </div>

          {/* Collapsed toggle */}
          {collapsed && (
            <button onClick={() => setCollapsed(false)} className="mx-4 mb-4 rounded-lg bg-indigo-500/10 p-2 text-indigo-600 transition hover:bg-indigo-500/20 dark:text-indigo-300">
              <IconChevronDown className="h-4 w-4 -rotate-90" />
            </button>
          )}

          {/* User section */}
          <div className="border-t border-slate-200 p-4 dark:border-slate-800">
            <button
              onClick={logout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20"
            >
              <IconLogout className="h-4 w-4" />
              {!collapsed && <span>Çıkış</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="border-b border-slate-200 bg-white/95 px-8 py-4 dark:border-slate-800 dark:bg-slate-900/95">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-1 items-center gap-4">
              <button className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden">
                <IconMenu className="h-5 w-5" />
              </button>
              <div className="relative flex-1 max-w-xs">
                <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Ara..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2 text-sm placeholder-slate-400 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-950 dark:placeholder-slate-600 dark:focus:border-indigo-400"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative rounded-lg p-2 transition hover:bg-slate-100 dark:hover:bg-slate-800">
                <IconBell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
              </button>
              <button className="rounded-lg p-2 transition hover:bg-slate-100 dark:hover:bg-slate-800">
                <IconSettings className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-3 border-l border-slate-200 pl-4 dark:border-slate-700">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 text-sm font-bold text-white">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{user?.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{user?.role}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
