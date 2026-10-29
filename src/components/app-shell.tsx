"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  BookOpen,
  CalendarDays,
  ChartNoAxesCombined,
  ChevronRight,
  Code2,
  Compass,
  House,
  Layers,
  Menu,
  MessageCircle,
  Moon,
  Settings as SettingsIcon,
  Sun,
  X,
} from "lucide-react";
import { useLearning } from "./provider";
import { Onboarding } from "./onboarding";
import { Dashboard, CalendarView, Roadmap } from "./overview";
import { Vocabulary, Speaking, ReadingView } from "./practice";
import { Settings, Resources, Progress } from "./settings-progress";
import { LessonView } from "./lesson-view";
import { lessons } from "@/data/course";
import { Button } from "./ui/button";
const nav = [
  { path: "/", label: "Tổng quan", icon: House },
  { path: "/calendar", label: "Lịch học", icon: CalendarDays },
  { path: "/roadmap", label: "Lộ trình", icon: Compass },
  { path: "/vocabulary", label: "Từ vựng", icon: Layers },
  { path: "/speaking", label: "Luyện nói", icon: MessageCircle },
  { path: "/reading", label: "Đọc IT", icon: Code2 },
  { path: "/progress", label: "Tiến độ", icon: ChartNoAxesCombined },
  { path: "/resources", label: "Tài nguyên", icon: BookOpen },
  { path: "/settings", label: "Cài đặt", icon: SettingsIcon },
];
function Shell() {
  const { data, update, saving } = useLearning(),
    path = usePathname(),
    [mobile, setMobile] = useState(false);
  const sidebar = useRef<HTMLElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    if (mobile) document.body.style.overflow = "hidden";
    if (mobile) {
      sidebar.current?.querySelector<HTMLAnchorElement>("a")?.focus();
      wasOpen.current = true;
    } else if (wasOpen.current) {
      menuButton.current?.focus();
      wasOpen.current = false;
    }
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobile]);
  if (!data.settings.onboarded) return <Onboarding />;
  const item = nav.find((n) => n.path === path),
    lesson = lessons.find((l) => path === `/lesson/${l.id}`);
  let content;
  if (lesson) content = <LessonView key={lesson.id} lesson={lesson} />;
  else
    switch (path) {
      case "/":
        content = <Dashboard />;
        break;
      case "/calendar":
        content = <CalendarView />;
        break;
      case "/roadmap":
        content = <Roadmap />;
        break;
      case "/vocabulary":
        content = <Vocabulary />;
        break;
      case "/speaking":
        content = <Speaking />;
        break;
      case "/reading":
        content = <ReadingView />;
        break;
      case "/progress":
        content = <Progress />;
        break;
      case "/resources":
        content = <Resources />;
        break;
      case "/settings":
        content = <Settings />;
        break;
      default:
        content = (
          <div className="card empty">
            <h1>Không tìm thấy trang</h1>
            <Link className="text-link" href="/">
              Về tổng quan
            </Link>
          </div>
        );
    }
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">
        Đến nội dung chính
      </a>
      {mobile && (
        <button
          className="mobile-overlay"
          aria-label="Đóng menu"
          onClick={() => setMobile(false)}
        />
      )}
      <aside
        ref={sidebar}
        id="sidebar"
        className={`sidebar ${mobile ? "open" : ""}`}
        role={mobile ? "dialog" : undefined}
        aria-modal={mobile || undefined}
        aria-label="Điều hướng"
        onKeyDown={(e) => {
          if (!mobile) return;
          if (e.key === "Escape") {
            setMobile(false);
            return;
          }
          if (e.key !== "Tab") return;
          const nodes =
            sidebar.current?.querySelectorAll<HTMLElement>("a,button");
          if (!nodes?.length) return;
          const first = nodes[0],
            last = nodes[nodes.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }}
      >
        <Link href="/" className="brand" onClick={() => setMobile(false)}>
          <span className="brand-mark">
            D<span>e</span>
          </span>
          <span>
            DevEnglish<small>LEARN. BUILD. CONNECT.</small>
          </span>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="mobile-close"
          aria-label="Đóng điều hướng"
          onClick={() => setMobile(false)}
        >
          <X size={18} />
        </Button>
        <p className="nav-label">KHÔNG GIAN HỌC</p>
        <nav aria-label="Điều hướng chính">
          {nav.map((n) => (
            <Link
              key={n.path}
              href={n.path}
              aria-current={path === n.path ? "page" : undefined}
              className={path === n.path ? "active" : ""}
              onClick={() => setMobile(false)}
            >
              <n.icon size={19} />
              {n.label}
              {path === n.path && <span className="nav-dot" />}
            </Link>
          ))}
        </nav>
        <div className="sidebar-note">
          <span className="eyebrow">TỪNG BƯỚC MỘT</span>
          <p>
            Đừng chỉ học tiếng Anh.
            <br />
            Hãy dùng nó mỗi ngày.
          </p>
          <span className="note-line" />
        </div>
        <Link href="/settings" className="profile">
          <span className="avatar">
            {data.settings.name.slice(0, 1).toUpperCase()}
          </span>
          <span>
            <strong>{data.settings.name}</strong>
            <small>Lộ trình cá nhân</small>
          </span>
          <ChevronRight size={16} />
        </Link>
      </aside>
      <div className="main-shell" inert={mobile}>
        <header className="topbar">
          <div className="actions">
            <Button
              variant="ghost"
              size="icon"
              className="mobile-menu"
              ref={menuButton}
              aria-controls="sidebar"
              aria-label="Mở menu điều hướng"
              aria-expanded={mobile}
              onClick={() => setMobile(!mobile)}
            >
              <Menu size={21} />
            </Button>
            <span className="breadcrumb">
              Không gian học <ChevronRight size={13} />
              <strong>{item?.label || (lesson ? "Bài học" : "Trang")}</strong>
            </span>
          </div>
          <div className="actions">
            <span className="local-status">
              <i />
              {saving ? "Đang lưu…" : "Lưu trên thiết bị"}
            </span>
            <Button
              variant="ghost"
              size="icon"
              aria-label={
                data.settings.theme === "light"
                  ? "Bật giao diện tối"
                  : "Bật giao diện sáng"
              }
              onClick={() =>
                update((d) => ({
                  ...d,
                  settings: {
                    ...d.settings,
                    theme: d.settings.theme === "light" ? "dark" : "light",
                  },
                }))
              }
            >
              {data.settings.theme === "light" ? (
                <Moon size={18} />
              ) : (
                <Sun size={18} />
              )}
            </Button>
            <span className="avatar small-avatar">
              {data.settings.name.slice(0, 1).toUpperCase()}
            </span>
          </div>
        </header>
        <main id="main" className="main-content" key={path}>
          {content}
        </main>
        <footer className="app-footer">
          <span>DevEnglish · Học để sử dụng.</span>
          <span>Dữ liệu cá nhân được lưu trong trình duyệt này.</span>
        </footer>
      </div>
    </div>
  );
}
export function AppShell() {
  return <Shell />;
}
