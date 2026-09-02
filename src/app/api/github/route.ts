import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

import {
  getRepository,
  getRepositoryLanguages,
  getRepositoryContributors,
  getRepositoryReadme,
} from "@/services/github.service";
import { getCurrentUserId } from "@/lib/currentUser";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { owner, repo } = await request.json();

    if (!owner || !repo) {
      return NextResponse.json(
        {
          success: false,
          error: "Owner and repository are required.",
        },
        { status: 400 }
      );
    }

    const [repository, languages, contributors] =
      await Promise.all([
        getRepository(owner, repo),
        getRepositoryLanguages(owner, repo),
        getRepositoryContributors(owner, repo),
      ]);

    let readme = "";

    try {
      const readmeData = await getRepositoryReadme(owner, repo);
      readme = readmeData.content;
    } catch {
      console.log("Repository has no README.");
    }

    const userId = await getCurrentUserId();

    if (userId) {
      const [repoOwner] = repository.full_name.split("/");

      const existingHistory = await prisma.searchHistory.findFirst({
        where: {
          userId,
          githubUrl: repository.html_url,
        },
      });

      if (existingHistory) {
        await prisma.searchHistory.update({
          where: { id: existingHistory.id },
          data: {
            owner: repoOwner,
            name: repository.name,
            fullName: repository.full_name,
            description: repository.description,
            stars: repository.stargazers_count,
            language: repository.language,
            createdAt: new Date(),
          },
        });
      } else {
        await prisma.searchHistory.create({
          data: {
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
      }
    }

    return NextResponse.json({
      success: true,
      repository,
      languages,
      contributors,
      readme,
    });
  } catch (error) {
    console.error("GitHub API error:", error);

    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 404) {
        return NextResponse.json(
          {
            success: false,
            error: "Repository not found. Please check the owner and repository name, or verify if it is a private repository.",
          },
          { status: 404 }
        );
      }
      if (status === 403 || status === 429) {
        return NextResponse.json(
          {
            success: false,
            error: "GitHub API rate limit exceeded or access forbidden. Please try again later.",
          },
          { status: 403 }
        );
      }
      if (status === 401) {
        return NextResponse.json(
          {
            success: false,
            error: "Unauthorized access to GitHub repository.",
          },
          { status: 401 }
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch repository data from GitHub. Please check the URL and try again.",
      },
      { status: 500 }
    );
  }
}

