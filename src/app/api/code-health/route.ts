import { NextRequest, NextResponse } from "next/server";

import { getRepository, getRepositoryLanguages, getRepositoryTree } from "@/services/github.service";
import { scanRepositoryFiles } from "@/lib/codeScanner";
import { generateCodeHealth } from "@/services/codeHealth.service";

export async function POST(request: NextRequest) {

    try {

        const body = await request.json();

        const {
            owner,
            repo,
            branch,
        } = body;

        if (!owner || !repo) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Repository owner and name are required.",
                },
                { status: 400 }
            );
        }

        const repository = await getRepository(owner, repo);

        const selectedBranch =
            branch || repository.default_branch;

        const [languages, tree] = await Promise.all([
            getRepositoryLanguages(owner, repo),
            getRepositoryTree(owner, repo, selectedBranch),
        ]);

        const files = await scanRepositoryFiles(
            owner,
            repo,
            selectedBranch,
            tree
        );

        if (files.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: "No analyzable source files were found.",
                },
                { status: 422 }
            );
        }

        const { result, complete, analysisMeta } = await generateCodeHealth(
            repository.full_name,
            languages,
            files
        );

        return NextResponse.json({
            success: true,
            complete,
            codeHealth: result,
            analysisMeta,
            scannedFiles: files.map((file) => file.path),
            truncated: tree.truncated,
        });

    } catch (error) {

        console.error("Code Health error:", error);

        const errorMessage =
            error instanceof Error ? error.message : "Failed to analyze repository code.";

        const meta = (error as Record<string, unknown>)?.analysisMeta;

        const isProviderError =
            errorMessage.includes("AI provider") ||
            errorMessage.includes("rate-limit") ||
            errorMessage.includes("rate limit") ||
            errorMessage.includes("unavailable") ||
            errorMessage.includes("incomplete coverage");

        return NextResponse.json(
            {
                success: false,
                complete: false,
                error: isProviderError
                    ? "AI analysis is temporarily unavailable because all configured AI providers are rate-limited."
                    : errorMessage,
                analysisMeta: meta || null,
                isProviderUnavailable: isProviderError,
            },
            { status: isProviderError ? 503 : 500 }
        );
    }
}