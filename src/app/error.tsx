"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="onboarding">
      <h1>Trang chưa mở được</h1>
      <p>
        Hãy thử tải lại nội dung. Dữ liệu học đã lưu trên thiết bị vẫn được giữ.
      </p>
      <button className="button primary" onClick={reset}>
        Thử lại
      </button>
    </main>
  );
}
