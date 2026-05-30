# MondayClone

Modern proje yönetimi platformu — Jira + Monday.com tarzı web uygulaması.

## Genel Bakış

MondayClone, Scrum/Kanban panoları, sprint yönetimi, esnek kolonlu tablolar, otomasyonlar ve dashboard'lar sunan Jira ve Monday.com tarzı proje yönetim platformudur.

**Şu an:** Tarayıcı tabanlı auth ile çalışan modern UI + demo data.

## Başlangıç

```bash
npm install
cd apps/web
npm run dev
```

> http://localhost:5173 adresinde application açılır.

### Demo Hesapları

```
alice@example.com / Password123!      (ADMIN)
bob@example.com / Password123!        (MEMBER)
ceyda@example.com / Password123!      (MEMBER)
demo@example.com / Password123!       (MEMBER)
```

## Teknoloji Yığını

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS
- **Auth:** Browser localStorage (şu an tarayıcı tabanlı)
- **Demo Data:** Local storage (yenilendiğinde silinir)
- **İkonlar:** Basit SVG bileşenleri
- **Tema:** Açık/koyu tema desteği

## Proje Yapısı

```
/apps
  /web          → React frontend (Vite)
/packages
  /types        → Paylaşılan TypeScript tipleri
/prisma         → Prisma şeması (sonradan backend eklenecek)
```

## Özellikler (Faz 1)

- ✅ Modern, Monday.com benzeri UI/UX
- ✅ Sidebar + Header layout
- ✅ Proje listesi ve item detayları
- ✅ Status, priority, assignee göstergeler
- ✅ Demo workspace, projeler, 20+ item
- ✅ Koyu/Açık tema
- ✅ Responsive tasarım

## Sonraki Aşamalar (Faz 2+)

- Kanban board view
- Scrum backlog & sprint management
- Inline item editing
- Kart sürükle-bırak
- Backend API + PostgreSQL
- Socket.io canlı güncelleştirilme
- Filtreler, sıralama, search
- Otomasyonlar
- Raporlar & dashboard
- Formlar & API entegrasyonları
