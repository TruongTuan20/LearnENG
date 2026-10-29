import {
  Lesson,
  LessonProgress,
  UserData,
  UserSettings,
  VocabularyCard,
  Rating,
} from "./models";

export function localDate(
  timezone = "Asia/Ho_Chi_Minh",
  now = new Date(),
): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  return ["year", "month", "day"]
    .map((t) => parts.find((p) => p.type === t)!.value)
    .join("-");
}
export function addDays(date: string, days: number): string {
  const value = new Date(`${date}T12:00:00Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}
export function weekday(date: string): number {
  return new Date(`${date}T12:00:00Z`).getUTCDay();
}
export function makeSchedule(
  lessonIds: string[],
  start: string,
  days: number[],
) {
  if (!days.length) throw new Error("Chọn ít nhất một ngày học.");
  let cursor = start;
  return lessonIds.map((lessonId) => {
    while (!days.includes(weekday(cursor))) cursor = addDays(cursor, 1);
    const entry = { id: `schedule-${lessonId}`, lessonId, date: cursor };
    cursor = addDays(cursor, 1);
    return entry;
  });
}
export function reschedule(
  data: UserData,
  from: string,
  start: string,
  days: number[],
): UserData["schedule"] {
  if (!days.length) throw new Error("Chọn ít nhất một ngày học.");
  const moving = data.schedule.filter(
    (e) => e.date >= from && !data.progress[e.lessonId]?.completedAt,
  );
  const ids = new Set(moving.map((e) => e.id));
  const fixed = data.schedule.filter((e) => !ids.has(e.id));
  const occupied = new Set(fixed.map((e) => e.date));
  let cursor = start;
  return [
    ...fixed,
    ...moving.map((e) => {
      while (!days.includes(weekday(cursor)) || occupied.has(cursor))
        cursor = addDays(cursor, 1);
      const result = { ...e, date: cursor };
      occupied.add(cursor);
      cursor = addDays(cursor, 1);
      return result;
    }),
  ];
}
export function nextReview(
  card: VocabularyCard,
  rating: Rating,
  date: string,
): VocabularyCard {
  // Chu kỳ 1, 3, 7, 14, 30 ngày; quên về mốc đầu, khó giữ mốc với hạn 1 ngày.
  const intervals = [1, 3, 7, 14, 30];
  const stage =
    rating === "again"
      ? 0
      : rating === "hard"
        ? card.stage
        : Math.min(
            4,
            card.reviews.length
              ? card.stage + (rating === "easy" ? 2 : 1)
              : rating === "easy"
                ? 1
                : 0,
          );
  return {
    ...card,
    stage,
    due: addDays(
      date,
      rating === "again" || rating === "hard" ? 1 : intervals[stage],
    ),
    reviews: [...card.reviews, { date, rating }],
  };
}
export const requiredActivities = [
  "warmup",
  "phrases",
  "passage",
  "practice",
  "speaking",
  "application",
  "summary",
];
export function canComplete(lesson: Lesson, progress: LessonProgress): boolean {
  return (
    lesson.published &&
    requiredActivities.every((id) => progress.activities.includes(id)) &&
    lesson.exercises.every(
      (e) =>
        progress.checked.includes(e.id) &&
        (progress.answers[e.id] || "").trim().length > 0,
    )
  );
}
export function normalizeAnswer(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[.!?]+$/g, "")
    .replace(/\s+/g, " ");
}
export function correctAnswer(answers: string[], value: string) {
  return answers.some((a) => normalizeAnswer(a) === normalizeAnswer(value));
}
export function emptyProgress(lessonId: string): LessonProgress {
  return {
    lessonId,
    activities: [],
    answers: {},
    checked: [],
    note: "",
    section: 0,
  };
}
export function initialData(today: string): UserData {
  return {
    schemaVersion: 1,
    settings: {
      name: "Tuấn",
      startDate: today,
      timezone: "Asia/Ho_Chi_Minh",
      days: [1, 2, 3, 4, 5],
      duration: 45,
      priorities: ["Tiếng Anh công việc"],
      difficulties: [],
      theme: "light",
      onboarded: false,
    },
    progress: {},
    sessions: [],
    schedule: [],
    cards: [],
    speaking: [],
    assessments: [],
    reading: {},
  };
}
export function statistics(data: UserData, today: string) {
  const dates = new Set([
    ...data.sessions.map((s) => s.date),
    ...Object.values(data.progress)
      .filter((p) => p.completedAt)
      .map((p) => p.completedAt!),
    ...data.cards.flatMap((c) => c.reviews.map((r) => r.date)),
    ...data.speaking.map((s) => s.date),
    ...data.assessments.map((a) => a.date),
    ...Object.values(data.reading)
      .filter((r) => r.completedAt)
      .map((r) => r.completedAt!),
  ]);
  let cursor = dates.has(today) ? today : addDays(today, -1),
    streak = 0;
  while (dates.has(cursor)) {
    streak++;
    cursor = addDays(cursor, -1);
  }
  const monday = addDays(today, -((weekday(today) + 6) % 7));
  return {
    completed: Object.values(data.progress).filter((p) => p.completedAt).length,
    seconds: data.sessions.reduce((sum, s) => sum + s.seconds, 0),
    studyDays: dates.size,
    streak,
    due: data.cards.filter((c) => c.due <= today).length,
    weeklySeconds: data.sessions
      .filter((s) => s.date >= monday && s.date <= today)
      .reduce((sum, s) => sum + s.seconds, 0),
    dates,
    monday,
  };
}
export function durationTasks(duration: UserSettings["duration"]) {
  return duration === 30
    ? [
        "3 phút ôn",
        "7 phút cụm từ",
        "7 phút nghe/đọc",
        "10 phút thực hành cốt lõi",
        "3 phút tổng kết",
      ]
    : duration === 60
      ? [
          "5 phút ôn",
          "10 phút cụm từ",
          "10 phút nghe/đọc",
          "15 phút thực hành",
          "5 phút tổng kết",
          "15 phút nhiệm vụ mở rộng",
        ]
      : [
          "5 phút ôn",
          "10 phút cụm từ",
          "10 phút nghe/đọc",
          "15 phút thực hành",
          "5 phút tổng kết",
        ];
}
