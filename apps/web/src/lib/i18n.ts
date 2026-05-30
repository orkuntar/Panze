import { useUiStore } from '../store/uiStore';

type Dict = Record<string, { tr: string; en: string }>;

// Central UI string table. Add keys here; components read them via useT().
export const STRINGS: Dict = {
  // nav / chrome
  'nav.dashboard': { tr: 'Panel', en: 'Dashboard' },
  'nav.board': { tr: 'Pano', en: 'Board' },
  'nav.sprint': { tr: 'Sprint', en: 'Sprint' },
  'nav.table': { tr: 'Tablo', en: 'Table' },
  'nav.report': { tr: 'Rapor', en: 'Report' },
  'nav.settings': { tr: 'Ayarlar', en: 'Settings' },
  'topbar.members': { tr: 'üye', en: 'members' },
  'topbar.search': { tr: 'Task, pano, proje ara...', en: 'Search tasks, boards, projects...' },
  'topbar.language': { tr: 'Dil', en: 'Language' },
  'topbar.theme': { tr: 'Tema', en: 'Theme' },
  'topbar.appearance': { tr: 'Görünüm', en: 'Appearance' },
  'topbar.accent': { tr: 'Vurgu Rengi', en: 'Accent' },
  'topbar.light': { tr: 'Açık', en: 'Light' },
  'topbar.dark': { tr: 'Koyu', en: 'Dark' },

  // common actions
  'action.save': { tr: 'Kaydet', en: 'Save' },
  'action.cancel': { tr: 'İptal', en: 'Cancel' },
  'action.delete': { tr: 'Sil', en: 'Delete' },
  'action.create': { tr: 'Oluştur', en: 'Create' },
  'action.add': { tr: 'Ekle', en: 'Add' },

  // board
  'board.title': { tr: 'Pano Görünümü', en: 'Board View' },
  'board.newTask': { tr: 'Yeni Task Oluştur', en: 'New Task' },
  'board.found': { tr: 'task bulundu · taşımak için kartları sürükleyin', en: 'task found · drag cards to move' },
  'board.allAssignees': { tr: 'Tüm Atananlar', en: 'All Assignees' },
  'board.allPriorities': { tr: 'Tüm Öncelikler', en: 'All Priorities' },
  'board.sortNone': { tr: 'Sıralama: Yok', en: 'Sort: None' },
  'board.sortPriority': { tr: 'Önceliğe göre', en: 'By priority' },
  'board.sortDue': { tr: 'Bitiş tarihine göre', en: 'By due date' },
  'board.sortPoints': { tr: 'Story points', en: 'Story points' },
  'board.sortTitle': { tr: 'Başlığa göre', en: 'By title' },
  'board.noTasks': { tr: 'Henüz task yok', en: 'No tasks yet' },

  // task modal
  'task.new': { tr: 'Yeni Task', en: 'New Task' },
  'task.title': { tr: 'Başlık', en: 'Title' },
  'task.titlePlaceholder': { tr: 'Task başlığı', en: 'Task title' },
  'task.status': { tr: 'Durum', en: 'Status' },
  'task.type': { tr: 'Tip', en: 'Type' },
  'task.priority': { tr: 'Öncelik', en: 'Priority' },
  'task.assignee': { tr: 'Atanan', en: 'Assignee' },
  'task.points': { tr: 'Story Points', en: 'Story Points' },
  'task.due': { tr: 'Bitiş', en: 'Due' },
  'task.reporter': { tr: 'Raporlayan', en: 'Reporter' },

  // sprint
  'sprint.backlog': { tr: 'Scrum Backlog', en: 'Scrum Backlog' },
  'sprint.new': { tr: 'Yeni Sprint', en: 'New Sprint' },
  'sprint.name': { tr: 'Sprint adı', en: 'Sprint name' },
  'sprint.goal': { tr: 'Sprint hedefi', en: 'Sprint goal' },
  'sprint.start': { tr: 'Sprint Başlat', en: 'Start Sprint' },
  'sprint.complete': { tr: 'Sprint Tamamla', en: 'Complete Sprint' },
  'sprint.empty': { tr: "Bu sprintte henüz item yok — backlog'dan taşıyın.", en: 'No items in this sprint yet — move some from the backlog.' },
  'sprint.backlogEmpty': { tr: 'Backlog boş.', en: 'Backlog is empty.' },
  'sprint.kanbanNote': { tr: 'Bu bir Kanban projesi — sprint akışı yalnızca Scrum projelerinde kullanılır.', en: 'This is a Kanban project — sprints are only used in Scrum projects.' },

  // table
  'table.title': { tr: 'Çalışma Alanı Tablosu', en: 'Workspace Table' },
  'table.newTable': { tr: 'Yeni Tablo', en: 'New Table' },
  'table.addColumn': { tr: 'Kolon Ekle', en: 'Add Column' },
  'table.addRow': { tr: 'Satır Ekle', en: 'Add Row' },
  'table.columns': { tr: 'kolon', en: 'columns' },
  'table.rows': { tr: 'satır', en: 'rows' },
  'table.empty': { tr: 'Bu tabloya henüz satır eklenmedi.', en: 'No rows added to this table yet.' },
  'table.columnName': { tr: 'Kolon Adı', en: 'Column Name' },
  'table.columnType': { tr: 'Kolon Türü', en: 'Column Type' }
};

export function useT() {
  const language = useUiStore((state) => state.language);
  return (key: keyof typeof STRINGS | string): string => {
    const entry = STRINGS[key as string];
    if (!entry) return key as string;
    return entry[language];
  };
}
