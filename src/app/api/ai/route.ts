import { NextResponse } from "next/server";
import { generateSummary } from "@/services/ai.service";


export async function POST() {
    
    try {

        const summary = await generateSummary();

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