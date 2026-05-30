export type DemoItemType = 'EPIC' | 'STORY' | 'TASK' | 'BUG' | 'SUBTASK';
export type DemoPriority = 'LOWEST' | 'LOW' | 'MEDIUM' | 'HIGH' | 'HIGHEST';

export type DemoItem = {
  id: string;
  key: string;
  title: string;
  type: DemoItemType;
  status: string;
  priority: DemoPriority;
  assignee: string;
  reporter: string;
  storyPoints: number;
  dueDate: string;
  projectId: string;
};

export type TableColumnType = 'text' | 'status' | 'date' | 'person' | 'number';

export type DemoTableColumn = {
  id: string;
  name: string;
  type: TableColumnType;
  options?: string[];
};

export type DemoTableRow = {
  id: string;
  values: Record<string, string>;
};

export type DemoTable = {
  id: string;
  name: string;
  columns: DemoTableColumn[];
  rows: DemoTableRow[];
};

export type DemoProject = {
  id: string;
  key: string;
  name: string;
  type: 'SCRUM' | 'KANBAN';
  description: string;
  lead: string;
  workflow: string[];
  items: DemoItem[];
};

export type DemoWorkspace = {
  id: string;
  name: string;
  description: string;
  members: string[];
  projects: DemoProject[];
  tables: DemoTable[];
};

const STORAGE_KEY = 'monday-clone-demo-data';

