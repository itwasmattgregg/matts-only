import type { User, Post } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Post } from "@prisma/client";

export function getPost({ id }: Pick<Post, "id">) {
  return prisma.post.findFirst({
    where: { id },
    include: {
      user: {
        select: {
          username: true,
        },
      },
    },
  });
}

export function getPostListItems() {
  return prisma.post.findMany({
    select: { id: true, body: true, user: { select: { username: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export function getUserPostListItems({ userId }: { userId: User["id"] }) {
  return prisma.post.findMany({
    where: { userId },
    select: { id: true, body: true },
    orderBy: { createdAt: "desc" },
  });
}

export function createPost({
  body,
  userId,
}: Pick<Post, "body"> & {
  userId: User["id"];
}) {
  return prisma.post.create({
    data: {
      body,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export function deletePost({
  id,
  userId,
}: Pick<Post, "id"> & { userId: User["id"] }) {
  return prisma.post.deleteMany({
    where: { id, userId },
  });
}
