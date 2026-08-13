import { NextResponse } from "next/server";

import { getRepositoryTree } from "@/services/github.service";
import { scanRepositoryFiles } from "@/lib/codeScanner";

export async function GET() {

    const owner = "facebook";
    const repo = "react";
    const branch = "main";

    try {

        const tree = await getRepositoryTree(
            owner,
            repo,
            branch
        );

        const files = await scanRepositoryFiles(
            owner,
            repo,
            branch,
            tree
        );

        return NextResponse.json({
            success: true,
            truncated: tree.truncated,
            fileCount: files.length,
            files: files.map((file) => ({
                path: file.path,
                size: file.size,
            })),
        });

    } catch (error) {

        console.error(error);

        return NextResponse.json(
            {
                success: false,
                error: "Failed to scan repository.",
            },
            {
                status: 500,
            }
        );
    }
}