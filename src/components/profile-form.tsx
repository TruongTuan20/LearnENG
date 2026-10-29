"use client";
import { useState } from "react";
import { UserSettings, settingsSchema } from "@/lib/models";
import { Button } from "./ui/button";
export function ProfileForm({
  initial,
  onSave,
  submit = "Lưu thiết lập",
}: {
  initial: UserSettings;
  onSave: (v: UserSettings) => void;
  submit?: string;
}) {
  const [form, setForm] = useState(initial),
    [error, setError] = useState("");
  const set = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) =>
    setForm({ ...form, [key]: value });
  const toggle = (key: "priorities" | "difficulties", value: string) =>
    set(
      key,
      form[key].includes(value)
        ? form[key].filter((v) => v !== value)
        : [...form[key], value],
    );
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const result = settingsSchema.safeParse(form);
        if (!result.success) {
          setError(result.error.issues[0].message);
          return;
        }
        setError("");
        onSave(result.data);
      }}
      className="profile-form"
    >
      <div className="form-grid">
        <label className="field">
          Tên của bạn
          <input
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            maxLength={80}
            required
          />
        </label>
        <label className="field">
          Ngày bắt đầu
          <input
            type="date"
            value={form.startDate}
            onChange={(e) => set("startDate", e.target.value)}
            required
          />
        </label>
        <label className="field">
          Múi giờ (IANA)
          <input
            list="timezones"
            value={form.timezone}
            onChange={(e) => set("timezone", e.target.value)}
            required
          />
          <datalist id="timezones">
            {[
              "Asia/Ho_Chi_Minh",
              "Asia/Bangkok",
              "Asia/Tokyo",
              "Europe/London",
              "America/New_York",
              "UTC",
            ].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </datalist>
        </label>
        <label className="field">
          Thời lượng mỗi buổi
          <select
            value={form.duration}
            onChange={(e) =>
              set(
                "duration",
                Number(e.target.value) as UserSettings["duration"],
              )
            }
          >
            {[30, 45, 60].map((d) => (
              <option value={d} key={d}>
                {d} phút
              </option>
            ))}
          </select>
        </label>
      </div>
      <fieldset>
        <legend>Ngày học trong tuần</legend>
        <div className="day-picker">
          {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map((day, i) => (
            <label
              className={form.days.includes(i) ? "selected" : ""}
              key={day}
            >
              <input
                type="checkbox"
                checked={form.days.includes(i)}
                onChange={() =>
                  set(
                    "days",
                    form.days.includes(i)
                      ? form.days.filter((d) => d !== i)
                      : [...form.days, i],
                  )
                }
              />
              {day}
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend>Ưu tiên học tập</legend>
        <div className="checks">
          {["Giao tiếp đời thường", "Tiếng Anh công việc", "Đọc IT"].map(
            (v) => (
              <label key={v}>
                <input
                  type="checkbox"
                  checked={form.priorities.includes(v)}
                  onChange={() => toggle("priorities", v)}
                />
                {v}
              </label>
            ),
          )}
        </div>
      </fieldset>
      <fieldset>
        <legend>Điều đang khó với bạn</legend>
        <div className="checks">
          {[
            "Nghe chưa kịp",
            "Khó tạo câu",
            "Thiếu từ",
            "Phát âm",
            "Đọc chậm",
          ].map((v) => (
            <label key={v}>
              <input
                type="checkbox"
                checked={form.difficulties.includes(v)}
                onChange={() => toggle("difficulties", v)}
              />
              {v}
            </label>
          ))}
        </div>
      </fieldset>
      {error && (
        <p role="alert" className="error-text">
          {error}
        </p>
      )}
      <Button type="submit">{submit}</Button>
    </form>
  );
}
