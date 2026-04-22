import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

// ─── Types ───────────────────────────────────────────────────────────────────
type Section = "dashboard" | "requests" | "approval" | "journal" | "mobile";

interface Application {
  id: string;
  name: string;
  object: string;
  status: "active" | "pending" | "rejected" | "expired";
  validUntil: string;
  position: string;
  passType: "QR" | "Карта";
  submittedAt: string;
}

interface JournalEntry {
  id: string;
  name: string;
  object: string;
  date: string;
  entryTime: string;
  exitTime: string;
  passType: "QR" | "Карта";
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const APPLICATIONS: Application[] = [
  { id: "ЗАЯ-001", name: "Иванов Алексей Петрович", object: "Сузун", status: "pending", validUntil: "30.06.2026", position: "Электромонтажник", passType: "QR", submittedAt: "18.04.2026" },
  { id: "ЗАЯ-002", name: "Смирнова Анна Владимировна", object: "ОБП", status: "active", validUntil: "15.07.2026", position: "Инженер ПТО", passType: "Карта", submittedAt: "10.04.2026" },
  { id: "ЗАЯ-003", name: "Козлов Дмитрий Сергеевич", object: "Дойтаги", status: "rejected", validUntil: "—", position: "Сварщик", passType: "QR", submittedAt: "15.04.2026" },
  { id: "ЗАЯ-004", name: "Новикова Елена Игоревна", object: "Тагул", status: "pending", validUntil: "01.08.2026", position: "Прораб", passType: "Карта", submittedAt: "20.04.2026" },
  { id: "ЗАЯ-005", name: "Фёдоров Павел Олегович", object: "ВЧНГ", status: "active", validUntil: "20.05.2026", position: "Монтажник", passType: "QR", submittedAt: "01.04.2026" },
  { id: "ЗАЯ-006", name: "Орлова Марина Дмитриевна", object: "ВСНК", status: "expired", validUntil: "01.04.2026", position: "Бухгалтер", passType: "Карта", submittedAt: "10.03.2026" },
  { id: "ЗАЯ-007", name: "Белов Сергей Николаевич", object: "Сузун", status: "active", validUntil: "10.07.2026", position: "Геолог", passType: "QR", submittedAt: "05.04.2026" },
  { id: "ЗАЯ-008", name: "Захарова Ольга Михайловна", object: "ВСНК", status: "pending", validUntil: "01.09.2026", position: "Эколог", passType: "Карта", submittedAt: "21.04.2026" },
  { id: "ЗАЯ-009", name: "Тихонов Роман Валерьевич", object: "Тагул", status: "active", validUntil: "15.08.2026", position: "Бурильщик", passType: "QR", submittedAt: "12.04.2026" },
  { id: "ЗАЯ-010", name: "Громов Артём Игоревич", object: "ВЧНГ", status: "pending", validUntil: "30.07.2026", position: "Оператор ДНГ", passType: "QR", submittedAt: "22.04.2026" },
];

const JOURNAL: JournalEntry[] = [
  { id: "1",  name: "Иванов Алексей Петрович",    object: "Сузун",   date: "22.04.2026", entryTime: "07:45", exitTime: "18:30", passType: "QR" },
  { id: "2",  name: "Смирнова Анна Владимировна", object: "ОБП",     date: "22.04.2026", entryTime: "08:01", exitTime: "17:55", passType: "Карта" },
  { id: "3",  name: "Фёдоров Павел Олегович",     object: "ВЧНГ",    date: "22.04.2026", entryTime: "07:58", exitTime: "18:10", passType: "QR" },
  { id: "4",  name: "Белов Сергей Николаевич",    object: "Сузун",   date: "22.04.2026", entryTime: "08:20", exitTime: "17:45", passType: "QR" },
  { id: "5",  name: "Тихонов Роман Валерьевич",   object: "Тагул",   date: "22.04.2026", entryTime: "07:30", exitTime: "19:00", passType: "QR" },
  { id: "6",  name: "Громов Артём Игоревич",      object: "ВЧНГ",    date: "22.04.2026", entryTime: "08:05", exitTime: "18:05", passType: "QR" },
  { id: "7",  name: "Козлов Дмитрий Сергеевич",  object: "Дойтаги", date: "21.04.2026", entryTime: "08:15", exitTime: "17:40", passType: "QR" },
  { id: "8",  name: "Новикова Елена Игоревна",    object: "Тагул",   date: "21.04.2026", entryTime: "08:00", exitTime: "18:00", passType: "Карта" },
  { id: "9",  name: "Захарова Ольга Михайловна",  object: "ВСНК",    date: "21.04.2026", entryTime: "09:10", exitTime: "17:30", passType: "Карта" },
  { id: "10", name: "Иванов Алексей Петрович",    object: "Сузун",   date: "21.04.2026", entryTime: "07:50", exitTime: "18:25", passType: "QR" },
  { id: "11", name: "Орлова Марина Дмитриевна",   object: "ВСНК",    date: "20.04.2026", entryTime: "09:00", exitTime: "16:30", passType: "Карта" },
  { id: "12", name: "Фёдоров Павел Олегович",     object: "ВЧНГ",    date: "20.04.2026", entryTime: "07:55", exitTime: "18:15", passType: "QR" },
];

const ALL_EVENTS = [
  { icon: "LogIn",        color: "text-blue-400",    text: "Вход: Громов А.И. — ВЧНГ",                  time: "08:05" },
  { icon: "LogIn",        color: "text-blue-400",    text: "Вход: Тихонов Р.В. — Тагул",                time: "07:30" },
  { icon: "CheckCircle",  color: "text-emerald-500", text: "Заявка ЗАЯ-002 согласована",                time: "14:23" },
  { icon: "CreditCard",   color: "text-blue-500",    text: "Пропуск выдан: Смирнова А.В.",              time: "14:05" },
  { icon: "AlertCircle",  color: "text-amber-500",   text: "На доработку: ЗАЯ-005 — нет медосмотра",   time: "13:41" },
  { icon: "UserPlus",     color: "text-violet-500",  text: "Новая заявка: Громов А.И. — ВЧНГ",         time: "12:30" },
  { icon: "XCircle",      color: "text-red-500",     text: "Заявка ЗАЯ-003 отклонена СБ",              time: "11:18" },
  { icon: "LogOut",       color: "text-slate-400",   text: "Выход: Смирнова А.В. — ОБП",               time: "17:55" },
  { icon: "Clock",        color: "text-orange-400",  text: "Пропуск ЗАЯ-006 истёк — требует продления", time: "00:00" },
];

const OBJECT_STATS = [
  { name: "Сузун",   online: 34, total: 48, color: "bg-blue-500" },
  { name: "ВЧНГ",    online: 21, total: 30, color: "bg-violet-500" },
  { name: "Тагул",   online: 18, total: 27, color: "bg-emerald-500" },
  { name: "ОБП",     online: 15, total: 22, color: "bg-amber-500" },
  { name: "ВСНК",    online: 9,  total: 15, color: "bg-cyan-500" },
  { name: "Дойтаги", online: 4,  total: 6,  color: "bg-rose-500" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const STATUS_LABELS: Record<string, string> = {
  active: "Активен", pending: "На согласовании", rejected: "Отклонён", expired: "Истёк",
};
const STATUS_CLASS: Record<string, string> = {
  active: "status-active", pending: "status-pending", rejected: "status-rejected", expired: "status-expired",
};

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "dashboard", label: "Дашборд", icon: "LayoutDashboard" },
  { id: "requests", label: "Заявки", icon: "FileText", badge: 3 },
  { id: "approval", label: "Согласование", icon: "GitBranch" },
  { id: "journal", label: "Журнал проходов", icon: "BookOpen" },
  { id: "mobile", label: "Мобильный QR", icon: "Smartphone" },
];

function Sidebar({ active, onSelect }: { active: Section; onSelect: (s: Section) => void }) {
  return (
    <aside className="flex flex-col w-60 min-h-screen bg-[hsl(var(--sidebar-background))] px-3 py-5 gap-1 flex-shrink-0">
      <div className="px-3 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[hsl(var(--sidebar-primary))] flex items-center justify-center">
            <Icon name="Shield" size={16} className="text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none">PassControl</p>
            <p className="text-[hsl(var(--sidebar-foreground))] text-xs mt-0.5">Управление пропусками</p>
          </div>
        </div>
      </div>

      <p className="text-xs font-semibold text-[hsl(var(--sidebar-foreground))] px-3 mb-1 uppercase tracking-widest opacity-50">Разделы</p>

      {NAV_ITEMS.map(item => (
        <button
          key={item.id}
          onClick={() => onSelect(item.id as Section)}
          className={`sidebar-link w-full text-left ${active === item.id ? "active" : "text-[hsl(var(--sidebar-foreground))]"}`}
        >
          <Icon name={item.icon} size={17} />
          <span className="flex-1">{item.label}</span>
          {item.badge && (
            <span className="w-5 h-5 rounded-full bg-[hsl(var(--sidebar-primary))] text-white text-xs flex items-center justify-center">
              {item.badge}
            </span>
          )}
        </button>
      ))}

      <div className="mt-auto pt-4 border-t border-[hsl(var(--sidebar-border))]">
        <div className="flex items-center gap-2 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-[hsl(var(--sidebar-accent))] flex items-center justify-center text-sm font-bold text-white">
            АД
          </div>
          <div>
            <p className="text-white text-xs font-medium">Антонов Денис</p>
            <p className="text-[hsl(var(--sidebar-foreground))] text-xs opacity-60">Администратор</p>
          </div>
          <button className="ml-auto text-[hsl(var(--sidebar-foreground))] hover:text-white transition-colors">
            <Icon name="LogOut" size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}

// ─── Topbar ───────────────────────────────────────────────────────────────────
function Topbar({ title, search, onSearch }: { title: string; search: string; onSearch: (v: string) => void }) {
  return (
    <header className="h-14 border-b border-border bg-white flex items-center px-6 gap-4 flex-shrink-0">
      <h1 className="font-semibold text-base text-foreground flex-1">{title}</h1>
      <div className="relative">
        <Icon name="Search" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          value={search}
          onChange={e => onSearch(e.target.value)}
          placeholder="Быстрый поиск..."
          className="pl-8 pr-3 py-1.5 text-sm bg-muted rounded-lg border border-border outline-none focus:ring-2 focus:ring-primary/30 w-56 transition"
        />
      </div>
      <button className="relative p-2 rounded-lg hover:bg-muted transition">
        <Icon name="Bell" size={18} className="text-muted-foreground" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
      </button>
      <button className="relative p-2 rounded-lg hover:bg-muted transition">
        <Icon name="Mail" size={18} className="text-muted-foreground" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400" />
      </button>
    </header>
  );
}

// ─── StatCard ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, color, delta }: { label: string; value: string | number; icon: string; color: string; delta?: string }) {
  return (
    <div className="bg-white rounded-xl border border-border p-4 hover-lift animate-slide-up">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
          <Icon name={icon} size={20} className="text-white" />
        </div>
        {delta && <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{delta}</span>}
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
    </div>
  );
}

// ─── LiveFeed ─────────────────────────────────────────────────────────────────
function LiveFeed() {
  const [events, setEvents] = useState(ALL_EVENTS.slice(0, 6));
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const newEntries = [
      { icon: "LogIn",       color: "text-blue-400",   text: "Вход: Захарова О.М. — ВСНК",           time: "сейчас" },
      { icon: "CheckCircle", color: "text-emerald-500", text: "Заявка ЗАЯ-010 поступила на согласование", time: "сейчас" },
      { icon: "LogIn",       color: "text-blue-400",   text: "Вход: Тихонов Р.В. — Тагул",           time: "сейчас" },
      { icon: "CreditCard",  color: "text-blue-500",   text: "QR-пропуск активирован: Белов С.Н.",   time: "сейчас" },
    ];
    let idx = 0;
    const timer = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 600);
      setEvents(prev => [{ ...newEntries[idx % newEntries.length] }, ...prev.slice(0, 7)]);
      idx++;
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white rounded-xl border border-border p-4 animate-slide-up">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm text-foreground">Лента событий</h3>
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full bg-emerald-500 ${pulse ? "scale-125" : ""} transition-transform`} />
          <span className="text-xs text-emerald-600 font-medium">Live</span>
        </div>
      </div>
      <div className="space-y-2">
        {events.map((e, i) => (
          <div
            key={i}
            className={`flex items-center gap-3 text-sm py-1.5 px-2 rounded-lg transition-all ${i === 0 ? "bg-blue-50 border border-blue-100" : ""}`}
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <Icon name={e.icon} size={15} className={e.color} />
            <span className="flex-1 text-foreground text-xs">{e.text}</span>
            <span className={`text-xs font-medium ${e.time === "сейчас" ? "text-blue-500" : "text-muted-foreground"}`}>{e.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard() {
  const [onlineCount, setOnlineCount] = useState(101);

  useEffect(() => {
    const timer = setInterval(() => {
      setOnlineCount(n => n + (Math.random() > 0.5 ? 1 : -1));
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Активных пропусков" value={312} icon="CreditCard" color="bg-blue-600" delta="+18 за месяц" />
        <StatCard label="На согласовании" value={24} icon="Clock" color="bg-amber-500" delta="3 срочных" />
        <StatCard label="Просроченных" value={7} icon="AlertTriangle" color="bg-red-500" />
        <div className="bg-white rounded-xl border border-border p-4 hover-lift animate-slide-up">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center relative">
              <Icon name="Users" size={20} className="text-white" />
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 animate-ping opacity-75" />
            </div>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">онлайн</span>
          </div>
          <p className="text-2xl font-bold text-foreground tabular-nums">{onlineCount}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Сейчас на объектах</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 bg-white rounded-xl border border-border p-4 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm text-foreground">Проходы по дням — апрель 2026</h3>
            <span className="text-xs text-muted-foreground">все объекты</span>
          </div>
          <div className="flex items-end gap-1.5 h-28">
            {[
              { v: 87, d: "1" }, { v: 91, d: "2" }, { v: 78, d: "3" }, { v: 94, d: "4" }, { v: 0, d: "5" },
              { v: 0, d: "6" }, { v: 102, d: "7" }, { v: 98, d: "8" }, { v: 105, d: "9" }, { v: 110, d: "10" },
              { v: 99, d: "11" }, { v: 0, d: "12" }, { v: 0, d: "13" }, { v: 118, d: "14" }, { v: 121, d: "15" },
              { v: 109, d: "16" }, { v: 115, d: "17" }, { v: 124, d: "18" }, { v: 0, d: "19" }, { v: 0, d: "20" },
              { v: 119, d: "21" }, { v: 101, d: "22", today: true },
            ].map((item, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                {item.v > 0 && (
                  <span className={`text-xs font-semibold ${item.today ? "text-primary" : "text-transparent group-hover:text-muted-foreground"}`}>
                    {item.today ? item.v : ""}
                  </span>
                )}
                <div
                  className={`w-full rounded-t transition-all ${item.today ? "bg-primary" : item.v === 0 ? "bg-muted/30" : "bg-primary/25 hover:bg-primary/50"}`}
                  style={{ height: item.v > 0 ? `${(item.v / 124) * 100}%` : "6px" }}
                />
                <span className={`text-xs ${item.today ? "text-primary font-bold" : "text-muted-foreground"}`}>{item.d}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-4 text-xs text-muted-foreground border-t border-border pt-2">
            <span>Всего за апрель: <b className="text-foreground">2 071</b></span>
            <span>Ср./день: <b className="text-foreground">103</b></span>
            <span>Макс.: <b className="text-foreground">124</b> (15.04)</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border p-4 animate-slide-up">
          <h3 className="font-semibold text-sm text-foreground mb-3">Онлайн по объектам</h3>
          <div className="space-y-3">
            {OBJECT_STATS.map((obj, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-foreground">{obj.name}</span>
                  <span className="text-xs text-muted-foreground">{obj.online}/{obj.total}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${obj.color} transition-all`}
                    style={{ width: `${(obj.online / obj.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-2 border-t border-border flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Итого онлайн</span>
            <span className="font-bold text-foreground">{OBJECT_STATS.reduce((a, o) => a + o.online, 0)} чел.</span>
          </div>
        </div>
      </div>

      <LiveFeed />
    </div>
  );
}

// ─── Requests ─────────────────────────────────────────────────────────────────
function Requests({ search }: { search: string }) {
  const [selected, setSelected] = useState<Application | null>(null);
  const [tab, setTab] = useState<"docs" | "history" | "comments">("docs");
  const [filter, setFilter] = useState<"all" | "pending" | "active" | "rejected" | "expired">("all");

  const filtered = APPLICATIONS.filter(a => {
    const matchStatus = filter === "all" || a.status === filter;
    const matchSearch = !search || a.name.toLowerCase().includes(search.toLowerCase()) || a.id.includes(search);
    return matchStatus && matchSearch;
  });

  return (
    <div className="p-6 flex gap-5 h-full animate-fade-in">
      <div className="flex-1 min-w-0">
        <div className="flex gap-2 mb-4 flex-wrap">
          {(["all", "pending", "active", "rejected", "expired"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${filter === f ? "bg-primary text-white border-primary" : "bg-white border-border text-muted-foreground hover:border-primary/40"}`}
            >
              {f === "all" ? "Все" : STATUS_LABELS[f]}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">№ Заявки</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Сотрудник</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Объект</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Статус</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Действует до</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Тип</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(app => (
                <tr
                  key={app.id}
                  onClick={() => setSelected(app)}
                  className={`border-b border-border cursor-pointer transition-colors hover:bg-muted/30 ${selected?.id === app.id ? "bg-primary/5" : ""}`}
                >
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{app.id}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-foreground">{app.name}</div>
                    <div className="text-xs text-muted-foreground">{app.position}</div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{app.object}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_CLASS[app.status]}`}>
                      {STATUS_LABELS[app.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{app.validUntil}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{app.passType}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-10 text-muted-foreground text-sm">Заявки не найдены</div>
          )}
        </div>
      </div>

      {selected && (
        <div className="w-80 flex-shrink-0 bg-white rounded-xl border border-border flex flex-col animate-scale-in overflow-hidden">
          <div className="bg-gradient-to-br from-primary to-blue-700 p-5 text-white">
            <button onClick={() => setSelected(null)} className="float-right opacity-70 hover:opacity-100 transition">
              <Icon name="X" size={16} />
            </button>
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold mb-3">
              {selected.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
            </div>
            <p className="font-bold text-base leading-tight">{selected.name}</p>
            <p className="text-white/70 text-xs mt-0.5">{selected.position}</p>
            <div className="mt-2 flex gap-2 flex-wrap">
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{selected.object}</span>
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{selected.passType}</span>
            </div>
          </div>

          <div className="flex border-b border-border">
            {(["docs", "history", "comments"] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-2 text-xs font-medium transition-colors ${tab === t ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}
              >
                {t === "docs" ? "Документы" : t === "history" ? "История" : "Комментарии"}
              </button>
            ))}
          </div>

          <div className="flex-1 p-4 overflow-auto">
            {tab === "docs" && (
              <div className="space-y-2">
                {["Паспорт (скан).pdf", "Допуск СРО.pdf", "Медосмотр.jpg", "Инструктаж ТБ.pdf"].map(doc => (
                  <div key={doc} className="flex items-center gap-2 p-2 rounded-lg border border-border hover:bg-muted/40 cursor-pointer transition">
                    <Icon name="FileText" size={14} className="text-primary" />
                    <span className="text-xs text-foreground flex-1">{doc}</span>
                    <Icon name="Download" size={13} className="text-muted-foreground" />
                  </div>
                ))}
              </div>
            )}
            {tab === "history" && (
              <div className="space-y-3 text-xs">
                {[
                  { step: "Подача заявки", user: "Козлов Д.С.", time: "18.04 12:00", done: true },
                  { step: "Проверка HR", user: "Миронова И.А.", time: "18.04 15:30", done: true },
                  { step: "Согласование СБ", user: "ожидание", time: "—", done: false },
                ].map((h, i) => (
                  <div key={i} className="flex gap-2">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${h.done ? "bg-emerald-100" : "bg-muted"}`}>
                      <Icon name={h.done ? "Check" : "Clock"} size={11} className={h.done ? "text-emerald-600" : "text-muted-foreground"} />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{h.step}</p>
                      <p className="text-muted-foreground">{h.user} · {h.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {tab === "comments" && (
              <div className="text-xs text-muted-foreground text-center py-6">Комментариев нет</div>
            )}
          </div>

          {selected.status === "pending" && (
            <div className="p-3 border-t border-border flex gap-2">
              <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs py-2 rounded-lg font-medium transition">Согласовать</button>
              <button className="flex-1 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs py-2 rounded-lg font-medium border border-amber-200 transition">На доработку</button>
              <button className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 text-xs py-2 rounded-lg font-medium border border-red-200 transition">Отклонить</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Approval ─────────────────────────────────────────────────────────────────
const APPROVAL_STEPS = [
  { label: "HR", icon: "Users", done: true },
  { label: "СБ", icon: "Shield", done: true },
  { label: "Заказчик", icon: "Building2", done: false, current: true },
  { label: "Логист", icon: "Truck", done: false },
];

function Approval() {
  const [medical, setMedical] = useState(false);
  const [briefing, setBriefing] = useState(false);
  const [docs, setDocs] = useState(false);

  return (
    <div className="p-6 animate-fade-in max-w-2xl">
      <div className="bg-white rounded-xl border border-border p-5 mb-5">
        <h3 className="font-semibold text-sm mb-4 text-foreground">Маршрут согласования — ЗАЯ-001</h3>
        <div className="flex items-center">
          {APPROVAL_STEPS.map((step, i) => (
            <div key={i} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={`w-11 h-11 rounded-full flex items-center justify-center border-2 transition-all ${step.done ? "bg-emerald-500 border-emerald-500" : step.current ? "bg-white border-primary shadow-lg shadow-primary/20" : "bg-muted border-border"}`}>
                  {step.done ? (
                    <Icon name="Check" size={18} className="text-white" />
                  ) : (
                    <Icon name={step.icon} size={16} className={step.current ? "text-primary" : "text-muted-foreground"} />
                  )}
                </div>
                <p className={`text-xs mt-1.5 font-medium ${step.current ? "text-primary" : step.done ? "text-emerald-600" : "text-muted-foreground"}`}>{step.label}</p>
              </div>
              {i < APPROVAL_STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-1 mb-4 ${step.done ? "bg-emerald-400" : "bg-border"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border p-5">
        <h3 className="font-semibold text-sm mb-1 text-foreground">Окно согласования</h3>
        <p className="text-xs text-muted-foreground mb-4">Иванов Алексей Петрович — Объект А-12</p>

        <div className="space-y-3 mb-5">
          {[
            { label: "Медосмотр пройден", val: medical, set: setMedical },
            { label: "Инструктаж ТБ проведён", val: briefing, set: setBriefing },
            { label: "Документы проверены", val: docs, set: setDocs },
          ].map(({ label, val, set }, i) => (
            <label key={i} className="flex items-center gap-3 cursor-pointer group">
              <div
                onClick={() => set(!val)}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${val ? "bg-primary border-primary" : "border-border hover:border-primary/50"}`}
              >
                {val && <Icon name="Check" size={12} className="text-white" />}
              </div>
              <span className="text-sm text-foreground group-hover:text-primary transition-colors">{label}</span>
            </label>
          ))}
        </div>

        <textarea
          placeholder="Комментарий к решению..."
          className="w-full border border-border rounded-lg p-3 text-sm resize-none h-20 outline-none focus:ring-2 focus:ring-primary/30 transition"
        />

        <div className="flex gap-2 mt-3">
          <button className="flex-1 bg-primary hover:bg-primary/90 text-white text-sm py-2.5 rounded-lg font-medium transition">
            Одобрить
          </button>
          <button className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 text-sm py-2.5 rounded-lg font-medium border border-red-200 transition">
            Отклонить
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Journal ──────────────────────────────────────────────────────────────────
function Journal({ search }: { search: string }) {
  const filtered = JOURNAL.filter(j =>
    !search || j.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Входов сегодня", value: 89, icon: "LogIn", color: "bg-blue-600" },
          { label: "Сейчас на объекте", value: 61, icon: "Users", color: "bg-emerald-600" },
          { label: "Нарушений сегодня", value: 2, icon: "AlertTriangle", color: "bg-red-500" },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-xl border border-border p-4 hover-lift animate-slide-up flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center`}>
              <Icon name={s.icon} size={18} className="text-white" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden animate-slide-up">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <h3 className="font-semibold text-sm text-foreground">Журнал проходов</h3>
          <button className="text-xs text-primary flex items-center gap-1 hover:underline">
            <Icon name="Download" size={13} /> Экспорт
          </button>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">Дата</th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">Сотрудник</th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">Объект</th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">Вход</th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">Выход</th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">Тип</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(j => (
              <tr key={j.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3 text-xs text-muted-foreground">{j.date}</td>
                <td className="px-4 py-3 font-medium text-foreground text-sm">{j.name}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{j.object}</td>
                <td className="px-4 py-3">
                  <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">{j.entryTime}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs font-mono text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">{j.exitTime}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{j.passType}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Mobile QR ────────────────────────────────────────────────────────────────
function MobileQR() {
  return (
    <div className="p-6 animate-fade-in flex gap-8 items-start">
      <div className="flex-1 flex justify-center">
        <div className="bg-slate-900 rounded-[2rem] p-3 shadow-2xl shadow-slate-900/40 w-64">
          <div className="bg-white rounded-[1.5rem] overflow-hidden">
            <div className="bg-gradient-to-br from-primary to-blue-800 px-4 pt-8 pb-4 text-white text-center">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mx-auto mb-2">
                <Icon name="Shield" size={20} className="text-white" />
              </div>
              <p className="font-bold text-sm">PassControl</p>
              <p className="text-white/70 text-xs">Добро пожаловать</p>
            </div>

            <div className="p-4 space-y-2.5">
              <button className="w-full bg-primary text-white text-xs py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2">
                <Icon name="PlusCircle" size={14} /> Создать заявку
              </button>
              <button className="w-full bg-muted text-foreground text-xs py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 border border-border">
                <Icon name="CreditCard" size={14} /> Мои пропуска
              </button>
              <button className="w-full bg-muted text-foreground text-xs py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 border border-border">
                <Icon name="Bell" size={14} /> Уведомления
              </button>

              <div className="mt-3 bg-blue-50 border border-blue-100 rounded-xl p-3 text-center">
                <div className="w-28 h-28 mx-auto mb-2 bg-white border border-border rounded-lg flex items-center justify-center">
                  <div className="grid grid-cols-5 grid-rows-5 gap-px w-20 h-20">
                    {[1,1,1,1,1, 1,0,0,0,1, 1,0,1,0,1, 1,0,0,0,1, 1,1,1,1,1].map((v,i) => (
                      <div key={i} className={`rounded-sm ${v ? "bg-slate-900" : "bg-transparent"}`} />
                    ))}
                  </div>
                </div>
                <p className="text-xs font-bold text-foreground">Иванов А.П.</p>
                <p className="text-xs text-muted-foreground">Объект А-12</p>
                <p className="text-xs text-muted-foreground">До: 30.06.2026</p>
                <div className="flex gap-1.5 mt-2 justify-center">
                  <button className="text-xs bg-primary text-white px-2 py-1 rounded-lg font-medium">Продлить</button>
                  <button className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-lg border border-border">Проблема</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-4">
        <div className="bg-white rounded-xl border border-border p-4">
          <h4 className="font-semibold text-sm mb-3 text-foreground">Возможности мобильного приложения</h4>
          <div className="space-y-3">
            {[
              { icon: "QrCode", title: "QR-пропуск", desc: "Цифровой пропуск всегда под рукой. Обновляется автоматически." },
              { icon: "PlusCircle", title: "Создание заявок", desc: "Новая заявка в два касания — фото, паспорт, подпись." },
              { icon: "Bell", title: "Push-уведомления", desc: "Мгновенное оповещение о статусе согласования." },
              { icon: "Clock", title: "Напоминания", desc: "Предупреждение об истечении срока действия пропуска." },
            ].map((f, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon name={f.icon} size={15} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{f.title}</p>
                  <p className="text-xs text-muted-foreground">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
const SECTION_TITLES: Record<Section, string> = {
  dashboard: "Главный дашборд",
  requests: "Заявки на пропуска",
  approval: "Согласование",
  journal: "Журнал проходов",
  mobile: "Мобильная версия / QR",
};

export default function Index() {
  const [section, setSection] = useState<Section>("dashboard");
  const [search, setSearch] = useState("");

  return (
    <div className="flex h-screen overflow-hidden bg-background font-sans">
      <Sidebar active={section} onSelect={s => { setSection(s); setSearch(""); }} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar title={SECTION_TITLES[section]} search={search} onSearch={setSearch} />
        <main className="flex-1 overflow-auto">
          {section === "dashboard" && <Dashboard />}
          {section === "requests" && <Requests search={search} />}
          {section === "approval" && <Approval />}
          {section === "journal" && <Journal search={search} />}
          {section === "mobile" && <MobileQR />}
        </main>
      </div>
    </div>
  );
}