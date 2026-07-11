"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  createCourseSchema,
  type CreateCourseInput,
} from "@/lib/validations/course";

import { createCourse } from "@/app/dashboard/courses/actions";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function CreateCourseDialog() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<CreateCourseInput>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: {
      title: "",
      description: "",
      color: "#3B82F6",
    },
  });

  function onSubmit(values: CreateCourseInput) {
    startTransition(async () => {
      await createCourse(values);

      form.reset();

      setOpen(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>New Course</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Course</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <Input
            placeholder="Course title"
            {...form.register("title")}
          />

          {form.formState.errors.title && (
            <p className="text-sm text-red-500">
              {form.formState.errors.title.message}
            </p>
          )}

          <Textarea
            placeholder="Description (optional)"
            {...form.register("description")}
          />

          <Input
            type="color"
            {...form.register("color")}
          />

          <Button
            type="submit"
            disabled={isPending}
            className="w-full"
          >
            {isPending ? "Creating..." : "Create Course"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}