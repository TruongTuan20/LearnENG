"use client";
import { useState } from "react";
import { Exercise as ExerciseModel } from "@/lib/models";
import { correctAnswer } from "@/lib/learning";
import { Button } from "./ui/button";
export function Exercise({
  exercise: e,
  value,
  checked,
  onChange,
  onCheck,
}: {
  exercise: ExerciseModel;
  value: string;
  checked: boolean;
  onChange: (v: string) => void;
  onCheck: () => void;
}) {
  const [selected, setSelected] = useState<number[]>([]);
  const self =
    e.type === "writing" || (e.type === "fill" && e.prompt.endsWith("?"));
  return (
    <fieldset className="exercise">
      <legend>{e.prompt}</legend>
      {e.type === "choice" ? (
        <div className="choices">
          {e.options?.map((option, i) => (
            <label key={i}>
              <input
                type="radio"
                name={e.id}
                checked={value === option}
                onChange={() => onChange(option)}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      ) : e.type === "order" ? (
        <>
          <p className="sentence" aria-live="polite">
            {value || "Chọn các từ theo thứ tự…"}
          </p>
          <div className="word-bank">
            {e.options?.map((word, i) => (
              <Button
                variant="outline"
                key={i}
                disabled={selected.includes(i)}
                onClick={() => {
                  const next = [...selected, i];
                  setSelected(next);
                  onChange(next.map((n) => e.options![n]).join(" "));
                }}
              >
                {word}
              </Button>
            ))}
            <Button
              variant="ghost"
              onClick={() => {
                setSelected([]);
                onChange("");
              }}
            >
              Làm lại thứ tự
            </Button>
          </div>
          <label className="field">
            Hoặc nhập câu bằng bàn phím
            <input value={value} onChange={(ev) => onChange(ev.target.value)} />
          </label>
        </>
      ) : (
        <label className="field">
          Câu trả lời
          {self ? (
            <textarea
              rows={3}
              value={value}
              onChange={(ev) => onChange(ev.target.value)}
            />
          ) : (
            <input
              value={value}
              onChange={(ev) => onChange(ev.target.value)}
              autoComplete="off"
            />
          )}
        </label>
      )}
      <Button variant="outline" disabled={!value.trim()} onClick={onCheck}>
        {checked
          ? "Xem lại giải thích"
          : self
            ? "Xem tham khảo & tự đánh giá"
            : "Kiểm tra"}
      </Button>
      {checked && (
        <div
          className={`feedback ${self ? "" : correctAnswer(e.answers, value) ? "success" : "retry"}`}
          role="status"
        >
          <strong>
            {self
              ? "Tham khảo, không chấm tự động"
              : correctAnswer(e.answers, value)
                ? "Đúng rồi"
                : "Chưa khớp đáp án; bạn có thể sửa và thử lại"}
          </strong>
          {self && <p>{e.answers[0]}</p>}
          <p>{e.explanation}</p>
          {self && (
            <p>
              Checklist: đủ ý · đúng ngữ cảnh · câu có chủ ngữ/động từ · dễ
              hiểu.
            </p>
          )}
        </div>
      )}
    </fieldset>
  );
}
