import type { DemoWorkspace, DemoItem } from './demoData';

export type StatusCategory = 'done' | 'progress' | 'todo';

export const categorize = (status: string): StatusCategory => {
  if (status === 'Done') return 'done';
  if (status === 'In Progress' || status === 'Doing' || status === 'Selected') return 'progress';
  return 'todo';
};

export const allItems = (workspace: DemoWorkspace): DemoItem[] =>
  workspace.projects.flatMap((project) => project.items);

export const statusBreakdown = (workspace: DemoWorkspace) => {
  const items = allItems(workspace);
  const counts = { done: 0, progress: 0, todo: 0 };
  for (const item of items) counts[categorize(item.status)] += 1;
  return { ...counts, total: items.length };
};

export const perProjectPoints = (workspace: DemoWorkspace) =>
  workspace.projects.map((project) => {
    const planned = project.items.reduce((sum, item) => sum + (item.storyPoints || 0), 0);
    const completed = project.items
      .filter((item) => categorize(item.status) === 'done')
      .reduce((sum, item) => sum + (item.storyPoints || 0), 0);
    return { name: project.name, planned, completed };
  });
