'use server';

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function getPRDs() {
  const { userId: clerkUserId } = await auth();

  if (!clerkUserId) {
    return null;
  }

  // Get the database user first
  const user = await db.user.findUnique({
    where: {
      clerkId: clerkUserId
    }
  });

  if (!user) {
    return null;
  }

  const prds = await db.pRD.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      updatedAt: 'desc'
    }
  });

  return { prds, user };
}
