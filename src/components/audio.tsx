"use client";
import { useEffect, useRef, useState } from "react";
import { Mic, Square, Volume2 } from "lucide-react";
import { Button } from "./ui/button";
import { ConfirmDialog } from "./ui/confirm-dialog";

export function SpeechPlayer({ text }: { text: string }) {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]),
    [voice, setVoice] = useState(""),
    [rate, setRate] = useState("1"),
    [supported, setSupported] = useState(false),
    [error, setError] = useState("");
  useEffect(() => {
    setSupported("speechSynthesis" in window);
    if (!("speechSynthesis" in window)) return;
    const load = () =>
      setVoices(
        speechSynthesis.getVoices().filter((v) => v.lang.startsWith("en")),
      );
    load();
    speechSynthesis.addEventListener("voiceschanged", load);
    return () => {
      speechSynthesis.cancel();
      speechSynthesis.removeEventListener("voiceschanged", load);
    };
  }, []);
  useEffect(
    () => () => {
      if ("speechSynthesis" in window) speechSynthesis.cancel();
    },
    [text],
  );
  function play() {
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = Number(rate);
    utterance.voice =
      voices.find((v) => v.voiceURI === voice) || voices[0] || null;
    utterance.onerror = () =>
      setError(
        "Không phát được giọng. Hãy đọc transcript thành tiếng hoặc chọn giọng khác.",
      );
    setError("");
    speechSynthesis.speak(utterance);
  }
  return (
    <div className="audio-tools">
      <div className="actions">
        <Button variant="outline" disabled={!supported} onClick={play}>
          <Volume2 size={16} />
          Nghe mẫu
        </Button>
        <Button
          variant="ghost"
          disabled={!supported}
          onClick={() => speechSynthesis.cancel()}
        >
          Dừng
        </Button>
        <label>
          Giọng
          <select
            aria-label="Giọng tiếng Anh"
            value={voice}
            onChange={(e) => setVoice(e.target.value)}
          >
            <option value="">Mặc định tiếng Anh</option>
            {voices.map((v) => (
              <option key={v.voiceURI} value={v.voiceURI}>
                {v.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Tốc độ
          <select value={rate} onChange={(e) => setRate(e.target.value)}>
            {["0.75", "1", "1.25"].map((r) => (
              <option key={r} value={r}>
                {r}x
              </option>
            ))}
          </select>
        </label>
      </div>
      <small className="muted">
        Giọng tổng hợp trên thiết bị.{" "}
        {supported
          ? "Bạn có thể nghe rồi đọc nhại theo từng cụm."
          : "Thiết bị chưa hỗ trợ: đọc transcript, đánh dấu cụm ý và luyện với nhịp chậm."}
      </small>
      {error && <p role="alert">{error}</p>}
    </div>
  );
}
export const speakingCriteria = [
  "Tôi đã truyền đạt đủ ý.",
  "Tôi nhận ra câu phải dừng quá lâu.",
  "Tôi dùng được cụm từ mục tiêu.",
  "Nghe lại, tôi hiểu lời mình nói.",
];
export function Recorder() {
  const [recording, setRecording] = useState(false),
    [requesting, setRequesting] = useState(false),
    [url, setUrl] = useState(""),
    [mime, setMime] = useState("audio/webm"),
    [error, setError] = useState(""),
    [confirm, setConfirm] = useState(false);
  const recorder = useRef<MediaRecorder | null>(null),
    stream = useRef<MediaStream | null>(null),
    objectUrl = useRef(""),
    mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      if (recorder.current?.state === "recording") recorder.current.stop();
      stream.current?.getTracks().forEach((t) => t.stop());
      if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
    };
  }, []);
  async function start() {
    if (requesting) return;
    if (!navigator.mediaDevices?.getUserMedia || !("MediaRecorder" in window)) {
      setError(
        "Trình duyệt chưa hỗ trợ ghi âm. Hãy nói thành tiếng, dùng ứng dụng ghi âm trên thiết bị rồi tự đánh giá.",
      );
      return;
    }
    setError("");
    setRequesting(true);
    let expired = false;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    try {
      const pending = navigator.mediaDevices.getUserMedia({ audio: true });
      void pending.then(
        (input) => {
          if (expired || !mounted.current)
            input.getTracks().forEach((t) => t.stop());
        },
        () => {},
      );
      const input = await Promise.race([
        pending,
        new Promise<never>((_, reject) => {
          timeout = setTimeout(() => {
            expired = true;
            reject(new Error("permission-timeout"));
          }, 20000);
        }),
      ]);
      if (!mounted.current) {
        input.getTracks().forEach((t) => t.stop());
        return;
      }
      stream.current = input;
      const instance = new MediaRecorder(input);
      recorder.current = instance;
      const chunks: BlobPart[] = [];
      instance.ondataavailable = (e) => chunks.push(e.data);
      instance.onstop = () => {
        input.getTracks().forEach((t) => t.stop());
        if (!mounted.current) return;
        if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
        objectUrl.current = URL.createObjectURL(
          new Blob(chunks, { type: instance.mimeType }),
        );
        setUrl(objectUrl.current);
        setMime(instance.mimeType);
        setRecording(false);
      };
      instance.onerror = () => {
        input.getTracks().forEach((t) => t.stop());
        setRecording(false);
        setError(
          "Ghi âm bị gián đoạn. Bạn vẫn có thể nói và tự đánh giá bên dưới.",
        );
      };
      instance.start();
      setRecording(true);
    } catch {
      stream.current?.getTracks().forEach((t) => t.stop());
      setError(
        "Microphone chưa được cấp quyền, bị từ chối hoặc không khả dụng. Kiểm tra quyền của trình duyệt; bạn vẫn có thể nói thành tiếng và dùng checklist.",
      );
    } finally {
      if (timeout) clearTimeout(timeout);
      if (mounted.current) setRequesting(false);
    }
  }
  return (
    <div className="recorder">
      <h3>Thu và nghe lại</h3>
      <p className="muted">
        Âm thanh không được upload, chỉ tồn tại trong phiên này. Tải bản thu
        trước khi rời trang hoặc refresh.
      </p>
      <div className="actions">
        {recording ? (
          <Button
            variant="destructive"
            onClick={() => recorder.current?.stop()}
          >
            <Square size={15} />
            Dừng ghi âm
          </Button>
        ) : (
          <Button
            variant="outline"
            disabled={requesting}
            onClick={() => void start()}
          >
            <Mic size={15} />
            {requesting ? "Đang chờ quyền microphone…" : "Ghi âm"}
          </Button>
        )}
        {recording && <span role="status">Đang ghi…</span>}
        {url && (
          <>
            <a
              className="button outline"
              href={url}
              download={`devenglish-recording.${mime.includes("mp4") ? "mp4" : mime.includes("ogg") ? "ogg" : "webm"}`}
            >
              Tải bản thu
            </a>
            <Button variant="ghost" onClick={() => setConfirm(true)}>
              Xóa bản thu
            </Button>
          </>
        )}
      </div>
      {url && <audio controls src={url} />}
      <p role="alert">{error}</p>
      <ConfirmDialog
        open={confirm}
        onOpenChange={setConfirm}
        title="Xóa bản thu?"
        onConfirm={() => {
          URL.revokeObjectURL(objectUrl.current);
          objectUrl.current = "";
          setUrl("");
        }}
      >
        Bản thu trong phiên này sẽ bị xóa. Hãy tải về nếu muốn giữ.
      </ConfirmDialog>
    </div>
  );
}
