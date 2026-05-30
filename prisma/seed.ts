import { PrismaClient, UserRole, ProjectType, BoardType, ItemType, Priority, SprintStatus, WorkflowCategory } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  await prisma.activityLog.deleteMany();
  await prisma.automationRule.deleteMany();
  await prisma.attachment.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.customFieldValue.deleteMany();
  await prisma.customFieldDefinition.deleteMany();
  await prisma.itemLink.deleteMany();
  await prisma.label.deleteMany();
  await prisma.worklog.deleteMany();
  await prisma.item.deleteMany();
  await prisma.workflowStatus.deleteMany();
  await prisma.sprint.deleteMany();
  await prisma.group.deleteMany();
  await prisma.board.deleteMany();
  await prisma.version.deleteMany();
  await prisma.project.deleteMany();
  await prisma.workspaceMembership.deleteMany();
  await prisma.workspace.deleteMany();
  await prisma.user.deleteMany();

  const password = await bcrypt.hash('Password123!', 10);

  const [alice, bob, ceyda, demo] = await Promise.all([
    prisma.user.create({ data: { name: 'Alice Yılmaz', email: 'alice@example.com', password, role: UserRole.ADMIN } }),
    prisma.user.create({ data: { name: 'Bob Demir', email: 'bob@example.com', password, role: UserRole.MEMBER } }),
    prisma.user.create({ data: { name: 'Ceyda Arslan', email: 'ceyda@example.com', password, role: UserRole.MEMBER } }),
    prisma.user.create({ data: { name: 'Demo Kullanıcı', email: 'demo@example.com', password, role: UserRole.MEMBER } })
  ]);

  const workspace = await prisma.workspace.create({
    data: {
      name: 'MondayClone Workspace',
      description: 'Demo workspace for the MondayClone platform.',
      memberships: {
        create: [
          { userId: alice.id, role: UserRole.ADMIN },
          { userId: bob.id, role: UserRole.MEMBER },
          { userId: ceyda.id, role: UserRole.MEMBER },
          { userId: demo.id, role: UserRole.MEMBER }
        ]
      }
    }
  });

  const scrum = await prisma.project.create({
    data: {
      key: 'DM',
      name: 'Delivery Management',
      type: ProjectType.SCRUM,
      description: 'Scrum proje örneği.',
      leadUserId: alice.id,
      workspaceId: workspace.id,
      workflowStatuses: {
        create: [
          { name: 'Backlog', category: WorkflowCategory.TODO, color: '#6B7280', sortOrder: 0 },
          { name: 'Selected', category: WorkflowCategory.TODO, color: '#2563EB', sortOrder: 1 },
          { name: 'In Progress', category: WorkflowCategory.INPROGRESS, color: '#F59E0B', sortOrder: 2 },
          { name: 'Done', category: WorkflowCategory.DONE, color: '#10B981', sortOrder: 3 }
        ]
      },
      boards: {
        create: [
          {
            name: 'Scrum Board',
            type: BoardType.SCRUM,
            groups: { create: [{ name: 'Backlog', color: '#F3F4F6', sortOrder: 0 }, { name: 'Sprint Ready', color: '#E5E7EB', sortOrder: 1 }] }
          }
        ]
      },
      sprints: {
        create: [
          { name: 'Sprint 1', goal: 'Kritik hikayeleri tamamla', startDate: new Date(), endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), status: SprintStatus.ACTIVE }
        ]
      }
    }
  });

  const kanban = await prisma.project.create({
    data: {
      key: 'MK',
      name: 'Marketing Kanban',
      type: ProjectType.KANBAN,
      description: 'Kanban proje örneği.',
      leadUserId: bob.id,
      workspaceId: workspace.id,
      workflowStatuses: {
        create: [
          { name: 'To Do', category: WorkflowCategory.TODO, color: '#6B7280', sortOrder: 0 },
          { name: 'Doing', category: WorkflowCategory.INPROGRESS, color: '#F59E0B', sortOrder: 1 },
          { name: 'Done', category: WorkflowCategory.DONE, color: '#10B981', sortOrder: 2 }
        ]
      },
      boards: {
        create: [{ name: 'Kanban Board', type: BoardType.KANBAN, groups: { create: [{ name: 'Default', color: '#E5E7EB', sortOrder: 0 }] } }]
      }
    }
  });

  const scrumItems = [
    { key: 'DM-1', type: ItemType.STORY, title: 'Yeni kullanıcı akışı tasarla', status: 'Backlog', priority: Priority.HIGH, assigneeId: alice.id, reporterId: bob.id, storyPoints: 5, rank: 100 },
    { key: 'DM-2', type: ItemType.BUG, title: 'Dashboard yüklenmiyor hatası', status: 'Selected', priority: Priority.HIGHEST, assigneeId: ceyda.id, reporterId: alice.id, storyPoints: 3, rank: 200 },
    { key: 'DM-3', type: ItemType.TASK, title: 'Veri modeli doğrulama ekle', status: 'In Progress', priority: Priority.MEDIUM, assigneeId: bob.id, reporterId: ceyda.id, storyPoints: 2, rank: 300 },
    { key: 'DM-4', type: ItemType.TASK, title: 'Sprint 1 geribildirim toplantısı', status: 'Done', priority: Priority.LOW, assigneeId: alice.id, reporterId: demo.id, storyPoints: 1, rank: 400 },
    { key: 'DM-5', type: ItemType.EPIC, title: 'Mobil uygulama entegrasyonu', status: 'Backlog', priority: Priority.HIGH, assigneeId: bob.id, reporterId: alice.id, storyPoints: 8, rank: 500 },
    { key: 'DM-6', type: ItemType.STORY, title: 'API doğrulama katmanı ekle', status: 'Backlog', priority: Priority.MEDIUM, assigneeId: ceyda.id, reporterId: demo.id, storyPoints: 5, rank: 600 },
    { key: 'DM-7', type: ItemType.BUG, title: 'Bildirimler gecikiyor', status: 'Selected', priority: Priority.HIGH, assigneeId: alice.id, reporterId: bob.id, storyPoints: 2, rank: 700 },
    { key: 'DM-8', type: ItemType.STORY, title: 'Kullanıcı profil sayfası tasarımı', status: 'Selected', priority: Priority.MEDIUM, assigneeId: ceyda.id, reporterId: alice.id, storyPoints: 3, rank: 800 },
    { key: 'DM-9', type: ItemType.TASK, title: 'Ürün sürüm notu şablonu oluştur', status: 'In Progress', priority: Priority.LOW, assigneeId: demo.id, reporterId: bob.id, storyPoints: 1, rank: 900 },
    { key: 'DM-10', type: ItemType.TASK, title: 'Sprint kapanış raporu şablonu', status: 'In Progress', priority: Priority.MEDIUM, assigneeId: bob.id, reporterId: ceyda.id, storyPoints: 2, rank: 1000 },
    { key: 'DM-11', type: ItemType.STORY, title: 'Performans izleme paneli', status: 'Backlog', priority: Priority.HIGH, assigneeId: alice.id, reporterId: demo.id, storyPoints: 8, rank: 1100 },
    { key: 'DM-12', type: ItemType.TASK, title: 'Erişilebilirlik testi yap', status: 'Backlog', priority: Priority.MEDIUM, assigneeId: ceyda.id, reporterId: alice.id, storyPoints: 3, rank: 1200 },
    { key: 'DM-13', type: ItemType.BUG, title: 'Mobilde menü görünmüyor', status: 'Selected', priority: Priority.HIGH, assigneeId: bob.id, reporterId: demo.id, storyPoints: 2, rank: 1300 },
    { key: 'DM-14', type: ItemType.TASK, title: 'Yayınlanacak sürüm planla', status: 'Done', priority: Priority.MEDIUM, assigneeId: alice.id, reporterId: bob.id, storyPoints: 1, rank: 1400 },
    { key: 'DM-15', type: ItemType.EPIC, title: 'Entegrasyon yönetimi', status: 'Backlog', priority: Priority.HIGH, assigneeId: ceyda.id, reporterId: alice.id, storyPoints: 13, rank: 1500 },
    { key: 'DM-16', type: ItemType.STORY, title: 'Özel alanlar için UI oluştur', status: 'Backlog', priority: Priority.MEDIUM, assigneeId: demo.id, reporterId: ceyda.id, storyPoints: 5, rank: 1600 },
    { key: 'DM-17', type: ItemType.BUG, title: 'Zaman çizelgesinde tarih hatası', status: 'Selected', priority: Priority.HIGH, assigneeId: bob.id, reporterId: alice.id, storyPoints: 3, rank: 1700 },
    { key: 'DM-18', type: ItemType.TASK, title: 'Bildirim ayarları sayfası', status: 'In Progress', priority: Priority.MEDIUM, assigneeId: ceyda.id, reporterId: demo.id, storyPoints: 3, rank: 1800 },
    { key: 'DM-19', type: ItemType.STORY, title: 'Form gönderim entegrasyonu', status: 'Backlog', priority: Priority.MEDIUM, assigneeId: alice.id, reporterId: demo.id, storyPoints: 5, rank: 1900 },
    { key: 'DM-20', type: ItemType.TASK, title: 'Proje ayarları modalı', status: 'Backlog', priority: Priority.LOW, assigneeId: bob.id, reporterId: alice.id, storyPoints: 2, rank: 2000 }
  ];

  for (const item of scrumItems) {
    await prisma.item.create({ data: { ...item, projectId: scrum.id } });
  }

  const kanbanItems = [
    { key: 'MK-1', type: ItemType.TASK, title: 'Pazarlama kampanya planı hazırla', status: 'To Do', priority: Priority.MEDIUM, assigneeId: bob.id, reporterId: demo.id, storyPoints: 2, rank: 100 },
    { key: 'MK-2', type: ItemType.STORY, title: 'Sosyal medya içerik takvimi oluştur', status: 'Doing', priority: Priority.MEDIUM, assigneeId: ceyda.id, reporterId: bob.id, storyPoints: 3, rank: 200 },
    { key: 'MK-3', type: ItemType.TASK, title: 'E-posta kampanyası testi', status: 'To Do', priority: Priority.LOW, assigneeId: demo.id, reporterId: bob.id, storyPoints: 1, rank: 300 },
    { key: 'MK-4', type: ItemType.BUG, title: 'Reklam görseli kırpma hatası', status: 'Done', priority: Priority.HIGH, assigneeId: bob.id, reporterId: ceyda.id, storyPoints: 2, rank: 400 },
    { key: 'MK-5', type: ItemType.STORY, title: 'Analiz paneli KPI kartları', status: 'Doing', priority: Priority.MEDIUM, assigneeId: alice.id, reporterId: demo.id, storyPoints: 3, rank: 500 },
    { key: 'MK-6', type: ItemType.TASK, title: 'KPI veri entegrasyonu', status: 'To Do', priority: Priority.HIGH, assigneeId: ceyda.id, reporterId: bob.id, storyPoints: 5, rank: 600 },
    { key: 'MK-7', type: ItemType.STORY, title: 'A/B testi sonuçları hazırla', status: 'Done', priority: Priority.MEDIUM, assigneeId: demo.id, reporterId: alice.id, storyPoints: 2, rank: 700 },
    { key: 'MK-8', type: ItemType.BUG, title: 'Sayfa yüklenme süreleri yüksek', status: 'To Do', priority: Priority.HIGH, assigneeId: bob.id, reporterId: ceyda.id, storyPoints: 3, rank: 800 },
    { key: 'MK-9', type: ItemType.TASK, title: 'İçerik takibini güncelle', status: 'Doing', priority: Priority.MEDIUM, assigneeId: alice.id, reporterId: bob.id, storyPoints: 2, rank: 900 },
    { key: 'MK-10', type: ItemType.STORY, title: 'Pazarlama panosunu yansıt', status: 'Done', priority: Priority.LOW, assigneeId: ceyda.id, reporterId: demo.id, storyPoints: 1, rank: 1000 }
  ];

  for (const item of kanbanItems) {
    await prisma.item.create({ data: { ...item, projectId: kanban.id } });
  }

  console.log('Seed tamamlandı. Varsayılan kullanıcılar: alice@example.com, bob@example.com, ceyda@example.com, demo@example.com. Şifre: Password123!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
