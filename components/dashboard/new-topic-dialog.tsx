"use client";

import { useState } from "react";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { createTopic } from "@/app/actions/topic";

interface Props {
  courseId: string;
}

export function NewTopicDialog({ courseId }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="cursor-pointer">
            + Add Topic
          </Button>
        }
      />

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Topic</DialogTitle>

          <DialogDescription>
            Add another topic to this course.
          </DialogDescription>
        </DialogHeader>

        <form
          action={async (formData) => {
            await createTopic(formData);
            setOpen(false);
          }}
          className="space-y-4 py-4"
        >
          <input
            type="hidden"
            name="courseId"
            value={courseId}
          />

          <Input
            name="title"
            placeholder="Topic title"
            required
          />

          <DialogFooter>
            <Button type="submit">
              Create Topic
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}