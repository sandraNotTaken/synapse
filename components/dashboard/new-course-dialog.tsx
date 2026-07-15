"use client";

import { useState } from "react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createCourse } from "@/app/dashboard/actions";

export function NewCourseDialog() {
    const [open, setOpen] = useState(false);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
                render={
                    <Button className="cursor-pointer">
                    + New Course
                    </Button>
                }
            />
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Create Course</DialogTitle>

                    <DialogDescription>
                        Organize your study materials into courses.
                    </DialogDescription>
                </DialogHeader>

                <form
                    action={async (formData) => {
                        await createCourse(formData);
                        setOpen(false);
                    }}
                    className="space-y-4 py-4"
                >
                    <Input
                        name="title"
                        placeholder="Course title"
                        required
                    />
                    <Textarea
                        name="description"
                        placeholder="Description (optional)"
                    />

                    <DialogFooter>
                        <Button type="submit" className="cursor-pointer">
                            Create Course
                        </Button>
                    </DialogFooter>
                </form>

            </DialogContent>
        </Dialog>
    );
}