import { NextRequest, NextResponse } from "next/server";
import { generateSummary } from "@/services/ai.service";
import { buildSummaryPrompt } from "@/lib/aiPrompts";


export async function POST(request : NextRequest) {
    
    try {

        const body = await request.json();
        
        const {
            repository,
            languages,
            contributors,
            readme,
            analysis,
        } = body;

        const prompt = buildSummaryPrompt(
            repository,
            languages,
            contributors,
            readme,
            analysis
        );

        const summary = await generateSummary(prompt);

        return NextResponse.json({
            success: true,
            summary,
        });
        
    } catch (error) {

        console.error(error);

        return NextResponse.json(
            {
                success: false,
                error: "Failed to generate AI response.",
            },
            {
                status: 500,
            }
        );
        
    }

}