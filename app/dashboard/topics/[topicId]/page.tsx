import { redirect } from "next/navigation";
import TopicWorkspace from "@/components/dashboard/topic-workspace";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

interface Props {
  params: Promise<{
    topicId: string;
  }>;
}

export default async function TopicPage({ params }: Props) {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const { topicId } = await params;

  const topic = await prisma.topic.findFirst({
    where: {
      id: topicId,
      course: {
        user: {
          email: session.user.email,
        },
      },
    },
    include: {
      course: true,
    },
  });

  if (!topic) {
    redirect("/dashboard");
  }

  return (
    <TopicWorkspace
      topicId={topic.id}
      initialContent={topic.content ?? ""}
      topicTitle={topic.title}
      courseId={topic.courseId}
      courseTitle={topic.course.title}
    />
  );
}