import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function getCurrentUserId() {
  const session = await auth();

  if (session?.user?.id) {
    return session.user.id;
  }

  if (!session?.user?.email) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      id: true,
    },
  });

  return user?.id ?? null;
}
