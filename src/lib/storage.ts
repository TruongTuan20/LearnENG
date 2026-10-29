import { openDB } from "idb";
import { stateSchema, UserData } from "./models";
import { lessons } from "../data/course";
import { readings } from "../data/readings";
import { scenarios } from "../data/scenarios";

let connection: ReturnType<typeof openDB> | undefined;
const database = () =>
  (connection ??= openDB("devenglish", 1, {
    upgrade(db) {
      db.createObjectStore("user");
    },
  }).catch((error) => {
    connection = undefined;
    throw error;
  }));
export async function loadData(): Promise<UserData | undefined> {
  const db = await database();
  const raw: unknown = await db.get("user", "data");
  return raw ? parseImport(raw) : undefined;
}
export async function saveData(data: UserData) {
  const db = await database();
  await db.put("user", data, "data");
}
export function parseImport(raw: unknown): UserData {
  // v1 là định dạng đầu tiên; phiên bản tương lai bị từ chối trước khi ghi dữ liệu.
  const data = stateSchema.parse(raw);
  for (const values of [
    data.schedule,
    data.cards,
    data.sessions,
    data.speaking,
    data.assessments,
  ])
    if (new Set(values.map((v) => v.id)).size !== values.length)
      throw new Error("Dữ liệu có ID trùng.");
  if (data.cards.some((c) => c.id !== `${c.lessonId}:${c.text.toLowerCase()}`))
    throw new Error("ID thẻ không hợp lệ.");
  const lessonIds = new Set(lessons.map((l) => l.id));
  const readingIds = new Set(readings.map((r) => r.id));
  const speakingIds = new Set([...lessonIds, ...scenarios.map((s) => s.id)]);
  if (
    [...data.schedule, ...data.sessions, ...data.cards].some(
      (v) => !lessonIds.has(v.lessonId),
    ) ||
    Object.entries(data.progress).some(
      ([id, p]) => id !== p.lessonId || !lessonIds.has(id),
    ) ||
    Object.keys(data.reading).some((id) => !readingIds.has(id)) ||
    data.speaking.some((s) => !speakingIds.has(s.scenarioId))
  )
    throw new Error("Bản sao tham chiếu nội dung chưa được hỗ trợ.");
  if (
    new Set(data.schedule.map((e) => e.lessonId)).size !== data.schedule.length
  )
    throw new Error("Một bài có nhiều buổi lịch trùng.");
  return data;
}
export function downloadJson(data: UserData) {
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = `devenglish-backup-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
