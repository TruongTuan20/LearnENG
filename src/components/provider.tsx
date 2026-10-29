"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { UserData } from "@/lib/models";
import { initialData, localDate } from "@/lib/learning";
import { downloadJson, loadData, saveData } from "@/lib/storage";
import { Button } from "./ui/button";
type Store = {
  data: UserData;
  update: (fn: (data: UserData) => UserData) => void;
  replace: (data: UserData) => void;
  today: string;
  saving: boolean;
};
const Context = createContext<Store | null>(null);
export function useLearning() {
  const value = useContext(Context);
  if (!value) throw new Error("Thiếu LearningProvider");
  return value;
}
export function LearningProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<UserData>(),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true),
    [saving, setSaving] = useState(false),
    [clock, setClock] = useState(0);
  const current = useRef<UserData | undefined>(undefined),
    queue = useRef(Promise.resolve()),
    revision = useRef(0);
  const read = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const loaded = (await loadData()) || initialData(localDate());
      current.current = loaded;
      setData(loaded);
    } catch {
      setError(
        "Không đọc được dữ liệu trình duyệt. Cho phép IndexedDB hoặc mở lại bằng trình duyệt thường; dữ liệu hiện tại chưa bị ghi đè.",
      );
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    void read();
    const id = setInterval(() => setClock((v) => v + 1), 30000);
    return () => clearInterval(id);
  }, [read]);
  const persist = useCallback((next: UserData) => {
    current.current = next;
    setData(next);
    setSaving(true);
    const version = ++revision.current;
    queue.current = queue.current
      .catch(() => {})
      .then(async () => {
        try {
          await saveData(next);
          if (version === revision.current) setError("");
        } catch {
          setError(
            "Chưa lưu được dữ liệu: bộ nhớ bị chặn hoặc đầy. Hãy export bản sao ngay, giải phóng dung lượng rồi bấm Thử lưu lại.",
          );
        } finally {
          if (version === revision.current) setSaving(false);
        }
      });
  }, []);
  const update = useCallback(
    (fn: (data: UserData) => UserData) => {
      if (current.current) persist(fn(current.current));
    },
    [persist],
  );
  useEffect(() => {
    if (data) document.documentElement.dataset.theme = data.settings.theme;
  }, [data?.settings.theme]);
  void clock;
  if (loading)
    return (
      <div className="loading" role="status">
        <span className="brand-mark">
          D<span>e</span>
        </span>
        <p>Đang mở không gian học…</p>
      </div>
    );
  if (!data)
    return (
      <main className="onboarding">
        <h1>Chưa mở được dữ liệu</h1>
        <p role="alert">{error}</p>
        <Button onClick={() => void read()}>Thử lại</Button>
      </main>
    );
  return (
    <Context.Provider
      value={{
        data,
        update,
        replace: persist,
        today: localDate(data.settings.timezone),
        saving,
      }}
    >
      {error && (
        <div className="storage-error" role="alert">
          {error}
          <div className="actions">
            <Button variant="outline" onClick={() => downloadJson(data)}>
              Export bản sao
            </Button>
            <Button onClick={() => persist(data)}>Thử lưu lại</Button>
          </div>
        </div>
      )}
      {children}
    </Context.Provider>
  );
}
