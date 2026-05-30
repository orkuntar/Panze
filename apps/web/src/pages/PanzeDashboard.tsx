import React, { useEffect, useState } from 'react';
import { loadDemoData, saveDemoData, type DemoWorkspace } from '../lib/demoData';
import { PanzeSidebar } from '../components/panze/Sidebar';
import { PanzeTopBar } from '../components/panze/TopBar';
import { MyTasksCard } from '../components/panze/MyTasksCard';
import { ProjectsOverviewCard } from '../components/panze/ProjectsOverviewCard';
import { IncomeExpenseCard } from '../components/panze/IncomeExpenseCard';
import { InvoiceOverviewCard } from '../components/panze/InvoiceOverviewCard';
import { ProjectBoardCard } from '../components/panze/ProjectBoardCard';
import { SprintBoardCard } from '../components/panze/SprintBoardCard';
import { TableBoardCard } from '../components/panze/TableBoardCard';
import { ReportBuilderCard } from '../components/panze/ReportBuilderCard';
import { useAuthStore } from '../store/authStore';

export const PanzeDashboard: React.FC = () => {
  const [workspace, setWorkspace] = useState<DemoWorkspace | null>(null);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'dashboard' | 'board' | 'sprint' | 'table' | 'report'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const currentUser = useAuthStore((state) => state.user);

  useEffect(() => {
    const data = loadDemoData();
    setWorkspace(data);
    setActiveProjectId(data.projects[0]?.id ?? null);
  }, []);

  const handleWorkspaceChange = (updated: DemoWorkspace) => {
    setWorkspace(updated);
    saveDemoData(updated);
  };

  const handleProjectChange = (updatedProject: DemoWorkspace['projects'][number]) => {
    if (!workspace) return;
    const updatedProjects = workspace.projects.map((project) =>
      project.id === updatedProject.id ? updatedProject : project
    );
    handleWorkspaceChange({ ...workspace, projects: updatedProjects });
  };

  // In-memory only: board card moves/edits update session state without persisting.
  const handleProjectChangeInMemory = (updatedProject: DemoWorkspace['projects'][number]) => {
    setWorkspace((prev) =>
      prev
        ? {
            ...prev,
            projects: prev.projects.map((project) =>
              project.id === updatedProject.id ? updatedProject : project
            )
          }
        : prev
    );
  };

  const activeProject = workspace?.projects.find((project) => project.id === activeProjectId) ?? null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gradient-from via-gradient-mid to-gradient-to text-ink font-sans">
      <div className="flex min-h-screen">
        <PanzeSidebar activeView={activeView} onViewChange={setActiveView} />
        <div className="flex-1 px-8 py-8">
          <div className="bg-white/80 backdrop-blur-xl rounded-[40px] p-8 shadow-card border border-white/70">
            <PanzeTopBar
              workspaceName={workspace?.name ?? 'Workspace'}
              membersCount={workspace?.members.length ?? 0}
              activeView={activeView}
              onViewChange={setActiveView}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />

            {activeView === 'dashboard' && workspace && (
              <>
                <div className="mt-8 grid gap-6 stagger xl:grid-cols-[1.35fr_1fr_1fr] lg:grid-cols-2 sm:grid-cols-1">
                  <MyTasksCard workspace={workspace} currentUserName={currentUser?.name ?? null} />
                  <ProjectsOverviewCard workspace={workspace} />
                  <IncomeExpenseCard workspace={workspace} />
                </div>

                <div className="mt-6 animate-fade-in-up">
                  <InvoiceOverviewCard workspace={workspace} />
                </div>
              </>
            )}

            {activeView === 'board' && workspace && (
              <div className="mt-8 animate-fade-in-up">
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-muted">Monday Board</p>
                    <h2 className="text-3xl font-extrabold text-ink mt-2">{activeProject?.name ?? 'Project Board'}</h2>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {workspace.projects.map((project) => (
                      <button
                        key={project.id}
                        onClick={() => setActiveProjectId(project.id)}
                        className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                          project.id === activeProjectId
                            ? 'bg-accent-blue text-white'
                            : 'bg-neutral-100 text-ink hover:bg-neutral-200'
                        }`}
                      >
                        {project.key}
                      </button>
                    ))}
                  </div>
                </div>
                <ProjectBoardCard
                  project={activeProject ?? workspace.projects[0]}
                  members={workspace.members}
                  searchQuery={searchQuery}
                  onProjectChange={handleProjectChangeInMemory}
                />
              </div>
            )}

            {activeView === 'sprint' && workspace && (
              <div className="mt-8 animate-fade-in-up">
                <div className="mb-6 flex flex-wrap justify-end gap-3">
                  {workspace.projects.map((project) => (
                    <button
                      key={project.id}
                      onClick={() => setActiveProjectId(project.id)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                        project.id === activeProjectId ? 'bg-accent-blue text-white' : 'bg-neutral-100 text-ink hover:bg-neutral-200'
                      }`}
                    >
                      {project.key}
                    </button>
                  ))}
                </div>
                <SprintBoardCard
                  project={activeProject ?? workspace.projects[0]}
                  members={workspace.members}
                  onProjectChange={handleProjectChangeInMemory}
                />
              </div>
            )}

            {activeView === 'table' && workspace && (
              <div className="mt-8 animate-fade-in-up">
                <TableBoardCard workspace={workspace} onWorkspaceChange={handleWorkspaceChange} />
              </div>
            )}

            {activeView === 'report' && workspace && (
              <div className="mt-8 animate-fade-in-up">
                <ReportBuilderCard workspace={workspace} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
