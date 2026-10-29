"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Check, Compass, X } from "lucide-react";
import { Button } from "./ui/button";

type Props = {
  id: string;
  title: string;
  steps: string[];
  current: number;
  hint: string;
  action: string;
  href?: string;
  onAction?: () => void;
  initiallyOpen?: boolean;
};

export function LearningGuide({
  id,
  title,
  steps,
  current,
  hint,
  action,
  href,
  onAction,
  initiallyOpen = true,
}: Props) {
  const [open, setOpen] = useState(initiallyOpen);
  const storageKey = `devenglish-guide:${id}`;
  useEffect(() => {
    try {
      if (localStorage.getItem(storageKey) === "hidden") setOpen(false);
    } catch {
      /* Vẫn dùng hướng dẫn khi trình duyệt chặn lưu tùy chọn. */
    }
  }, [storageKey]);

  function toggle(value: boolean) {
    setOpen(value);
    try {
      if (value) localStorage.removeItem(storageKey);
      else localStorage.setItem(storageKey, "hidden");
    } catch {
      /* Lựa chọn vẫn có hiệu lực trong phiên hiện tại. */
    }
  }

  if (!open)
    return (
      <div className="guide-replay">
        <Button variant="ghost" onClick={() => toggle(true)}>
          <Compass size={16} />
          Xem hướng dẫn từng bước
        </Button>
      </div>
    );

  return (
    <section className="learning-guide" aria-label="Hướng dẫn từng bước">
      <div className="guide-heading">
        <div>
          <span className="eyebrow">
            {current >= steps.length ? "BẠN ĐÃ LÀM ĐƯỢC" : "BẮT ĐẦU TẠI ĐÂY"}
          </span>
          <h2>{title}</h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Ẩn hướng dẫn"
          onClick={() => toggle(false)}
        >
          <X size={17} />
        </Button>
      </div>
      <ol className="guide-steps">
        {steps.map((step, i) => (
          <li
            key={step}
            className={
              i < current ? "complete" : i === current ? "current" : ""
            }
            aria-current={i === current ? "step" : undefined}
          >
            <span className="guide-step-number">
              {i < current ? <Check size={15} /> : i + 1}
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
      <div className="guide-next">
        <p key={hint} role="status">
          <span className="guide-pointer" aria-hidden="true">
            <ArrowRight size={18} />
          </span>
          {hint}
        </p>
        {current < steps.length && (
          <Button
            className="guide-action"
            asChild={!!href}
            onClick={href ? undefined : onAction}
          >
            {href ? (
              <Link href={href}>
                {action}
                <ArrowRight size={16} />
              </Link>
            ) : (
              <>
                {action}
                <ArrowRight size={16} />
              </>
            )}
          </Button>
        )}
      </div>
      <small className="muted">
        Bạn có thể ẩn và mở lại hướng dẫn bất cứ lúc nào.
      </small>
    </section>
  );
}
