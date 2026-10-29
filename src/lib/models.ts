import { z } from "zod";

export type Phrase = { text: string; meaning: string; example: string };
export type Exercise = {
  id: string;
  type: "choice" | "fill" | "order" | "writing";
  prompt: string;
  options?: string[];
  answers: string[];
  explanation: string;
};
export type Lesson = {
  id: string;
  week: number;
  day: number;
  title: string;
  topic: string;
  skill: string;
  published: boolean;
  estimatedMinutes: number;
  objectives: string[];
  output: string;
  warmup: string;
  explanation: string;
  phrases: Phrase[];
  patterns: string[];
  passage: string;
  exercises: Exercise[];
  speaking: string;
  application: string;
  summary: string;
  extension: string;
};
export type CourseWeek = {
  id: string;
  number: number;
  title: string;
  goal: string;
  output: string;
  lessons: Lesson[];
};
export type Reading = {
  id: string;
  title: string;
  level: string;
  minutes: number;
  text: string;
  translation: string;
  phrases: Phrase[];
  questions: Exercise[];
  summary: string;
  application: string;
  code?: string;
};
export type Scenario = {
  id: string;
  title: string;
  context: string;
  roleA: string;
  roleB: string;
  turns: { question: string; hint: string; reference: string }[];
  extension: string;
};

const date = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine(
    (v) =>
      !Number.isNaN(Date.parse(v)) &&
      new Date(v).toISOString().slice(0, 10) === v,
    "Ngày không hợp lệ",
  );
const timezone = z.string().refine((v) => {
  try {
    new Intl.DateTimeFormat("en", { timeZone: v });
    return true;
  } catch {
    return false;
  }
}, "Múi giờ không hợp lệ");
export const settingsSchema = z.object({
  name: z.string().trim().min(1).max(80),
  startDate: date,
  timezone,
  days: z
    .array(z.number().int().min(0).max(6))
    .min(1)
    .max(7)
    .refine((v) => new Set(v).size === v.length),
  duration: z.union([z.literal(30), z.literal(45), z.literal(60)]),
  priorities: z.array(z.string().max(80)).max(10),
  difficulties: z.array(z.string().max(80)).max(10),
  theme: z.enum(["light", "dark"]),
  onboarded: z.boolean(),
});
export const progressSchema = z.object({
  lessonId: z.string(),
  activities: z.array(z.string()),
  answers: z.record(z.string(), z.string()),
  checked: z.array(z.string()),
  note: z.string().max(20000),
  section: z.number().int().min(0).max(6),
  completedAt: date.optional(),
});
const reviewSchema = z.object({
  date,
  rating: z.enum(["again", "hard", "good", "easy"]),
});
export const cardSchema = z.object({
  id: z.string(),
  lessonId: z.string(),
  text: z.string(),
  meaning: z.string(),
  example: z.string(),
  topic: z.string(),
  due: date,
  stage: z.number().int().min(0).max(4),
  reviews: z.array(reviewSchema),
});
export const stateSchema = z.object({
  schemaVersion: z.literal(1),
  settings: settingsSchema,
  progress: z.record(z.string(), progressSchema),
  sessions: z.array(
    z.object({
      id: z.string(),
      lessonId: z.string(),
      date,
      seconds: z.number().int().min(1).max(86400),
    }),
  ),
  schedule: z.array(z.object({ id: z.string(), lessonId: z.string(), date })),
  cards: z.array(cardSchema),
  speaking: z.array(
    z.object({
      id: z.string(),
      scenarioId: z.string(),
      date,
      text: z.string().max(20000),
      checklist: z.array(z.boolean()),
    }),
  ),
  assessments: z.array(
    z.object({
      id: z.string(),
      date,
      score: z.number().min(0).max(9),
      total: z.number().min(0).max(9),
      note: z.string().max(20000),
    }),
  ),
  reading: z.record(
    z.string(),
    z.object({
      answers: z.record(z.string(), z.string()),
      checked: z.array(z.string()),
      summary: z.string(),
      applied: z.boolean(),
      completedAt: date.optional(),
    }),
  ),
});
export type UserSettings = z.infer<typeof settingsSchema>;
export type LessonProgress = z.infer<typeof progressSchema>;
export type VocabularyCard = z.infer<typeof cardSchema>;
export type UserData = z.infer<typeof stateSchema>;
export type Rating = "again" | "hard" | "good" | "easy";
