"use client";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "./button";
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  children,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  children: React.ReactNode;
  onConfirm: () => void;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content className="dialog-content">
          <Dialog.Title>{title}</Dialog.Title>
          <Dialog.Description asChild>
            <div className="muted">{children}</div>
          </Dialog.Description>
          <div className="actions">
            <Dialog.Close asChild>
              <Button variant="outline">Hủy</Button>
            </Dialog.Close>
            <Button
              variant="destructive"
              onClick={() => {
                onConfirm();
                onOpenChange(false);
              }}
            >
              Xác nhận
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
