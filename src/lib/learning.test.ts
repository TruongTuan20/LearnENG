import { describe, it, expect } from "vitest";
import {
  addDays,
  canComplete,
  emptyProgress,
  initialData,
  localDate,
  makeSchedule,
  nextReview,
  requiredActivities,
  reschedule,
  statistics,
} from "./learning";
import { parseImport } from "./storage";
import { publishedLessons, weeks, lessons } from "../data/course";
import { readings } from "../data/readings";
import { scenarios } from "../data/scenarios";
describe("Lịch học và ngày cá nhân", () => {
  it("bắt đầu đúng thứ đã chọn, qua tháng và năm", () => {
    expect(
      makeSchedule(["a", "b", "c"], "2026-12-31", [1, 5]).map((e) => e.date),
    ).toEqual(["2027-01-01", "2027-01-04", "2027-01-08"]);
  });
  it("hỗ trợ cuối tuần và từ chối lịch không có ngày", () => {
    expect(
      makeSchedule(["a", "b"], "2026-10-30", [0, 6]).map((e) => e.date),
    ).toEqual(["2026-10-31", "2026-11-01"]);
    expect(() => makeSchedule(["a"], "2026-10-29", [])).toThrow();
  });
  it("xử lý ngày theo timezone thay vì UTC, kể cả DST", () => {
    const now = new Date("2026-10-29T18:30:00Z");
    expect(localDate("Asia/Ho_Chi_Minh", now)).toBe("2026-10-30");
    expect(localDate("America/New_York", now)).toBe("2026-10-29");
    expect(addDays("2026-03-08", 1)).toBe("2026-03-09");
  });
  it("học bù và dời lịch giữ kết quả, không đè ngày cố định", () => {
    const data = initialData("2026-10-29");
    data.schedule = makeSchedule(
      ["a", "b", "c"],
      "2026-10-26",
      [1, 2, 3, 4, 5],
    );
    data.progress.b = {
      ...emptyProgress("b"),
      completedAt: "2026-10-29",
      note: "kết quả học bù",
    };
    const result = reschedule(
      data,
      "2026-10-26",
      "2026-10-27",
      [1, 2, 3, 4, 5],
    );
    expect(result.find((e) => e.lessonId === "b")?.date).toBe("2026-10-27");
    expect(result.find((e) => e.lessonId === "a")?.date).toBe("2026-10-28");
    expect(result.find((e) => e.lessonId === "c")?.date).toBe("2026-10-29");
    expect(data.progress.b.note).toBe("kết quả học bù");
  });
});
describe("Ôn cách quãng", () => {
  it("tăng chu kỳ từ lần ôn được đánh giá, quên quay lại sớm", () => {
    const card = {
      id: "a:work as",
      lessonId: "a",
      text: "work as",
      meaning: "vai trò",
      example: "I work as a developer.",
      topic: "intro",
      due: "2026-10-29",
      stage: 0,
      reviews: [],
    };
    const first = nextReview(card, "good", "2026-10-29");
    expect(first.due).toBe("2026-10-30");
    const second = nextReview(first, "good", "2026-10-30");
    expect(second.due).toBe("2026-11-02");
    const forgotten = nextReview(
      { ...second, stage: 4 },
      "again",
      "2026-11-02",
    );
    expect(forgotten.stage).toBe(0);
    expect(forgotten.due).toBe("2026-11-03");
    expect(nextReview({ ...second, stage: 4 }, "hard", "2026-11-02").due).toBe(
      "2026-11-03",
    );
  });
});
describe("Thành tích thật", () => {
  it("mở app không tạo thời gian hoặc streak", () => {
    const result = statistics(initialData("2026-10-29"), "2026-10-29");
    expect(result.completed).toBe(0);
    expect(result.seconds).toBe(0);
    expect(result.streak).toBe(0);
    expect(result.studyDays).toBe(0);
  });
  it("cộng giây và chỉ đếm một ngày dù nhiều hoạt động", () => {
    const data = initialData("2026-10-29");
    data.sessions = [
      { id: "1", lessonId: "a", date: "2026-10-28", seconds: 65 },
      { id: "2", lessonId: "b", date: "2026-10-28", seconds: 55 },
      { id: "3", lessonId: "a", date: "2026-10-27", seconds: 60 },
    ];
    data.progress.a = { ...emptyProgress("a"), completedAt: "2026-10-28" };
    const result = statistics(data, "2026-10-29");
    expect(result.seconds).toBe(180);
    expect(result.streak).toBe(2);
    expect(result.studyDays).toBe(2);
    expect(result.completed).toBe(1);
    expect(statistics(data, "2026-10-30").streak).toBe(0);
  });
});
describe("Sao lưu", () => {
  it("đọc được bản sao đầy đủ và không đổi input", () => {
    const data = initialData("2026-10-29");
    expect(parseImport(JSON.parse(JSON.stringify(data)))).toEqual(data);
  });
  it("từ chối schema tương lai, ngày sai, timezone sai, giây âm và ID trùng", () => {
    const data = initialData("2026-10-29");
    expect(() => parseImport({ ...data, schemaVersion: 2 })).toThrow();
    expect(() =>
      parseImport({
        ...data,
        settings: { ...data.settings, startDate: "2026-02-30" },
      }),
    ).toThrow();
    expect(() =>
      parseImport({
        ...data,
        settings: { ...data.settings, timezone: "fake/zone" },
      }),
    ).toThrow();
    expect(() =>
      parseImport({
        ...data,
        sessions: [{ id: "x", lessonId: "a", date: "2026-10-29", seconds: -1 }],
      }),
    ).toThrow();
    const e = { id: "x", lessonId: "a", date: "2026-10-29" };
    expect(() => parseImport({ ...data, schedule: [e, e] })).toThrow();
  });
});
describe("Hoàn thành bài và chất lượng nội dung", () => {
  it("không hoàn thành chỉ bằng mở bài hay bỏ bài tập", () => {
    const l = publishedLessons[0],
      p = emptyProgress(l.id);
    expect(canComplete(l, p)).toBe(false);
    p.activities = [...requiredActivities];
    expect(canComplete(l, p)).toBe(false);
    p.checked = l.exercises.map((e) => e.id);
    p.answers = Object.fromEntries(
      l.exercises.map((e) => [e.id, "My attempt"]),
    );
    expect(canComplete(l, p)).toBe(true);
    expect(canComplete({ ...l, published: false }, p)).toBe(false);
  });
  it("đủ 24 tuần, 120 buổi, 35 bài khác nhau, 8 bài đọc và 12 kịch bản", () => {
    expect(weeks).toHaveLength(24);
    expect(lessons).toHaveLength(120);
    expect(publishedLessons).toHaveLength(35);
    expect(new Set(lessons.map((l) => l.id)).size).toBe(120);
    expect(new Set(publishedLessons.map((l) => l.passage)).size).toBe(35);
    for (const l of publishedLessons) {
      expect(l.phrases.length).toBeGreaterThanOrEqual(6);
      expect(l.exercises).toHaveLength(4);
      expect(l.objectives.length).toBeGreaterThanOrEqual(2);
    }
    expect(readings).toHaveLength(8);
    for (const r of readings) {
      const count = r.text.split(/\s+/).length;
      expect(count, `${r.id}: ${count} từ`).toBeGreaterThanOrEqual(150);
      expect(count).toBeLessThanOrEqual(250);
    }
    expect(scenarios).toHaveLength(12);
  });
});
