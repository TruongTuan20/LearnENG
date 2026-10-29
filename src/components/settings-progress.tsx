"use client";
import { useState } from "react";
import { Download, ExternalLink, Upload } from "lucide-react";
import { useLearning } from "./provider";
import { Button } from "./ui/button";
import { ConfirmDialog } from "./ui/confirm-dialog";
import { ProfileForm } from "./profile-form";
import { PageHeading } from "./overview";
import { downloadJson, parseImport } from "@/lib/storage";
import { UserData } from "@/lib/models";
import {
  addDays,
  correctAnswer,
  initialData,
  reschedule,
  statistics,
} from "@/lib/learning";
import { lessons, publishedLessons } from "@/data/course";
import { readings } from "@/data/readings";
import { resources } from "@/data/resources";
import { milestonePassages } from "@/data/assessment";
import { Recorder, SpeechPlayer, speakingCriteria } from "./audio";
export function Settings() {
  const { data, update, replace, today } = useLearning(),
    [preview, setPreview] = useState<UserData | null>(null),
    [confirm, setConfirm] = useState<"reset" | "import" | null>(null),
    [message, setMessage] = useState(""),
    [error, setError] = useState(""),
    [from, setFrom] = useState(today);
  async function importFile(file?: File) {
    setError("");
    setPreview(null);
    if (!file) return;
    if (file.size > 20 * 1024 * 1024) {
      setError("File lớn hơn 20 MB. Hãy chọn bản sao JSON của DevEnglish.");
      return;
    }
    try {
      const value = parseImport(JSON.parse(await file.text()) as unknown);
      setPreview(value);
    } catch {
      setError(
        "Bản sao không hợp lệ hoặc schema chưa được hỗ trợ. Dữ liệu hiện tại được giữ nguyên.",
      );
    }
  }
  return (
    <>
      <PageHeading
        eyebrow="KHÔNG GIAN CÁ NHÂN"
        title="Thiết lập & sao lưu"
        description="Dữ liệu chỉ lưu trên trình duyệt này, chưa đồng bộ thiết bị. Export trước khi xóa dữ liệu trình duyệt."
      />
      <section className="card">
        <h2>Hồ sơ và nhịp học</h2>
        <label className="field narrow">
          Áp dụng đổi lịch cho các buổi chưa xong từ
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
        </label>
        <p className="muted">
          Lịch mới bắt đầu từ ngày muộn hơn giữa mốc áp dụng và ngày bắt đầu bên
          dưới. Lịch sử và kết quả đã học được giữ nguyên.
        </p>
        <ProfileForm
          key={JSON.stringify({ ...data.settings, theme: undefined })}
          initial={data.settings}
          onSave={(settings) => {
            if (!from) {
              setMessage("Chọn ngày áp dụng lịch trước khi lưu.");
              return;
            }
            update((d) => ({
              ...d,
              settings: { ...settings, theme: d.settings.theme },
              schedule: reschedule(
                d,
                from,
                settings.startDate > from ? settings.startDate : from,
                settings.days,
              ),
            }));
            setMessage("Đã lưu hồ sơ và cập nhật những buổi chưa hoàn thành.");
          }}
        />
        <hr />
        <label className="field narrow">
          Giao diện
          <select
            value={data.settings.theme}
            onChange={(e) =>
              update((d) => ({
                ...d,
                settings: {
                  ...d.settings,
                  theme: e.target.value as "light" | "dark",
                },
              }))
            }
          >
            <option value="light">Sáng</option>
            <option value="dark">Tối</option>
          </select>
        </label>
      </section>
      <section className="card">
        <h2>Dữ liệu thuộc về bạn</h2>
        <p className="muted">
          Bản sao gồm hồ sơ, lịch, tiến độ, timer, từ vựng, nhật ký nói, đánh
          giá và ghi chú. Bản thu âm không nằm trong JSON.
        </p>
        <div className="actions">
          <Button onClick={() => downloadJson(data)}>
            <Download size={16} />
            Export JSON
          </Button>
          <label className="button outline file-label">
            <Upload size={16} />
            Chọn bản sao để import
            <input
              type="file"
              accept=".json,application/json"
              onChange={(e) => {
                void importFile(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
          </label>
        </div>
        {error && (
          <p className="error-text" role="alert">
            {error}
          </p>
        )}
        {preview && (
          <div className="callout">
            <h3>Xem trước bản sao · schema v{preview.schemaVersion}</h3>
            <p>
              {preview.settings.name} · {preview.schedule.length} buổi lịch ·{" "}
              {Object.keys(preview.progress).length} tiến độ bài ·{" "}
              {preview.cards.length} thẻ · {preview.sessions.length} phiên thời
              gian · {preview.speaking.length} lượt nói ·{" "}
              {preview.assessments.length} đánh giá ·{" "}
              {Object.keys(preview.reading).length} bài đọc ·{" "}
              {
                Object.values(preview.progress).filter((p) => p.note.trim())
                  .length
              }{" "}
              ghi chú
            </p>
            <p>
              Import sẽ thay thế toàn bộ dữ liệu hiện tại. Hãy export trước nếu
              cần giữ.
            </p>
            <Button variant="outline" onClick={() => setConfirm("import")}>
              Xác nhận thay thế từ bản sao
            </Button>
          </div>
        )}
      </section>
      <section className="card danger-zone">
        <h2>Đặt lại dữ liệu</h2>
        <p>
          Xóa dữ liệu học trong ứng dụng và quay về thiết lập ban đầu. Không xóa
          bản sao bạn đã tải về.
        </p>
        <Button variant="destructive" onClick={() => setConfirm("reset")}>
          Đặt lại toàn bộ
        </Button>
      </section>
      <p role="status">{message}</p>
      <ConfirmDialog
        open={confirm !== null}
        onOpenChange={(v) => {
          if (!v) setConfirm(null);
        }}
        title={
          confirm === "reset"
            ? "Đặt lại toàn bộ dữ liệu?"
            : "Thay thế dữ liệu hiện tại?"
        }
        onConfirm={() => {
          if (confirm === "reset") replace(initialData(today));
          else if (preview) {
            replace(preview);
            setPreview(null);
            setMessage("Đã khôi phục bản sao.");
          }
        }}
      >
        Export bản sao trước khi tiếp tục. Thao tác thay thế không gộp dữ liệu
        và không có nút hoàn tác.
      </ConfirmDialog>
    </>
  );
}
export function Resources() {
  const [filter, setFilter] = useState("all");
  return (
    <>
      <PageHeading
        eyebrow="HỌC THÊM KHI CẦN"
        title="Một vài nguồn đáng dùng"
        description="Chỉ cần một mục nhỏ trong 10–15 phút. Không bắt buộc mua ứng dụng để hoàn thành lộ trình."
      />
      <label className="field narrow">
        Mục tiêu
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">Tất cả</option>
          {["Nghe", "Nói", "Phát âm", "Đọc IT"].map((v) => (
            <option key={v}>{v}</option>
          ))}
        </select>
      </label>
      <div className="reading-grid">
        {resources
          .filter((r) => filter === "all" || r.category === filter)
          .map((r) => (
            <article className="card" key={r.title}>
              <span className="badge">{r.category}</span>
              <h2>{r.title}</h2>
              <p>{r.goal}</p>
              <h3>10–15 phút như thế nào?</h3>
              <p>{r.practice}</p>
              <p className="muted">Khi dùng: {r.when}</p>
              <p className="small">{r.cost}</p>
              <a
                className="text-link"
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Mở trang chính thức
                <ExternalLink size={14} />
              </a>
              <p className="small muted">
                {r.verified
                  ? "Đã kiểm tra trang chính thức 29/10/2026."
                  : "Chưa xác minh được nội dung do giới hạn truy cập; liên kết trang chính thức cần kiểm tra lại."}
              </p>
            </article>
          ))}
      </div>
    </>
  );
}
export function Progress() {
  const { data, update, today } = useLearning(),
    stats = statistics(data, today),
    [note, setNote] = useState(""),
    [milestone, setMilestone] = useState("4"),
    [checks, setChecks] = useState([false, false, false, false]),
    [tasks, setTasks] = useState([false, false, false]),
    [saved, setSaved] = useState(false);
  const scored = Object.values(data.progress).flatMap((p) => {
    const l = lessons.find((l) => l.id === p.lessonId);
    return (
      l?.exercises
        .filter((e) => e.type !== "writing" && p.checked.includes(e.id))
        .map((e) => ({
          correct: correctAnswer(e.answers, p.answers[e.id] || ""),
        })) || []
    );
  });
  return (
    <>
      <PageHeading
        eyebrow="TIẾN ĐỘ TỪ HOẠT ĐỘNG THẬT"
        title="Nhìn lại điều bạn đã làm được"
        description="Thời gian từ timer chủ động; kết quả có đáp án tách riêng phần tự đánh giá. Không quy đổi thành CEFR."
      />
      <div className="stats-grid">
        {[
          [
            `${stats.completed}/${publishedLessons.length}`,
            "Bài học hoàn thành",
          ],
          [Math.floor(stats.seconds / 60), "Phút thực học"],
          [stats.studyDays, "Ngày có hoạt động"],
          [stats.due, "Thẻ đến hạn"],
        ].map(([v, label]) => (
          <div className="card stat" key={label}>
            <span className="muted">{label}</span>
            <strong>{v}</strong>
          </div>
        ))}
      </div>
      <section className="card">
        <h2>Thời gian tuần này</h2>
        {stats.weeklySeconds ? (
          <div className="bar-chart">
            {Array.from({ length: 7 }, (_, i) => {
              const date = addDays(stats.monday, i),
                minutes =
                  data.sessions
                    .filter((s) => s.date === date)
                    .reduce((n, s) => n + s.seconds, 0) / 60;
              return (
                <div className="bar-column" key={date}>
                  <span>{Math.floor(minutes)}p</span>
                  <div
                    style={{
                      height: `${Math.max(2, Math.min(160, minutes * 2))}px`,
                    }}
                  />
                  <small>{["T2", "T3", "T4", "T5", "T6", "T7", "CN"][i]}</small>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="empty">
            Chưa có thời gian học tuần này. Bấm Bắt đầu trong bài học để tính
            thời gian thực.
          </p>
        )}
        <p className="muted">
          {stats.streak} ngày liên tiếp ·{" "}
          {scored.length
            ? `${scored.filter((s) => s.correct).length}/${scored.length} bài tập có đáp án khớp`
            : "Chưa có kết quả bài tập có đáp án."}
        </p>
      </section>
      <div className="dashboard-bottom">
        <section className="card">
          <h2>Chủ đề đã học</h2>
          {stats.completed ? (
            <ul>
              {[
                ...new Set(
                  lessons
                    .filter((l) => data.progress[l.id]?.completedAt)
                    .map((l) => l.topic),
                ),
              ].map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          ) : (
            <p className="empty">Chưa có bài hoàn thành.</p>
          )}
          <p>
            {Object.values(data.reading).filter((r) => r.completedAt).length}/8
            bài đọc đã hoàn thành
          </p>
        </section>
        <section className="card">
          <h2>Nhật ký nói gần đây</h2>
          {data.speaking.length ? (
            data.speaking
              .slice(-8)
              .reverse()
              .map((s) => (
                <details key={s.id}>
                  <summary>
                    {s.date} · {s.scenarioId}
                  </summary>
                  <p>{s.text}</p>
                  {speakingCriteria.map((c, i) => (
                    <p key={c}>
                      {s.checklist[i] ? "✓" : "○"} {c}
                    </p>
                  ))}
                </details>
              ))
          ) : (
            <p className="empty">
              Sau khi luyện nói, lưu checklist để so sánh theo thời gian.
            </p>
          )}
        </section>
      </div>
      <section className="card">
        <h2>Đánh giá mỗi 4 tuần</h2>
        <p>
          Ghi lại cùng tiêu chí để so sánh với chính mình. Không có cam kết
          thành thạo sau 24 tuần.
        </p>
        <label className="field narrow">
          Mốc tuần
          <select
            value={milestone}
            onChange={(e) => {
              setMilestone(e.target.value);
              setSaved(false);
            }}
          >
            {[4, 8, 12, 16, 20, 24].map((w) => (
              <option key={w}>{w}</option>
            ))}
          </select>
        </label>
        <ol>
          <li>Nói 2–3 phút về công việc đã làm, vấn đề và kế hoạch.</li>
          <li>Đọc một bài chưa đọc trong Đọc IT; tóm tắt bằng tiếng Anh.</li>
          <li>
            Nghe đoạn mới bên dưới, hoặc đọc transcript nếu thiết bị không hỗ
            trợ; tóm tắt ba ý.
          </li>
        </ol>
        <SpeechPlayer text={milestonePassages[milestone]} />
        <details>
          <summary>Transcript thay thế</summary>
          <p lang="en">{milestonePassages[milestone]}</p>
        </details>
        <Recorder />
        <fieldset>
          <legend>Đã thực hiện</legend>
          <div className="checks">
            {[
              "Nói 2–3 phút",
              "Đọc và tóm tắt bài mới",
              "Nghe / đọc transcript và tóm tắt",
            ].map((t, i) => (
              <label key={t}>
                <input
                  type="checkbox"
                  checked={tasks[i]}
                  onChange={(e) =>
                    setTasks(
                      tasks.map((v, j) => (j === i ? e.target.checked : v)),
                    )
                  }
                />
                {t}
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend>Tự quan sát với cùng tiêu chí</legend>
          <div className="checks vertical">
            {speakingCriteria.map((c, i) => (
              <label key={c}>
                <input
                  type="checkbox"
                  checked={checks[i]}
                  onChange={(e) =>
                    setChecks(
                      checks.map((v, j) => (i === j ? e.target.checked : v)),
                    )
                  }
                />
                {c}
              </label>
            ))}
          </div>
        </fieldset>
        <label className="field">
          Tóm tắt, điểm mạnh và việc cần luyện tiếp
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={5}
          />
        </label>
        <Button
          disabled={!note.trim() || tasks.some((v) => !v)}
          onClick={() => {
            update((d) => ({
              ...d,
              assessments: [
                ...d.assessments,
                {
                  id: crypto.randomUUID(),
                  date: today,
                  score: 0,
                  total: 0,
                  note: `Tuần ${milestone} · ${speakingCriteria.map((c, i) => `${checks[i] ? "✓" : "○"} ${c}`).join(" ")}\n${note}`,
                },
              ],
            }));
            setSaved(true);
          }}
        >
          Lưu đánh giá mốc tuần
        </Button>
        {saved && <p role="status">Đã lưu đánh giá.</p>}
        <h3>Lịch sử đánh giá</h3>
        {data.assessments.length ? (
          data.assessments.map((a) => (
            <details key={a.id}>
              <summary>
                {a.date} ·{" "}
                {a.total
                  ? `${a.score}/${a.total} câu đầu vào`
                  : "Tự đánh giá mốc tuần"}
              </summary>
              <p className="passage">{a.note}</p>
            </details>
          ))
        ) : (
          <p className="muted">Chưa có đánh giá.</p>
        )}
        <p className="small muted">
          Gợi ý bài đọc mới:{" "}
          {readings.find((r) => !data.reading[r.id]?.completedAt)?.title ||
            "Bạn đã hoàn thành tám bài hiện có; chọn tài liệu mới trong Tài nguyên."}
        </p>
      </section>
    </>
  );
}
