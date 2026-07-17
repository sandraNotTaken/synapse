"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  result: string;
}

export default function AIResultDialog({
  open,
  onOpenChange,
  title,
  result,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="max-h-[70vh] overflow-y-auto whitespace-pre-wrap text-sm leading-7">
          {result}
        </div>
      </DialogContent>
    </Dialog>
  );
}