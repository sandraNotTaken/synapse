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

export function NewCourseDialog() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    + New Course
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Create Course</DialogTitle>

                    <DialogDescription>
                        Organize your study materials into courses.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <Input
                        placeholder="Course title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <Textarea
                        placeholder="Description (optional)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <DialogFooter>
                    <Button>
                        Create Course
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}