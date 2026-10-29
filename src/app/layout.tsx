import type { Metadata } from "next";
import "./globals.css";
import { LearningProvider } from "@/components/provider";
export const metadata: Metadata = {
  title: "DevEnglish · Không gian học của Tuấn",
  description:
    "Lộ trình tiếng Anh thực tế dành cho developer Việt: giao tiếp, công việc và đọc tài liệu IT.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>
        <LearningProvider>{children}</LearningProvider>
      </body>
    </html>
  );
}
