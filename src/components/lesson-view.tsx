"use client";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookmarkPlus,
  Check,
  Pause,
  Play,
} from "lucide-react";
import { Lesson, LessonProgress } from "@/lib/models";
import {
  canComplete,
  durationTasks,
  emptyProgress,
  requiredActivities,
} from "@/lib/learning";
import { useLearning } from "./provider";
import { useStudyTimer } from "@/hooks/use-study-timer";
import { Button } from "./ui/button";
import { Exercise } from "./exercise";
import { Recorder, SpeechPlayer, speakingCriteria } from "./audio";
import { lessons } from "@/data/course";
const sections = [
  "Khởi động",
  "Cụm từ & mẫu câu",
  "Nghe / đọc",
  "Thực hành",
  "Nói & ứng dụng",
  "Tổng kết",
  "Ghi chú",
];
export function LessonView({ lesson: l }: { lesson: Lesson }) {
  const { data, update, today } = useLearning(),
    p = data.progress[l.id] || emptyProgress(l.id),
    timer = useStudyTimer(l.id),
    [message, setMessage] = useState(""),
    [checks, setChecks] = useState<boolean[]>([false, false, false, false]);
  const index = p.section;
  const patch = (changes: Partial<LessonProgress>) =>
    update((d) => ({
      ...d,
      progress: {
        ...d.progress,
        [l.id]: { ...(d.progress[l.id] || emptyProgress(l.id)), ...changes },
      },
    }));
  function activity(id: string) {
    patch({ activities: [...new Set([...p.activities, id])] });
  }
  function addPhrase(text: string, meaning: string, example: string) {
    const id = `${l.id}:${text.toLowerCase()}`;
    update((d) =>
      d.cards.some((c) => c.id === id)
        ? d
        : {
            ...d,
            cards: [
              ...d.cards,
              {
                id,
                lessonId: l.id,
                text,
                meaning,
                example,
                topic: l.topic,
                due: today,
                stage: 0,
                reviews: [],
              },
            ],
          },
    );
    setMessage(`Đã thêm “${text}” vào ôn tập.`);
  }
  const previous = lessons.find(
      (x) => x.week === l.week && x.day === l.day - 1,
    ),
    next = lessons[lessons.findIndex((x) => x.id === l.id) + 1];
  if (!l.published)
    return (
      <>
        <Link className="back-link" href="/roadmap">
          <ArrowLeft size={16} />
          Lộ trình
        </Link>
        <div className="card reading-width">
          <span className="badge">Đề cương · chưa phát hành</span>
          <h1>{l.title}</h1>
          <p>{l.explanation}</p>
          <h2>Mục tiêu</h2>
          {l.objectives.map((o) => (
            <p key={o}>{o}</p>
          ))}
          <h2>Nhiệm vụ sơ bộ</h2>
          <p>{l.warmup}</p>
          <p>{l.speaking}</p>
          <p>{l.application}</p>
          <p className="muted">
            Buổi này không được tính vào số bài có thể hoàn thành.
          </p>
        </div>
      </>
    );
  return (
    <>
      <Link className="back-link" href="/roadmap">
        <ArrowLeft size={16} />
        Lộ trình / Tuần {l.week}
      </Link>
      <div className="page-heading">
        <div>
          <span className="eyebrow">
            TUẦN {l.week} · BUỔI {l.day} · {l.skill}
          </span>
          <h1>{l.title}</h1>
          <p className="muted">{l.topic}</p>
        </div>
        <span className={`badge ${p.completedAt ? "green" : ""}`}>
          {p.completedAt
            ? "Đã hoàn thành"
            : `${p.activities.length}/${requiredActivities.length} hoạt động`}
        </span>
      </div>
      <div className="lesson-layout">
        <aside className="lesson-toc">
          <div className="card">
            <p className="eyebrow">NỘI DUNG BÀI</p>
            {sections.map((s, i) => (
              <button
                key={s}
                className={`toc-item ${i === index ? "active" : ""}`}
                onClick={() => patch({ section: i })}
              >
                <span>{i + 1}</span>
                {s}
              </button>
            ))}
            <hr />
            <div className="timer">
              <strong>
                {String(Math.floor(timer.elapsed / 60)).padStart(2, "0")}:
                {String(timer.elapsed % 60).padStart(2, "0")}
              </strong>
              <Button variant="outline" onClick={timer.toggle}>
                {timer.running ? <Pause size={15} /> : <Play size={15} />}{" "}
                {timer.running ? "Tạm dừng" : "Bắt đầu"}
              </Button>
            </div>
            <small className="muted">
              Thời gian phiên này. Tự dừng khi ẩn tab.
            </small>
            <p className="muted">
              {durationTasks(data.settings.duration).join(" · ")}
            </p>
          </div>
        </aside>
        <article className="card lesson-content">
          <div className="section-heading">
            <h2>{sections[index]}</h2>
            <span className="badge">
              {index + 1} / {sections.length}
            </span>
          </div>
          {index === 0 && (
            <>
              <h3>Sau bài này, bạn có thể</h3>
              <ul>
                {l.objectives.map((o) => (
                  <li key={o}>{o}</li>
                ))}
              </ul>
              <div className="callout">
                <h3>Thử trước khi xem mẫu</h3>
                <p>{l.warmup}</p>
              </div>
              <h3>Điểm cần nhớ</h3>
              <p>{l.explanation}</p>
              <Button onClick={() => activity("warmup")}>
                {p.activities.includes("warmup") ? <Check size={16} /> : null}
                Tôi đã khởi động
              </Button>
            </>
          )}
          {index === 1 && (
            <>
              <p>Học theo cụm, đặt một ví dụ thật của riêng bạn.</p>
              <div className="phrase-list">
                {l.phrases.map((f) => (
                  <div className="phrase" key={f.text}>
                    <div>
                      <h3 lang="en">{f.text}</h3>
                      <p className="muted">{f.meaning}</p>
                      <p lang="en">{f.example}</p>
                      <SpeechPlayer text={f.example} />
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label={`Thêm ${f.text} vào ôn tập`}
                      disabled={data.cards.some(
                        (c) => c.id === `${l.id}:${f.text.toLowerCase()}`,
                      )}
                      onClick={() => addPhrase(f.text, f.meaning, f.example)}
                    >
                      <BookmarkPlus size={18} />
                    </Button>
                  </div>
                ))}
              </div>
              <h3>Mẫu câu</h3>
              {l.patterns.map((s) => (
                <p className="sentence" lang="en" key={s}>
                  {s}
                </p>
              ))}
              <Button onClick={() => activity("phrases")}>
                Tôi đã luyện cụm từ và đặt câu
              </Button>
            </>
          )}
          {index === 2 && (
            <>
              <p className="muted">
                Buổi nghe: nghe trước rồi mở transcript để kiểm tra; buổi đọc:
                tìm ý chính trước khi tra từ.
              </p>
              <SpeechPlayer text={l.passage} />
              <details open={l.day !== 2}>
                <summary>Transcript / đoạn đọc nguyên bản</summary>
                <div className="passage" lang="en">
                  {l.passage}
                </div>
              </details>
              <Button onClick={() => activity("passage")}>
                Tôi đã nghe / đọc và tóm tắt ý chính
              </Button>
            </>
          )}
          {index === 3 && (
            <>
              {l.exercises.map((e) => (
                <Exercise
                  key={e.id}
                  exercise={e}
                  value={p.answers[e.id] || ""}
                  checked={p.checked.includes(e.id)}
                  onChange={(value) =>
                    patch({
                      answers: { ...p.answers, [e.id]: value },
                      checked: p.checked.filter((id) => id !== e.id),
                    })
                  }
                  onCheck={() =>
                    patch({ checked: [...new Set([...p.checked, e.id])] })
                  }
                />
              ))}
              <Button
                disabled={l.exercises.some(
                  (e) => !p.checked.includes(e.id) || !p.answers[e.id]?.trim(),
                )}
                onClick={() => activity("practice")}
              >
                Tôi đã làm bài và đọc giải thích
              </Button>
            </>
          )}
          {index === 4 && (
            <>
              <h3>Nói theo gợi ý</h3>
              <p lang="en" className="callout">
                {l.speaking}
              </p>
              <Recorder />
              <fieldset>
                <legend>Tự đánh giá sau khi nói</legend>
                <div className="checks vertical">
                  {speakingCriteria.map((c, i) => (
                    <label key={c}>
                      <input
                        type="checkbox"
                        checked={checks[i]}
                        onChange={(e) =>
                          setChecks(
                            checks.map((v, j) =>
                              j === i ? e.target.checked : v,
                            ),
                          )
                        }
                      />
                      {c}
                    </label>
                  ))}
                </div>
              </fieldset>
              <Button
                variant="outline"
                onClick={() => {
                  activity("speaking");
                  update((d) => ({
                    ...d,
                    speaking: [
                      ...d.speaking,
                      {
                        id: crypto.randomUUID(),
                        scenarioId: l.id,
                        date: today,
                        text: l.speaking,
                        checklist: checks,
                      },
                    ],
                  }));
                  setMessage("Đã lưu nhật ký tự đánh giá nói.");
                }}
              >
                Xác nhận đã thực hành & lưu tự đánh giá
              </Button>
              <h3>Áp dụng vào thực tế</h3>
              <p>{l.application}</p>
              <label className="field">
                Sản phẩm thực hành / ghi chú
                <textarea
                  rows={5}
                  value={p.note}
                  onChange={(e) => patch({ note: e.target.value })}
                />
              </label>
              <Button
                disabled={!p.note.trim()}
                onClick={() => activity("application")}
              >
                Xác nhận đã áp dụng
              </Button>
            </>
          )}
          {index === 5 && (
            <>
              <p>{l.summary}</p>
              <h3>Đầu ra của bạn</h3>
              <p>{l.output}</p>
              {data.settings.duration === 60 && (
                <div className="callout">
                  <h3>Nhiệm vụ mở rộng · 15 phút</h3>
                  <p>{l.extension}</p>
                </div>
              )}
              {data.settings.duration === 30 && (
                <p className="muted">
                  Buổi 30 phút: làm một bản thực hành ngắn với ba cụm từ; phần
                  đổi vai và thu lại để buổi sau.
                </p>
              )}
              <Button onClick={() => activity("summary")}>
                Tôi đã nhắc lại ý chính và xem đầu ra
              </Button>
              <hr />
              <h3>Hoàn thành bài</h3>
              <p className="muted">
                Cần đủ 7 hoạt động, mỗi bài tập đã có câu trả lời và đã xem giải
                thích. Phần tự thực hành cần xác nhận.
              </p>
              <ul>
                {requiredActivities
                  .filter((id) => !p.activities.includes(id))
                  .map((id) => (
                    <li key={id}>
                      Còn thiếu:{" "}
                      {
                        (
                          {
                            warmup: "Khởi động",
                            phrases: "Cụm từ",
                            passage: "Nghe/đọc",
                            practice: "Bài tập",
                            speaking: "Luyện nói",
                            application: "Áp dụng",
                            summary: "Tổng kết",
                          } as Record<string, string>
                        )[id]
                      }
                    </li>
                  ))}
              </ul>
              <Button
                disabled={!canComplete(l, p) || !!p.completedAt}
                onClick={() => {
                  patch({ completedAt: today });
                  setMessage(
                    "Đã lưu hoàn thành bài. Bạn có thể quay lại ôn bất cứ lúc nào.",
                  );
                }}
              >
                <Check size={16} />
                {p.completedAt
                  ? "Đã hoàn thành bài"
                  : "Hoàn thành & lưu tiến độ"}
              </Button>
            </>
          )}
          {index === 6 && (
            <>
              <label className="field">
                Ghi chú cá nhân (tự lưu)
                <textarea
                  rows={12}
                  value={p.note}
                  onChange={(e) => patch({ note: e.target.value })}
                  placeholder="Câu của tôi, điều cần hỏi lại, lỗi thường gặp…"
                />
              </label>
              <p className="muted">
                Ghi chú dùng chung với sản phẩm thực hành của bài.
              </p>
            </>
          )}
          <p className="save-message" role="status">
            {message}
          </p>
          <div className="lesson-footer">
            <Button
              variant="outline"
              disabled={index === 0}
              onClick={() => patch({ section: index - 1 })}
            >
              <ArrowLeft size={16} />
              Phần trước
            </Button>
            <Button
              variant="outline"
              disabled={index === 6}
              onClick={() => patch({ section: index + 1 })}
            >
              Phần tiếp theo
              <ArrowRight size={16} />
            </Button>
          </div>
        </article>
      </div>
      <div className="lesson-neighbors">
        {previous ? (
          <Link href={`/lesson/${previous.id}`}>← {previous.title}</Link>
        ) : (
          <span />
        )}
        {next && <Link href={`/lesson/${next.id}`}>{next.title} →</Link>}
      </div>
    </>
  );
}
