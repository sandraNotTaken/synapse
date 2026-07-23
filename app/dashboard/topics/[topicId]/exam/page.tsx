import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import TopicExamClient from "@/components/dashboard/topic-exam-client";

interface Props {
  params: Promise<{
    topicId: string;
  }>;
}

export default async function TopicExamPage({ params }: Props) {
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
    <TopicExamClient
      topicId={topic.id}
      topicTitle={topic.title}
      courseTitle={topic.course.title}
      courseColor={topic.course.color}
    />
  );
}
