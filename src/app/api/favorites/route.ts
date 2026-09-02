import { NextRequest, NextResponse } from "next/server";

import { getCurrentUserId } from "@/lib/currentUser";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const userId = await getCurrentUserId();

  if (!userId) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ success: true, favorites });
}

export async function POST(request: NextRequest) {
  const userId = await getCurrentUserId();

  if (!userId) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { repository } = await request.json();

  if (!repository?.html_url || !repository?.name || !repository?.full_name) {
    return NextResponse.json(
      { success: false, error: "Repository data is required." },
      { status: 400 }
    );
  }

  const [repoOwner] = repository.full_name.split("/");

  const favorite = await prisma.favorite.upsert({
    where: {
      userId_githubUrl: {
        userId,
        githubUrl: repository.html_url,
      },
    },
    update: {
      owner: repoOwner,
      name: repository.name,
      fullName: repository.full_name,
      description: repository.description,
      stars: repository.stargazers_count,
      language: repository.language,
    },
    create: {
      userId,
      owner: repoOwner,
      name: repository.name,
      fullName: repository.full_name,
      githubUrl: repository.html_url,
      description: repository.description,
      stars: repository.stargazers_count,
      language: repository.language,
    },
  });

  return NextResponse.json({ success: true, favorite });
}

export async function DELETE(request: NextRequest) {
  const userId = await getCurrentUserId();

  if (!userId) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { githubUrl } = await request.json();

  if (!githubUrl) {
    return NextResponse.json(
      { success: false, error: "Repository URL is required." },
      { status: 400 }
    );
  }

  await prisma.favorite.deleteMany({
    where: {
      userId,
      githubUrl,
    },
  });

  return NextResponse.json({ success: true });
}
