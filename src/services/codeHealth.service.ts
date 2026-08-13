import Groq from "groq-sdk";
import { z } from "zod";
import { CodeHealthResult, } from "@/types/codeHealth";
import { ScannedFile } from "@/lib/codeScanner";
import { chunkCodeFiles } from "@/lib/codeHealthChunker";
import { buildCodeHealthPrompt } from "@/lib/codeHealthPrompt";
import { buildCodeHealthSynthesisPrompt } from "@/lib/codeHealthSynthesisPrompt";


const codeHealthSchema = z.object({
    overallScore: z.number().min(0).max(100),

    categories: z.object({
        architecture: z.object({
            score: z.number().min(0).max(100),
            summary: z.string(),
        }),

        maintainability: z.object({
            score: z.number().min(0).max(100),
            summary: z.string(),
        }),

        codeQuality: z.object({
            score: z.number().min(0).max(100),
            summary: z.string(),
        }),

        testing: z.object({
            score: z.number().min(0).max(100),
            summary: z.string(),
        }),

        security: z.object({
            score: z.number().min(0).max(100),
            summary: z.string(),
        }),

        typeSafety: z.object({
            score: z.number().min(0).max(100),
            summary: z.string(),
        }),

        documentation: z.object({
            score: z.number().min(0).max(100),
            summary: z.string(),
        }),
    }),

    strengths: z.array(z.string()),

    issues: z.array(
        z.object({
            severity: z.enum(["high", "medium", "low"]),
            title: z.string(),
            description: z.string(),
            files: z.array(z.string()).optional(),
        })
    ),

    recommendations: z.array(
        z.object({
            priority: z.enum(["high", "medium", "low"]),
            title: z.string(),
            description: z.string(),
        })
    ),
});


const client = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function generateCodeHealth(
    repositoryName: string,
    languages: Record<string, number>,
    files: ScannedFile[]
): Promise<CodeHealthResult> {

    const chunks = chunkCodeFiles(files);

    if (chunks.length === 0) {
        throw new Error("No code chunks available for analysis.");
    }

    console.log(
        `Code Health: analyzing ${files.length} files in ${chunks.length} chunks`
    );

    const chunkResults: unknown[] = [];

    for (let i = 0; i < chunks.length; i++) {

        const chunk = chunks[i];

        console.log(
            `Code Health: analyzing chunk ${i + 1}/${chunks.length}`
        );

        const prompt = buildCodeHealthPrompt({
            repositoryName,
            languages,
            files: chunk,
        });

        const response = await client.chat.completions.create({

            model:
                process.env.GROQ_MODEL ||
                "openai/gpt-oss-120b",

            messages: [
                {
                    role: "system",
                    content:
                        "You are a precise senior software engineer. Return only valid JSON.",
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],

            temperature: 0,

            response_format: {
                type: "json_object",
            },

            max_tokens: 1200,
        });

        const content =
            response.choices[0]?.message?.content;

        if (!content) {
            throw new Error(
                `Groq returned an empty response for chunk ${i + 1}.`
            );
        }

        let parsed: unknown;

        try {
            parsed = JSON.parse(content);
        } catch {
            throw new Error(
                `Groq returned invalid JSON for chunk ${i + 1}.`
            );
        }

        const validated =
            codeHealthSchema.parse(parsed);

        chunkResults.push(validated);
    }

    console.log(
        "Code Health: synthesizing final result"
    );

    const synthesisPrompt =
        buildCodeHealthSynthesisPrompt({
            repositoryName,
            chunkResults,
        });

    const finalResponse =
        await client.chat.completions.create({

            model:
                process.env.GROQ_MODEL ||
                "openai/gpt-oss-120b",

            messages: [
                {
                    role: "system",
                    content:
                        "You are a precise senior software engineer. Return only valid JSON.",
                },
                {
                    role: "user",
                    content: synthesisPrompt,
                },
            ],

            temperature: 0,

            response_format: {
                type: "json_object",
            },

            max_tokens: 1500,
        });

    const finalContent =
        finalResponse.choices[0]?.message?.content;

    if (!finalContent) {
        throw new Error(
            "Groq returned an empty synthesis response."
        );
    }

    let finalParsed: unknown;

    try {
        finalParsed = JSON.parse(finalContent);
    } catch {
        throw new Error(
            "Groq returned invalid JSON for synthesis."
        );
    }

    const finalResult =
        codeHealthSchema.parse(finalParsed);

    return finalResult;
}