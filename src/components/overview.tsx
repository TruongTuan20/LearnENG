"use client";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Flame,
  Layers,
  Target,
} from "lucide-react";
import { useLearning } from "./provider";
import { Button } from "./ui/button";
import { addDays, statistics, reschedule } from "@/lib/learning";
import { lessons, publishedLessons, weeks } from "@/data/course";
const labels = ["CN", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
export const dateLabel = (v: string) =>
  new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit" }).format(
    new Date(`${v}T12:00:00`),
  );
function useStats() {
  const { data, today } = useLearning();
  return statistics(data, today);
}
export function Dashboard() {
  const { data, today } = useLearning(),
    stats = useStats();
  const next =
    publishedLessons.find((l) => !data.progress[l.id]?.completedAt) ||
    publishedLessons[0];
  const finished = Object.values(data.progress).filter(
    (p) => p.completedAt && p.completedAt >= stats.monday,
  ).length;
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">MỖI NGÀY, TIẾN THÊM MỘT CHÚT</span>
          <h1>Chào {data.settings.name}, cùng học nhé.</h1>
          <p className="muted">
            Không cần hoàn hảo. Chỉ cần thêm một lần bạn dùng được tiếng Anh.
          </p>
        </div>
        <span className="date-chip">
          <CalendarDays size={16} />
          {dateLabel(today)} · {data.settings.timezone}
        </span>
      </div>
      <div className="dashboard-top">
        <section className="next-lesson">
          <div className="next-copy">
            <span className="eyebrow">BÀI HỌC TIẾP THEO</span>
            <span className="hero-week">
              Tuần {next.week} · Buổi {next.day}
            </span>
            <h2>{next.title}</h2>
            <p>{next.objectives[0]}</p>
            <div className="hero-meta">
              <span>
                <Clock size={15} />
                {data.settings.duration} phút
              </span>
              <span>
                <BookOpen size={15} />
                {next.skill}
              </span>
            </div>
            <Button asChild>
              <Link href={`/lesson/${next.id}`}>
                Tiếp tục học
                <ArrowRight size={17} />
              </Link>
            </Button>
          </div>
          <div className="hero-illustration" aria-hidden="true">
            <div className="code-window">
              <div className="window-dots">
                <i />
                <i />
                <i />
              </div>
              <span className="code-comment">
                // a little progress, every day
              </span>
              <p>
                <span>const</span> nextStep = {"{"}
              </p>
              <p>
                &nbsp; confidence: <b>"growing"</b>,
              </p>
              <p>
                &nbsp; practice: <b>"daily"</b>
              </p>
              <p>{"};"}</p>
              <div className="speech-bubble">
                “I work as a developer.”
                <Check size={16} />
              </div>
            </div>
            <span className="floating-label">English, in your own words.</span>
          </div>
        </section>
        <section className="card weekly-goal">
          <div className="icon-tile">
            <Target size={21} />
          </div>
          <h3>Mục tiêu tuần này</h3>
          <strong>
            {finished}
            <span> / {data.settings.days.length} buổi</span>
          </strong>
          <progress
            value={Math.min(finished, data.settings.days.length)}
            max={data.settings.days.length}
          />
          <p className="muted">
            {Math.floor(stats.weeklySeconds / 60)} /{" "}
            {data.settings.days.length * data.settings.duration} phút thực học
          </p>
          <p className="small">
            {finished
              ? "Giữ nhịp học vừa sức với lịch của bạn."
              : "Bắt đầu buổi đầu tiên. Thành tích sẽ được ghi từ hoạt động thật."}
          </p>
          <Link className="text-link" href="/calendar">
            Xem lịch của tôi <ArrowRight size={15} />
          </Link>
        </section>
      </div>
      <div className="stats-grid">
        {[
          {
            icon: BookOpen,
            label: "Bài đã hoàn thành",
            value: `${stats.completed} / ${publishedLessons.length}`,
            note: "bài đã phát hành · 120 buổi toàn lộ trình",
          },
          {
            icon: Clock,
            label: "Thời gian thực học",
            value: Math.floor(stats.seconds / 60),
            note: "phút đã lưu từ timer chủ động",
          },
          {
            icon: Flame,
            label: "Nhịp học liên tiếp",
            value: stats.streak,
            note: "ngày có hoạt động được lưu",
          },
          {
            icon: Layers,
            label: "Cụm từ đến hạn",
            value: stats.due,
            note: "thẻ cần ôn hôm nay",
          },
        ].map((m) => (
          <div className="card stat" key={m.label}>
            <div className="stat-label">
              <span>{m.label}</span>
              <m.icon size={18} />
            </div>
            <strong>{m.value}</strong>
            <small>{m.note}</small>
          </div>
        ))}
      </div>
      <div className="dashboard-bottom">
        <section className="card">
          <div className="section-heading">
            <div>
              <span className="eyebrow">NHỊP HỌC CỦA BẠN</span>
              <h2>Tuần này</h2>
            </div>
            <Link className="text-link" href="/calendar">
              Xem lịch
              <ArrowRight size={15} />
            </Link>
          </div>
          <WeekStrip start={stats.monday} />
        </section>
        <section className="card">
          <div className="section-heading">
            <h2>Góc thực hành</h2>
            <span className="badge">Tình huống thật</span>
          </div>
          <Link className="practice-link" href="/speaking">
            <span className="icon-tile">Aa</span>
            <div>
              <strong>Nói điều bạn cần nói</strong>
              <p>12 tình huống từ small talk đến code review</p>
            </div>
            <ArrowRight size={18} />
          </Link>
          <Link className="practice-link" href="/reading">
            <span className="icon-tile code">{"</>"}</span>
            <div>
              <strong>Đọc hiểu, rồi áp dụng</strong>
              <p>8 bài đọc IT nguyên bản, có giải thích</p>
            </div>
            <ArrowRight size={18} />
          </Link>
          <Link className="practice-link" href="/vocabulary">
            <span className="icon-tile green">
              <Layers size={20} />
            </span>
            <div>
              <strong>Cụm từ bạn đã chọn</strong>
              <p>
                {data.cards.length
                  ? `${stats.due} thẻ đến hạn / ${data.cards.length} thẻ đã lưu`
                  : "Lưu cụm từ trong bài để bắt đầu ôn"}
              </p>
            </div>
            <ArrowRight size={18} />
          </Link>
        </section>
      </div>
      <section className="card">
        <div className="section-heading">
          <h2>Kết quả gần nhất</h2>
          <Link href="/progress" className="text-link">
            Xem tiến độ
            <ArrowRight size={15} />
          </Link>
        </div>
        {stats.completed ? (
          <p>
            Bài gần nhất:{" "}
            {
              lessons.find(
                (l) =>
                  l.id ===
                  Object.values(data.progress)
                    .filter((p) => p.completedAt)
                    .sort((a, b) =>
                      b.completedAt!.localeCompare(a.completedAt!),
                    )[0]?.lessonId,
              )?.title
            }
          </p>
        ) : data.assessments.length ? (
          <p>
            Kiểm tra đầu vào: {data.assessments.at(-1)?.score}/
            {data.assessments.at(-1)?.total} câu có đáp án. Chưa có bài học hoàn
            thành.
          </p>
        ) : (
          <p className="muted">
            Chưa có kết quả. Bài đầu tiên là nơi tốt để bắt đầu.
          </p>
        )}
      </section>
    </>
  );
}
export function WeekStrip({ start }: { start: string }) {
  const { data, today } = useLearning();
  return (
    <div className="week-strip">
      {Array.from({ length: 7 }, (_, i) => {
        const date = addDays(start, i),
          entry = data.schedule.find((e) => e.date === date),
          lesson = lessons.find((l) => l.id === entry?.lessonId),
          completed = entry && data.progress[entry.lessonId]?.completedAt;
        return (
          <div
            key={date}
            className={`week-day ${date === today ? "today" : ""} ${completed ? "done" : ""}`}
          >
            <span className="muted">{labels[(i + 1) % 7]}</span>
            <strong>{dateLabel(date)}</strong>
            {lesson ? (
              <Link href={`/lesson/${lesson.id}`} title={lesson.title}>
                <span className="day-status">
                  {completed ? <Check size={14} /> : <BookOpen size={14} />}
                </span>
                <small>Buổi {lesson.day}</small>
                {!lesson.published && <small>Đề cương</small>}
              </Link>
            ) : (
              <small className="rest-day">Nghỉ / tự ôn</small>
            )}
          </div>
        );
      })}
    </div>
  );
}
export function CalendarView() {
  const { data, today, update } = useLearning(),
    stats = useStats(),
    [offset, setOffset] = useState(0),
    [view, setView] = useState("week"),
    [from, setFrom] = useState(today),
    [to, setTo] = useState(today),
    [message, setMessage] = useState("");
  const start = addDays(stats.monday, offset * 7),
    end = addDays(start, 6);
  return (
    <>
      <PageHeading
        eyebrow="LỊCH CÁ NHÂN"
        title="Một nhịp học vừa sức"
        description="Học trước, học bù hoặc dời lịch. Kết quả đã học luôn được giữ lại."
      />
      <section className="card">
        <div className="section-heading">
          <div className="actions">
            <Button
              variant="outline"
              size="icon"
              aria-label="Tuần trước"
              onClick={() => setOffset(offset - 1)}
            >
              <ChevronLeft size={17} />
            </Button>
            <h2>
              {dateLabel(start)} – {dateLabel(end)}
            </h2>
            <Button
              variant="outline"
              size="icon"
              aria-label="Tuần sau"
              onClick={() => setOffset(offset + 1)}
            >
              <ChevronRight size={17} />
            </Button>
          </div>
          <div className="actions">
            <Button variant="ghost" onClick={() => setOffset(0)}>
              Hôm nay
            </Button>
            <Button
              variant="outline"
              onClick={() => setView(view === "week" ? "list" : "week")}
            >
              {view === "week" ? "Danh sách" : "Xem tuần"}
            </Button>
          </div>
        </div>
        {view === "week" && <WeekStrip start={start} />}
        <div className="schedule-list">
          {data.schedule
            .filter((e) => e.date >= start && e.date <= end)
            .sort((a, b) => a.date.localeCompare(b.date))
            .map((e) => {
              const l = lessons.find((x) => x.id === e.lessonId);
              if (!l) return null;
              const p = data.progress[l.id],
                status = p?.completedAt
                  ? "Hoàn thành"
                  : p?.activities.length
                    ? "Đang học"
                    : e.date < today
                      ? "Bỏ lỡ"
                      : "Chưa học";
              return (
                <Link
                  className="schedule-row"
                  key={e.id}
                  href={`/lesson/${l.id}`}
                >
                  <span className="schedule-date">{dateLabel(e.date)}</span>
                  <div>
                    <strong>{l.title}</strong>
                    <p>
                      Tuần {l.week} · Buổi {l.day} ·{" "}
                      {l.published
                        ? `${data.settings.duration} phút`
                        : "Đề cương"}
                    </p>
                  </div>
                  <span className={`badge ${p?.completedAt ? "green" : ""}`}>
                    {status}
                  </span>
                  <ArrowRight size={16} />
                </Link>
              );
            })}
          {!data.schedule.some((e) => e.date >= start && e.date <= end) && (
            <p className="empty">
              Tuần này chưa có buổi được lên lịch. Bạn có thể mở Lộ trình để học
              trước.
            </p>
          )}
        </div>
      </section>
      <section className="card">
        <h2>Dời những buổi chưa hoàn thành</h2>
        <p className="muted">
          Chỉ dời từ mốc được chọn, theo những thứ đã cài đặt. Các buổi hoàn
          thành và lịch sử được giữ nguyên; ngày đã có buổi cố định sẽ được bỏ
          qua.
        </p>
        <form
          className="actions"
          onSubmit={(e) => {
            e.preventDefault();
            update((d) => ({
              ...d,
              schedule: reschedule(d, from, to, d.settings.days),
            }));
            setMessage("Đã dời lịch và giữ kết quả học.");
          }}
        >
          <label className="field">
            Các buổi từ ngày
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              required
            />
          </label>
          <label className="field">
            Bắt đầu lịch mới
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              required
            />
          </label>
          <Button type="submit">Dời lịch</Button>
        </form>
        <p role="status">{message}</p>
      </section>
    </>
  );
}
export function Roadmap() {
  const { data } = useLearning();
  return (
    <>
      <PageHeading
        eyebrow="24 TUẦN · 3 GIAI ĐOẠN"
        title="Từ câu đầu tiên đến cuộc trao đổi thực tế"
        description="35 bài đầy đủ đã phát hành. 85 buổi còn lại là đề cương và chưa tính là bài sẵn sàng."
      />
      {weeks.map((w) => (
        <section className="card week-card" key={w.id}>
          {[1, 5, 13].includes(w.number) && (
            <p className="phase-label">
              GIAI ĐOẠN{" "}
              {w.number === 1
                ? "1 · KHÔI PHỤC NỀN TẢNG"
                : w.number === 5
                  ? "2 · GIAO TIẾP & ĐỌC CƠ BẢN"
                  : "3 · TIẾNG ANH CÔNG VIỆC"}
            </p>
          )}
          <div className="section-heading">
            <div className="week-title">
              <span className="week-number">
                {String(w.number).padStart(2, "0")}
              </span>
              <div>
                <h2>{w.title}</h2>
                <p className="muted">{w.goal}</p>
              </div>
            </div>
            <span className="badge">
              {w.lessons.filter((l) => data.progress[l.id]?.completedAt).length}
              /5
            </span>
          </div>
          <div className="roadmap-lessons">
            {w.lessons.map((l) => (
              <Link href={`/lesson/${l.id}`} key={l.id}>
                <span
                  className={`lesson-number ${data.progress[l.id]?.completedAt ? "done" : ""}`}
                >
                  {data.progress[l.id]?.completedAt ? (
                    <Check size={16} />
                  ) : (
                    l.day
                  )}
                </span>
                <div>
                  <strong>{l.title}</strong>
                  <small>{l.skill}</small>
                </div>
                <span className={`badge ${l.published ? "blue" : ""}`}>
                  {l.published ? "Sẵn sàng" : "Đề cương"}
                </span>
                <ArrowRight size={15} />
              </Link>
            ))}
          </div>
          <p className="small muted">Đầu ra: {w.output}</p>
          {w.number % 4 === 0 && (
            <p className="callout">
              Mốc đánh giá: nói 2–3 phút, đọc bài mới và nghe mẫu hoặc
              transcript; ghi cùng bốn tiêu chí tự đánh giá trong mục Tiến độ.
            </p>
          )}
        </section>
      ))}
    </>
  );
}
export function PageHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="page-heading">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p className="muted">{description}</p>
      </div>
    </div>
  );
}