function createDemoData(): DemoWorkspace {
  const workspaceId = 'ws-1';

  const projects: DemoProject[] = [
    {
      id: 'project-dm',
      key: 'DM',
      name: 'Delivery Management',
      type: 'SCRUM',
      description: 'Scrum proje örneği, sprint ve issue yönetimi için.',
      lead: 'Alice Yılmaz',
      workflow: ['Backlog', 'Selected', 'In Progress', 'Done'],
      items: [
        { id: 'item-dm-1', key: 'DM-1', title: 'Yeni kullanıcı akışı tasarla', type: 'STORY', status: 'Backlog', priority: 'HIGH', assignee: 'Alice Yılmaz', reporter: 'Bob Demir', storyPoints: 5, dueDate: '2026-06-04', projectId: 'project-dm' },
        { id: 'item-dm-2', key: 'DM-2', title: 'Dashboard yüklenmiyor hatası', type: 'BUG', status: 'Selected', priority: 'HIGHEST', assignee: 'Ceyda Arslan', reporter: 'Alice Yılmaz', storyPoints: 3, dueDate: '2026-06-01', projectId: 'project-dm' },
        { id: 'item-dm-3', key: 'DM-3', title: 'Veri modeli doğrulama ekle', type: 'TASK', status: 'In Progress', priority: 'MEDIUM', assignee: 'Bob Demir', reporter: 'Ceyda Arslan', storyPoints: 2, dueDate: '2026-06-02', projectId: 'project-dm' },
        { id: 'item-dm-4', key: 'DM-4', title: 'Sprint 1 geribildirim toplantısı', type: 'TASK', status: 'Done', priority: 'LOW', assignee: 'Alice Yılmaz', reporter: 'Demo Kullanıcı', storyPoints: 1, dueDate: '2026-05-29', projectId: 'project-dm' },
        { id: 'item-dm-5', key: 'DM-5', title: 'Mobil uygulama entegrasyonu', type: 'EPIC', status: 'Backlog', priority: 'HIGH', assignee: 'Bob Demir', reporter: 'Alice Yılmaz', storyPoints: 8, dueDate: '2026-06-08', projectId: 'project-dm' },
        { id: 'item-dm-6', key: 'DM-6', title: 'API doğrulama katmanı ekle', type: 'STORY', status: 'Backlog', priority: 'MEDIUM', assignee: 'Ceyda Arslan', reporter: 'Demo Kullanıcı', storyPoints: 5, dueDate: '2026-06-06', projectId: 'project-dm' },
        { id: 'item-dm-7', key: 'DM-7', title: 'Bildirimler gecikiyor', type: 'BUG', status: 'Selected', priority: 'HIGH', assignee: 'Alice Yılmaz', reporter: 'Bob Demir', storyPoints: 2, dueDate: '2026-05-31', projectId: 'project-dm' },
        { id: 'item-dm-8', key: 'DM-8', title: 'Kullanıcı profil sayfası tasarımı', type: 'STORY', status: 'Selected', priority: 'MEDIUM', assignee: 'Ceyda Arslan', reporter: 'Alice Yılmaz', storyPoints: 3, dueDate: '2026-06-03', projectId: 'project-dm' },
        { id: 'item-dm-9', key: 'DM-9', title: 'Ürün sürüm notu şablonu oluştur', type: 'TASK', status: 'In Progress', priority: 'LOW', assignee: 'Demo Kullanıcı', reporter: 'Bob Demir', storyPoints: 1, dueDate: '2026-06-05', projectId: 'project-dm' },
        { id: 'item-dm-10', key: 'DM-10', title: 'Sprint kapanış raporu şablonu', type: 'TASK', status: 'In Progress', priority: 'MEDIUM', assignee: 'Bob Demir', reporter: 'Ceyda Arslan', storyPoints: 2, dueDate: '2026-06-04', projectId: 'project-dm' },
        { id: 'item-dm-11', key: 'DM-11', title: 'Performans izleme paneli', type: 'STORY', status: 'Backlog', priority: 'HIGH', assignee: 'Alice Yılmaz', reporter: 'Demo Kullanıcı', storyPoints: 8, dueDate: '2026-06-10', projectId: 'project-dm' },
        { id: 'item-dm-12', key: 'DM-12', title: 'Erişilebilirlik testi yap', type: 'TASK', status: 'Backlog', priority: 'MEDIUM', assignee: 'Ceyda Arslan', reporter: 'Alice Yılmaz', storyPoints: 3, dueDate: '2026-06-09', projectId: 'project-dm' }
      ]
    },
    {
      id: 'project-mk',
      key: 'MK',
      name: 'Marketing Kanban',
      type: 'KANBAN',
      description: 'Kanban proje örneği, pazarlama işleri için.',
      lead: 'Bob Demir',
      workflow: ['To Do', 'Doing', 'Done'],
      items: [
        { id: 'item-mk-1', key: 'MK-1', title: 'Pazarlama kampanya planı hazırla', type: 'TASK', status: 'To Do', priority: 'MEDIUM', assignee: 'Bob Demir', reporter: 'Demo Kullanıcı', storyPoints: 2, dueDate: '2026-06-07', projectId: 'project-mk' },
        { id: 'item-mk-2', key: 'MK-2', title: 'Sosyal medya içerik takvimi oluştur', type: 'STORY', status: 'Doing', priority: 'MEDIUM', assignee: 'Ceyda Arslan', reporter: 'Bob Demir', storyPoints: 3, dueDate: '2026-06-03', projectId: 'project-mk' },
        { id: 'item-mk-3', key: 'MK-3', title: 'E-posta kampanyası testi', type: 'TASK', status: 'To Do', priority: 'LOW', assignee: 'Demo Kullanıcı', reporter: 'Bob Demir', storyPoints: 1, dueDate: '2026-06-05', projectId: 'project-mk' },
        { id: 'item-mk-4', key: 'MK-4', title: 'Reklam görseli kırpma hatası', type: 'BUG', status: 'Done', priority: 'HIGH', assignee: 'Bob Demir', reporter: 'Ceyda Arslan', storyPoints: 2, dueDate: '2026-05-28', projectId: 'project-mk' },
        { id: 'item-mk-5', key: 'MK-5', title: 'Analiz paneli KPI kartları', type: 'STORY', status: 'Doing', priority: 'MEDIUM', assignee: 'Alice Yılmaz', reporter: 'Demo Kullanıcı', storyPoints: 3, dueDate: '2026-06-06', projectId: 'project-mk' },
        { id: 'item-mk-6', key: 'MK-6', title: 'KPI veri entegrasyonu', type: 'TASK', status: 'To Do', priority: 'HIGH', assignee: 'Ceyda Arslan', reporter: 'Bob Demir', storyPoints: 5, dueDate: '2026-06-08', projectId: 'project-mk' },
        { id: 'item-mk-7', key: 'MK-7', title: 'A/B testi sonuçları hazırla', type: 'STORY', status: 'Done', priority: 'MEDIUM', assignee: 'Demo Kullanıcı', reporter: 'Alice Yılmaz', storyPoints: 2, dueDate: '2026-06-01', projectId: 'project-mk' },
        { id: 'item-mk-8', key: 'MK-8', title: 'Sayfa yüklenme süreleri yüksek', type: 'BUG', status: 'To Do', priority: 'HIGH', assignee: 'Bob Demir', reporter: 'Ceyda Arslan', storyPoints: 3, dueDate: '2026-06-09', projectId: 'project-mk' },
        { id: 'item-mk-9', key: 'MK-9', title: 'İçerik takibini güncelle', type: 'TASK', status: 'Doing', priority: 'MEDIUM', assignee: 'Alice Yılmaz', reporter: 'Bob Demir', storyPoints: 2, dueDate: '2026-06-04', projectId: 'project-mk' },
        { id: 'item-mk-10', key: 'MK-10', title: 'Pazarlama panosunu yansıt', type: 'STORY', status: 'Done', priority: 'LOW', assignee: 'Ceyda Arslan', reporter: 'Demo Kullanıcı', storyPoints: 1, dueDate: '2026-06-02', projectId: 'project-mk' }
      ]
    }
  ];

  return {
    id: workspaceId,
    name: 'MondayClone Workspace',
    description: 'Proje yönetimi için demo workspace.',
    members: ['Alice Yılmaz', 'Bob Demir', 'Ceyda Arslan', 'Demo Kullanıcı'],
      projects,
      tables: [
        {
          id: 'table-1',
          name: 'Product Roadmap',
          columns: [
            { id: 'col-name', name: 'Task Name', type: 'text' },
            { id: 'col-status', name: 'Status', type: 'status', options: ['To Do', 'Doing', 'Done'] },
            { id: 'col-assignee', name: 'Assignee', type: 'person' },
            { id: 'col-date', name: 'Due Date', type: 'date' }
          ],
          rows: [
            {
              id: 'row-1',
              values: {
                'col-name': 'Yeni kullanıcı akışı tasarla',
                'col-status': 'To Do',
                'col-assignee': 'Alice Yılmaz',
                'col-date': '2026-06-04'
              }
            },
            {
              id: 'row-2',
              values: {
                'col-name': 'Dashboard yüklenmiyor hatası',
                'col-status': 'Doing',
                'col-assignee': 'Ceyda Arslan',
                'col-date': '2026-06-01'
              }
            },
            {
              id: 'row-3',
              values: {
                'col-name': 'Veri modeli doğrulama ekle',
                'col-status': 'To Do',
                'col-assignee': 'Bob Demir',
                'col-date': '2026-06-02'
              }
            }
          ]
        }
      ]
    };
  }

export function loadDemoData(): DemoWorkspace {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored) as DemoWorkspace;
    } catch {
      // fallback to reseed when storage is corrupt
    }
  }
  const demoData = createDemoData();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(demoData));
  return demoData;
}

export function saveDemoData(workspace: DemoWorkspace) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(workspace));
}

export function resetDemoData() {
  const demoData = createDemoData();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(demoData));
  return demoData;
}
