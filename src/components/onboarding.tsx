"use client";
import { useState } from "react";
import { ArrowRight, BookOpen, CalendarDays, ShieldCheck } from "lucide-react";
import { useLearning } from "./provider";
import { ProfileForm } from "./profile-form";
import { Button } from "./ui/button";
import { Exercise } from "./exercise";
import { lessons } from "@/data/course";
import { assessmentPassage, assessmentQuestions } from "@/data/assessment";
import { correctAnswer, makeSchedule } from "@/lib/learning";
export function Onboarding() {
  const { data, update, today } = useLearning();
  const [step, setStep] = useState(0),
    [answers, setAnswers] = useState<Record<string, string>>({}),
    [checked, setChecked] = useState<string[]>([]),
    [speaking, setSpeaking] = useState(""),
    [result, setResult] = useState(false);
  function finish(withTest = false) {
    window.scrollTo(0, 0);
    update((d) => ({
      ...d,
      settings: { ...d.settings, onboarded: true },
      schedule: makeSchedule(
        lessons.map((l) => l.id),
        d.settings.startDate,
        d.settings.days,
      ),
      assessments: withTest
        ? [
            ...d.assessments,
            {
              id: crypto.randomUUID(),
              date: today,
              score: assessmentQuestions.filter((q) =>
                correctAnswer(q.answers, answers[q.id] || ""),
              ).length,
              total: 9,
              note: speaking,
            },
          ]
        : d.assessments,
    }));
  }
  return (
    <main className="onboarding">
      <a href="#setup" className="skip-link">
        Đến thiết lập
      </a>
      <div className="brand">
        <span className="brand-mark">
          D<span>e</span>
        </span>
        DevEnglish
      </div>
      <div className="onboarding-heading">
        <span className="eyebrow">KHÔNG GIAN HỌC CỦA BẠN</span>
        <h1>
          Tiếng Anh cho cuộc sống.
          <br />
          Và những ngày làm sản phẩm.
        </h1>
        <p className="muted">
          Một lộ trình thực tế, từng buổi một. Bắt đầu từ những điều bạn cần nói
          và đọc mỗi ngày.
        </p>
      </div>
      <div className="onboarding-benefits">
        <span>
          <CalendarDays size={18} />
          24 tuần · lịch riêng của bạn
        </span>
        <span>
          <BookOpen size={18} />
          35 bài sẵn sàng để học
        </span>
        <span>
          <ShieldCheck size={18} />
          Dữ liệu ở trình duyệt này
        </span>
      </div>
      <section className="card" id="setup">
        <div className="section-heading">
          <div>
            <span className="eyebrow">BƯỚC {step + 1} / 2</span>
            <h2>
              {step === 0
                ? "Thiết kế nhịp học phù hợp"
                : "Khởi động từ điểm hiện tại"}
            </h2>
          </div>
          <span className="badge">Không cần tài khoản</span>
        </div>
        {step === 0 ? (
          <ProfileForm
            initial={data.settings}
            submit="Tiếp tục đến kiểm tra đầu vào"
            onSave={(settings) => {
              update((d) => ({ ...d, settings }));
              setStep(1);
            }}
          />
        ) : (
          <>
            <p>
              Điểm TOEIC cũ không đủ xác định khả năng nói hay CEFR. Bài ngắn
              này chỉ gợi ý phần cần ôn. Bạn có thể bỏ qua để bắt đầu tuần 1.
            </p>
            <div className="actions">
              <Button variant="outline" onClick={() => finish()}>
                Bỏ qua, bắt đầu tuần 1 <ArrowRight size={16} />
              </Button>
              <Button variant="ghost" onClick={() => setStep(0)}>
                Sửa thiết lập
              </Button>
            </div>
            {assessmentQuestions.map((q, i) => (
              <div key={q.id}>
                {i === 6 && (
                  <div className="passage">
                    <h3>Đọc đoạn ngắn</h3>
                    <p lang="en">{assessmentPassage}</p>
                  </div>
                )}
                <Exercise
                  exercise={q}
                  value={answers[q.id] || ""}
                  checked={checked.includes(q.id)}
                  onChange={(value) =>
                    setAnswers({ ...answers, [q.id]: value })
                  }
                  onCheck={() => setChecked([...new Set([...checked, q.id])])}
                />
              </div>
            ))}
            <label className="field">
              Nói 60 giây: introduce yourself and describe yesterday’s work. Sau
              đó ghi tự đánh giá (đủ ý, chỗ dừng lâu, cụm từ dùng được).
              <textarea
                value={speaking}
                onChange={(e) => setSpeaking(e.target.value)}
                rows={3}
              />
            </label>
            <Button
              disabled={
                assessmentQuestions.some((q) => !answers[q.id]) ||
                !speaking.trim()
              }
              onClick={() => setResult(true)}
            >
              Xem gợi ý điểm bắt đầu
            </Button>
            {result && (
              <div className="feedback">
                <h3>
                  {
                    assessmentQuestions.filter((q) =>
                      correctAnswer(q.answers, answers[q.id] || ""),
                    ).length
                  }
                  /9 câu có đáp án
                </h3>
                <p>
                  {assessmentQuestions.filter((q) =>
                    correctAnswer(q.answers, answers[q.id] || ""),
                  ).length < 6
                    ? "Nên học chậm tuần 1–4 và nghe lại từng cụm."
                    : "Bạn có thể thử tuần 1 trước; dùng phần nâng cao 60 phút khi thấy phù hợp."}{" "}
                  Kết quả không chấm nói và không quy đổi CEFR.
                </p>
                <Button onClick={() => finish(true)}>
                  Lưu kết quả và vào học
                </Button>
              </div>
            )}
          </>
        )}
      </section>
      <p className="muted">
        Chưa đồng bộ giữa thiết bị. Hãy export trước khi xóa dữ liệu trình
        duyệt.
      </p>
    </main>
  );
}
