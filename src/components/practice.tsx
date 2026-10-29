"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Check, RotateCcw } from "lucide-react";
import { useLearning } from "./provider";
import { Button } from "./ui/button";
import { ConfirmDialog } from "./ui/confirm-dialog";
import { Exercise } from "./exercise";
import { PageHeading } from "./overview";
import { Recorder, SpeechPlayer, speakingCriteria } from "./audio";
import { nextReview } from "@/lib/learning";
import { Rating } from "@/lib/models";
import { scenarios } from "@/data/scenarios";
import { readings } from "@/data/readings";

export function Vocabulary() {
  const { data, update, today } = useLearning(),
    [topic, setTopic] = useState("all"),
    [status, setStatus] = useState("all"),
    [session, setSession] = useState<string[] | null>(null),
    [reveal, setReveal] = useState(false),
    [remove, setRemove] = useState("");
  const filtered = data.cards.filter(
    (c) =>
      (topic === "all" || c.topic === topic) &&
      (status === "all" ||
        (status === "due" && c.due <= today) ||
        (status === "new" && !c.reviews.length)),
  );
  const card = session
    ? data.cards.find((c) => c.id === session[0])
    : undefined;
  function rate(rating: Rating) {
    if (!card) return;
    update((d) => ({
      ...d,
      cards: d.cards.map((c) =>
        c.id === card.id ? nextReview(c, rating, today) : c,
      ),
    }));
    setSession(session!.slice(1));
    setReveal(false);
  }
  return (
    <>
      <PageHeading
        eyebrow="NHỚ THEO CỤM, DÙNG TRONG CÂU"
        title="Từ vựng của bạn"
        description="Chu kỳ ôn 1, 3, 7, 14, 30 ngày. Chưa nhớ hoặc khó sẽ quay lại sau 1 ngày; chỉ tự đánh giá mới cập nhật lịch."
      />
      <div className="toolbar">
        <label className="field">
          Chủ đề
          <select value={topic} onChange={(e) => setTopic(e.target.value)}>
            <option value="all">Tất cả chủ đề</option>
            {[...new Set(data.cards.map((c) => c.topic))].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <label className="field">
          Trạng thái
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">Tất cả</option>
            <option value="due">Đến hạn</option>
            <option value="new">Chưa ôn lần nào</option>
          </select>
        </label>
        <Button
          disabled={!filtered.some((c) => c.due <= today)}
          onClick={() => {
            setSession(filtered.filter((c) => c.due <= today).map((c) => c.id));
            setReveal(false);
          }}
        >
          Ôn thẻ đến hạn ({filtered.filter((c) => c.due <= today).length})
        </Button>
      </div>
      {session !== null && (
        <section className="card flashcard">
          {card ? (
            <>
              <span className="eyebrow">
                CÒN {session.length} THẺ TRONG PHIÊN
              </span>
              <h2 lang="en">{card.text}</h2>
              <SpeechPlayer text={reveal ? card.example : card.text} />
              {reveal ? (
                <>
                  <p>{card.meaning}</p>
                  <p lang="en">{card.example}</p>
                  <div className="actions">
                    {(
                      [
                        ["again", "Chưa nhớ"],
                        ["hard", "Khó"],
                        ["good", "Nhớ"],
                        ["easy", "Dễ"],
                      ] as [Rating, string][]
                    ).map(([r, label]) => (
                      <Button variant="outline" key={r} onClick={() => rate(r)}>
                        {label}
                      </Button>
                    ))}
                  </div>
                </>
              ) : (
                <Button onClick={() => setReveal(true)}>Lật thẻ</Button>
              )}
              <Button variant="ghost" onClick={() => setSession(null)}>
                Kết thúc phiên
              </Button>
            </>
          ) : (
            <>
              <Check size={28} />
              <h2>Đã ôn xong các thẻ của phiên</h2>
              <p className="muted">
                Lịch tiếp theo đã lưu theo từng lựa chọn của bạn.
              </p>
              <Button variant="outline" onClick={() => setSession(null)}>
                Về danh sách
              </Button>
            </>
          )}
        </section>
      )}
      {session !== null ? null : !data.cards.length ? (
        <section className="card empty">
          <RotateCcw size={28} />
          <h2>Bắt đầu từ cụm từ bạn cần dùng</h2>
          <p>
            Mở bài học rồi bấm biểu tượng lưu cạnh cụm từ. Chưa có thẻ nào được
            thêm tự động.
          </p>
          <Button asChild>
            <Link href="/roadmap">
              Mở lộ trình
              <ArrowRight size={16} />
            </Link>
          </Button>
        </section>
      ) : (
        <section className="card">
          {filtered.length ? (
            filtered.map((c) => (
              <div className="vocabulary-row" key={c.id}>
                <div>
                  <h3 lang="en">{c.text}</h3>
                  <p>{c.meaning}</p>
                  <p className="muted" lang="en">
                    {c.example}
                  </p>
                  <small>
                    {c.reviews.length} lần tự đánh giá · Ôn tiếp: {c.due} ·{" "}
                    {c.topic}
                  </small>
                  <details>
                    <summary>Lịch sử ôn</summary>
                    {c.reviews.length ? (
                      c.reviews.map((r, i) => (
                        <p key={i}>
                          {r.date} ·{" "}
                          {
                            {
                              again: "Chưa nhớ",
                              hard: "Khó",
                              good: "Nhớ",
                              easy: "Dễ",
                            }[r.rating]
                          }
                        </p>
                      ))
                    ) : (
                      <p>Chưa có lượt ôn.</p>
                    )}
                  </details>
                </div>
                <div className="actions">
                  <Link className="text-link" href={`/lesson/${c.lessonId}`}>
                    Bài nguồn
                  </Link>
                  <Button variant="ghost" onClick={() => setRemove(c.id)}>
                    Xóa
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="empty">Không có thẻ phù hợp bộ lọc.</p>
          )}
        </section>
      )}
      <ConfirmDialog
        open={!!remove}
        onOpenChange={(v) => {
          if (!v) setRemove("");
        }}
        title="Xóa thẻ và lịch sử ôn?"
        onConfirm={() =>
          update((d) => ({
            ...d,
            cards: d.cards.filter((c) => c.id !== remove),
          }))
        }
      >
        Thẻ này có thể được thêm lại từ bài nguồn, nhưng lịch sử ôn đã xóa không
        khôi phục được nếu chưa sao lưu.
      </ConfirmDialog>
    </>
  );
}
export function Speaking() {
  const { update, today } = useLearning(),
    [id, setId] = useState(scenarios[0].id),
    [turn, setTurn] = useState(0),
    [answer, setAnswer] = useState(""),
    [checks, setChecks] = useState([false, false, false, false]),
    [message, setMessage] = useState("");
  const s = scenarios.find((s) => s.id === id)!;
  return (
    <>
      <PageHeading
        eyebrow="THỰC HÀNH TỪNG LƯỢT"
        title="Nói điều bạn cần nói"
        description="12 hội thoại theo kịch bản, có gợi ý và câu tham khảo. Đây không phải chatbot AI và không chấm phát âm tự động."
      />
      <div className="practice-layout">
        <nav className="card scenario-nav" aria-label="Chọn tình huống">
          {scenarios.map((s, i) => (
            <button
              className={s.id === id ? "active" : ""}
              onClick={() => {
                setId(s.id);
                setTurn(0);
                setAnswer("");
                setMessage("");
                setChecks([false, false, false, false]);
              }}
              key={s.id}
            >
              <span>{String(i + 1).padStart(2, "0")}</span>
              {s.title}
            </button>
          ))}
        </nav>
        <article className="card" key={id}>
          <span className="badge">
            Cơ bản · Tình huống {scenarios.findIndex((x) => x.id === id) + 1}/12
          </span>
          <h2>{s.title}</h2>
          <p>{s.context}</p>
          <p className="muted">
            Vai A: {s.roleA} · Vai B (bạn): {s.roleB}
          </p>
          <div className="conversation">
            <span className="eyebrow">
              LƯỢT {turn + 1}/{s.turns.length} · VAI A
            </span>
            <p lang="en">{s.turns[turn].question}</p>
            <SpeechPlayer text={s.turns[turn].question} />
          </div>
          <details>
            <summary>Gợi ý & câu trả lời tham khảo</summary>
            <p>{s.turns[turn].hint}</p>
            <p lang="en">{s.turns[turn].reference}</p>
          </details>
          <label className="field">
            Ghi ý hoặc câu bạn đã nói
            <textarea
              rows={4}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
          </label>
          <div className="actions">
            <Button
              variant="outline"
              disabled={turn === 0}
              onClick={() => setTurn(turn - 1)}
            >
              Lượt trước
            </Button>
            <Button
              variant="outline"
              disabled={turn === s.turns.length - 1}
              onClick={() => setTurn(turn + 1)}
            >
              Lượt tiếp theo
            </Button>
          </div>
          <Recorder />
          <fieldset>
            <legend>Sau khi nói, tự quan sát</legend>
            <div className="checks vertical">
              {speakingCriteria.map((c, i) => (
                <label key={c}>
                  <input
                    type="checkbox"
                    checked={checks[i]}
                    onChange={(e) =>
                      setChecks(
                        checks.map((v, j) => (j === i ? e.target.checked : v)),
                      )
                    }
                  />
                  {c}
                </label>
              ))}
            </div>
          </fieldset>
          <Button
            disabled={!answer.trim()}
            onClick={() => {
              update((d) => ({
                ...d,
                speaking: [
                  ...d.speaking,
                  {
                    id: crypto.randomUUID(),
                    scenarioId: id,
                    date: today,
                    text: answer,
                    checklist: checks,
                  },
                ],
              }));
              setMessage("Đã lưu nhật ký tự đánh giá (không bao gồm bản thu).");
            }}
          >
            Lưu lượt thực hành & tự đánh giá
          </Button>
          <p role="status">{message}</p>
          <details>
            <summary>Nhiệm vụ mở rộng</summary>
            <p>{s.extension}</p>
          </details>
          <p className="small muted">
            Bản đầu không bật nhận dạng giọng nói. Bạn nghe lại bản thu và dùng
            checklist; không có điểm pronunciation, fluency hay CEFR.
          </p>
        </article>
      </div>
    </>
  );
}
export function ReadingView() {
  const { data, update, today } = useLearning(),
    [id, setId] = useState(""),
    [translation, setTranslation] = useState(false),
    [message, setMessage] = useState("");
  const r = readings.find((r) => r.id === id);
  if (!r)
    return (
      <>
        <PageHeading
          eyebrow="ĐỌC HIỂU → ÁP DỤNG"
          title="Tiếng Anh trong tài liệu IT"
          description="8 bài đọc nguyên bản, mỗi bài 150–250 từ. Nội dung học trong ứng dụng, tách biệt liên kết tài liệu chính thức."
        />
        <div className="reading-grid">
          {readings.map((r, i) => (
            <button
              className="card reading-card"
              key={r.id}
              onClick={() => {
                setId(r.id);
                setTranslation(false);
              }}
            >
              <span className="reading-index">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="badge">
                {r.level} · {r.minutes} phút
              </span>
              <h2>{r.title}</h2>
              <p>{r.text.slice(0, 120)}…</p>
              <span className="text-link">
                {data.reading[r.id]?.completedAt ? "Đọc lại" : "Bắt đầu đọc"}
                <ArrowRight size={16} />
              </span>
            </button>
          ))}
        </div>
      </>
    );
  const p = data.reading[id] || {
    answers: {},
    checked: [],
    summary: "",
    applied: false,
  };
  const patch = (changes: Partial<typeof p>) =>
    update((d) => ({
      ...d,
      reading: {
        ...d.reading,
        [id]: {
          ...(d.reading[id] || {
            answers: {},
            checked: [],
            summary: "",
            applied: false,
          }),
          ...changes,
        },
      },
    }));
  return (
    <>
      <Button
        variant="ghost"
        onClick={() => {
          setId("");
          setMessage("");
        }}
      >
        ← Tất cả bài đọc
      </Button>
      <article className="card reading-width">
        <span className="eyebrow">TÀI LIỆU NGUYÊN BẢN · {r.minutes} PHÚT</span>
        <h1>{r.title}</h1>
        <SpeechPlayer text={r.text} />
        <div className="passage" lang="en">
          {r.text}
        </div>
        {r.code && (
          <pre>
            <code>{r.code}</code>
          </pre>
        )}
        <Button variant="outline" onClick={() => setTranslation(!translation)}>
          {translation ? "Ẩn" : "Hiện"} giải thích tiếng Việt
        </Button>
        {translation && <p className="callout">{r.translation}</p>}
        <h2>Cụm từ trong ngữ cảnh</h2>
        {r.phrases.map((f) => (
          <p key={f.text}>
            <strong lang="en">{f.text}</strong> — {f.meaning}
            <br />
            <span lang="en">{f.example}</span>
          </p>
        ))}
        <h2>Kiểm tra đọc hiểu</h2>
        {r.questions.map((q) => (
          <Exercise
            key={q.id}
            exercise={q}
            value={p.answers[q.id] || ""}
            checked={p.checked.includes(q.id)}
            onChange={(v) =>
              patch({
                answers: { ...p.answers, [q.id]: v },
                checked: p.checked.filter((x) => x !== q.id),
              })
            }
            onCheck={() =>
              patch({ checked: [...new Set([...p.checked, q.id])] })
            }
          />
        ))}
        <label className="field">
          {r.summary}
          <textarea
            rows={5}
            value={p.summary}
            onChange={(e) => patch({ summary: e.target.value })}
          />
        </label>
        <div className="callout">
          <h3>Ứng dụng kỹ thuật</h3>
          <p>{r.application}</p>
          <label className="check">
            <input
              type="checkbox"
              checked={p.applied}
              onChange={(e) => patch({ applied: e.target.checked })}
            />
            Tôi đã thực hiện nhiệm vụ ứng dụng và tự kiểm tra.
          </label>
        </div>
        <Button
          disabled={
            r.questions.some(
              (q) => !p.checked.includes(q.id) || !p.answers[q.id]?.trim(),
            ) ||
            !p.summary.trim() ||
            !p.applied ||
            !!p.completedAt
          }
          onClick={() => {
            patch({ completedAt: today });
            setMessage("Đã lưu hoàn thành bài đọc.");
          }}
        >
          {p.completedAt ? "Đã hoàn thành" : "Hoàn thành bài đọc"}
        </Button>
        <p role="status">{message}</p>
      </article>
    </>
  );
}
