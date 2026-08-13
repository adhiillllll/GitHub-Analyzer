import { NextRequest, NextResponse } from "next/server";

import {
  getRepository,
  getRepositoryLanguages,
  getRepositoryContributors,
  getRepositoryReadme,
} from "@/services/github.service";

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

    return NextResponse.json({
      success: true,
      repository,
      languages,
      contributors,
      readme,
    });
  } catch (error) {
    console.error("GitHub API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch repository data.",
      },
      { status: 500 }
    );
  }
}