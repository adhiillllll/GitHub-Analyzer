import Groq from "groq-sdk";
import { z } from "zod";
import { CodeHealthResult, } from "@/types/codeHealth";
import { ScannedFile } from "@/lib/codeScanner";
import { chunkCodeFiles } from "@/lib/codeHealthChunker";
import { buildCodeHealthSynthesisPrompt } from "@/lib/codeHealthSynthesisPrompt";
import { buildCodeHealthGroupPrompt } from "@/lib/codeHealthGroupPrompt";
import { buildCodeHealthChunkPrompt } from "@/lib/codeHealthChunkPrompt";


const chunkObservationSchema = z.object({
    observations: z.array(
        z.object({
            category: z.enum([
                "architecture",
                "maintainability",
                "codeQuality",
                "testing",
                "security",
                "typeSafety",
                "documentation",
            ]),
            finding: z.string(),
            severity: z.enum(["high", "medium", "low"]),
            files: z.array(z.string()),
        })
    ),
})

const groupObservationSchema = z.object({
    observations: z.array(
        z.object({
            category: z.enum([
                "architecture",
                "maintainability",
                "codeQuality",
                "testing",
                "security",
                "typeSafety",
                "documentation",
            ]),
            finding: z.string(),
            severity: z.enum(["high", "medium", "low"]),
            files: z.array(z.string()),
        })
    ),
});


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


function splitIntoGroups<T>(
    items: T[],
    groupSize: number
): T[][] {
    const groups: T[][] = [];

    for (let i = 0; i < items.length; i += groupSize) {
        groups.push(items.slice(i, i + groupSize));
    }

    return groups;
}


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

        const prompt = buildCodeHealthChunkPrompt({
            repositoryName,
            chunkIndex: i + 1,
            totalChunks: chunks.length,
            files: chunk.map((file) => ({
                path: file.path,
                content: file.content,
            })),
        });

        const response = await client.chat.completions.create({
            model:
                process.env.GROQ_CODE_MODEL ||
                "openai/gpt-oss-20b",

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

            reasoning_effort: "low",

            response_format: {
                type: "json_object",
            },

            max_completion_tokens: 600,
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
            chunkObservationSchema.parse(parsed);

        chunkResults.push(validated);
    }


    let groupResults: unknown[];

    if (chunkResults.length <= 4) {

        console.log(
            `Code Health: skipping group synthesis (${chunkResults.length} chunks)`
        );

        groupResults = chunkResults;
    } else {

        const groups = splitIntoGroups(chunkResults, 4);

        console.log(
            `Code Health: synthesizing ${groups.length} analysis groups`
        );

        groupResults = [];

        for (let i = 0; i < groups.length; i++) {
            console.log(
                `Code Health: synthesizing group ${i + 1}/${groups.length}`
            );

            const groupPrompt = buildCodeHealthGroupPrompt({
                repositoryName,
                chunkResults: groups[i],
            });

            const response =
                await client.chat.completions.create({
                    model:
                        process.env.GROQ_CODE_MODEL ||
                        "openai/gpt-oss-20b",

                    messages: [
                        {
                            role: "system",
                            content:
                                "You are a precise senior software engineer. Return only valid JSON.",
                        },
                        {
                            role: "user",
                            content: groupPrompt,
                        },
                    ],

                    temperature: 0,

                    reasoning_effort: "low",

                    response_format: {
                        type: "json_object",
                    },

                    max_completion_tokens: 700,
                });

            const content =
                response.choices[0]?.message?.content;

            if (!content) {
                throw new Error(
                    `Groq returned an empty group synthesis response for group ${i + 1}.`
                );
            }

            let parsed: unknown;

            try {
                parsed = JSON.parse(content);
            } catch {
                throw new Error(
                    `Groq returned invalid JSON for group ${i + 1}.`
                );
            }

            const validated =
                groupObservationSchema.parse(parsed);

            groupResults.push(validated);
        }
    }



    console.log(
        `Code Health: compacting ${chunkResults.length} chunk results for synthesis`
    );

    const finalSynthesisPrompt =
        buildCodeHealthSynthesisPrompt({
            repositoryName,
            chunkResults: groupResults,
        });

    const finalResponse =
        await client.chat.completions.create({
            model:
                process.env.GROQ_SYNTHESIS_MODEL ||
                "openai/gpt-oss-120b",

            messages: [
                {
                    role: "system",
                    content:
                        "You are a precise senior software engineer. Return only valid JSON.",
                },
                {
                    role: "user",
                    content: finalSynthesisPrompt,
                },
            ],

            temperature: 0,

            reasoning_effort: "medium",

            response_format: {
                type: "json_object",
            },

            max_completion_tokens: 2000,
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