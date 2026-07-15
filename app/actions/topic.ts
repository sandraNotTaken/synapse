"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateTopicContent(
  topicId: string,
  content: string
) {
  await prisma.topic.update({
    where: {
      id: topicId,
    },
    data: {
      content,
    },
  });

  revalidatePath(`/dashboard/topics/${topicId}`);
}