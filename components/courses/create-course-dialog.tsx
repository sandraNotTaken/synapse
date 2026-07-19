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

      <DialogContent className="max-w-md border border-border bg-card text-foreground">
        <DialogHeader>
          <DialogTitle className="text-foreground">Create a course</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Add a new learning path and start building your personal study library.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-2xl border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
          Course creation is ready for the next step of your app flow.
        </div>
      </DialogContent>
    </Dialog>
  );
}
