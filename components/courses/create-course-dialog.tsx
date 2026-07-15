"use client";

import { Plus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function CreateCourseDialog() {
  return (
    <Dialog>
      <DialogTrigger>
        <Button className="rounded-full">
          <Plus className="mr-2 h-4 w-4" />
          New course
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md border border-white/10 bg-[#05070d] text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Create a course</DialogTitle>
          <DialogDescription className="text-slate-400">
            Add a new learning path and start building your personal study library.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
          Course creation is ready for the next step of your app flow.
        </div>
      </DialogContent>
    </Dialog>
  );
}
