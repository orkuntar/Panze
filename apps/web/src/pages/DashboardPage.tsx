import { useEffect, useState } from 'react';
import { loadDemoData, type DemoWorkspace } from '../lib/demoData';
import Layout from '../components/Layout';
import ProjectsView from '../components/ProjectsView';

export default function DashboardPage() {
  const [workspace, setWorkspace] = useState<DemoWorkspace | null>(null);

  useEffect(() => {
    setWorkspace(loadDemoData());
  }, []);

  return (
    <Layout>
      {workspace && <ProjectsView projects={workspace.projects} />}
    </Layout>
  );
}
