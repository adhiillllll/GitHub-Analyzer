import Groq from "groq-sdk";
import OpenAI from "openai";
import { z } from "zod";
import { CodeHealthResult } from "@/types/codeHealth";
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
});

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

const openrouter = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY || "",
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

function tryParseJson<T = unknown>(str: string): T | null {
    if (!str || typeof str !== "string") return null;
    const s = str.trim();
    if (!s.startsWith("{") && !s.startsWith("[")) return null;

    try {
        const obj = JSON.parse(s);
        if (obj && typeof obj === "object") {
            return obj as T;
        }
    } catch {
        try {
            const sanitized = s.replace(/,\s*([}\]])/g, "$1");
            const obj = JSON.parse(sanitized);
            if (obj && typeof obj === "object") {
                return obj as T;
            }
        } catch {
            return null;
        }
    }
    return null;
}

function extractAndParseJson<T = unknown>(text: string): T {
    if (!text || typeof text !== "string") {
        throw new Error("Empty or invalid content provided for JSON extraction.");
    }

    let cleaned = text.trim();
    cleaned = cleaned.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();

    // Strategy 1: Direct JSON parse
    const directParse = tryParseJson<T>(cleaned);
    if (directParse) return directParse;

    // Strategy 2: Extract from ```json ... ``` or ``` ... ``` fences
    const fenceRegex = /```(?:json)?\s*([\s\S]*?)\s*```/gi;
    let fenceMatch: RegExpExecArray | null;
    while ((fenceMatch = fenceRegex.exec(cleaned)) !== null) {
        if (fenceMatch[1]) {
            const parsed = tryParseJson<T>(fenceMatch[1]);
            if (parsed) return parsed;
        }
    }

    // Strategy 3: Find balanced top-level JSON objects { ... }
    const balancedObjects: string[] = [];
    let depth = 0;
    let startIndex = -1;

    for (let i = 0; i < cleaned.length; i++) {
        const char = cleaned[i];
        if (char === "{") {
            if (depth === 0) {
                startIndex = i;
            }
            depth++;
        } else if (char === "}") {
            if (depth > 0) {
                depth--;
                if (depth === 0 && startIndex !== -1) {
                    balancedObjects.push(cleaned.slice(startIndex, i + 1));
                    startIndex = -1;
                }
            }
        }
    }

    balancedObjects.sort((a, b) => b.length - a.length);
    for (const block of balancedObjects) {
        const parsed = tryParseJson<T>(block);
        if (parsed) return parsed;
    }

    // Strategy 4: Fallback substring between first '{' and last '}'
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        const substring = cleaned.slice(firstBrace, lastBrace + 1);
        const parsed = tryParseJson<T>(substring);
        if (parsed) return parsed;
    }

    throw new Error("Failed to extract valid JSON object from model response.");
}

function isRateLimitError(err: unknown): boolean {
    if (!err || typeof err !== "object") return false;
    const e = err as Record<string, unknown>;

    if (e.status === 429 || e.statusCode === 429) return true;
    if (e.code === "rate_limit_exceeded" || e.code === 429) return true;

    const nestedError = e.error && typeof e.error === "object" ? (e.error as Record<string, unknown>).error : null;
    if (nestedError && typeof nestedError === "object") {
        const ne = nestedError as Record<string, unknown>;
        if (ne.code === "rate_limit_exceeded" || ne.type === "tokens" || ne.code === 429) return true;
    }

    const msg = String(e.message || "").toLowerCase();
    if (
        msg.includes("429") ||
        msg.includes("rate limit") ||
        msg.includes("rate_limit") ||
        msg.includes("quota") ||
        msg.includes("tokens per day") ||
        msg.includes("tpd") ||
        msg.includes("free models per day") ||
        msg.includes("rate-limited")
    ) {
        return true;
    }

    return false;
}

function is400InvalidRequestError(err: unknown): boolean {
    if (!err || typeof err !== "object") return false;
    const e = err as Record<string, unknown>;

    if (e.status === 400 || e.statusCode === 400) return true;

    const msg = String(e.message || "").toLowerCase();
    if (
        msg.includes("400") ||
        msg.includes("invalid_request_error") ||
        msg.includes("json_validate_failed") ||
        msg.includes("unsupported parameter") ||
        msg.includes("failed to validate json")
    ) {
        return true;
    }

    return false;
}

function isNetworkOrServerError(err: unknown): boolean {
    if (!err || typeof err !== "object") return false;
    const e = err as Record<string, unknown>;

    const status = (e.status || e.statusCode) as number | undefined;
    if (status && status >= 500 && status < 600) return true;

    const code = String(e.code || "");
    if (["ECONNRESET", "ETIMEDOUT", "ENOTFOUND", "ECONNREFUSED", "FETCH_ERROR"].includes(code)) return true;

    const msg = String(e.message || "").toLowerCase();
    if (msg.includes("network") || msg.includes("timeout") || msg.includes("fetch failed") || msg.includes("503") || msg.includes("500") || msg.includes("502")) {
        return true;
    }

    return false;
}

function parseRetryAfterMs(err: unknown): number | null {
    if (!err || typeof err !== "object") return null;
    const e = err as Record<string, unknown>;

    const headers = (e.headers || (e.response as Record<string, unknown> | undefined)?.headers) as Record<string, unknown> | undefined;
    if (headers) {
        const retryAfter = headers["retry-after"] || headers["Retry-After"] || headers["x-ratelimit-reset-requests"] || headers["x-ratelimit-reset-tokens"];
        if (retryAfter) {
            const val = String(retryAfter).trim();
            if (!isNaN(Number(val))) return Number(val) * 1000;
            if (val.endsWith("s")) {
                const secs = parseFloat(val.slice(0, -1));
                if (!isNaN(secs)) return secs * 1000;
            }
            if (val.endsWith("m")) {
                const mins = parseFloat(val.slice(0, -1));
                if (!isNaN(mins)) return mins * 60 * 1000;
            }
        }
    }

    const msg = String(e.message || "");
    const match = msg.match(/(?:retry after|reset in|wait|try again in)\s+([\d.]+)\s*(s|m|seconds|minutes)?/i);
    if (match) {
        const num = parseFloat(match[1]);
        const unit = (match[2] || "s").toLowerCase();
        if (!isNaN(num)) {
            if (unit.startsWith("m")) return num * 60 * 1000;
            return num * 1000;
        }
    }

    return null;
}


class CircuitBreakerManager {
    private cooldowns = new Map<string, number>();
    private loggedCooldowns = new Set<string>();

    isAvailable(candidateKey: string): boolean {
        const resetAt = this.cooldowns.get(candidateKey);
        if (!resetAt) return true;
        if (Date.now() >= resetAt) {
            this.cooldowns.delete(candidateKey);
            this.loggedCooldowns.delete(candidateKey);
            return true;
        }
        return false;
    }

    markCooldown(candidateKey: string, providerName: string, err: unknown) {
        const cooldownMs = parseRetryAfterMs(err) || 60_000;
        const resetAt = Date.now() + cooldownMs;
        this.cooldowns.set(candidateKey, resetAt);

        if (!this.loggedCooldowns.has(candidateKey)) {
            this.loggedCooldowns.add(candidateKey);
            const secs = Math.ceil(cooldownMs / 1000);
            console.log(`Code Health: ${providerName} rate-limited; cooldown ${secs}s`);
        }
    }
}

const globalCircuitBreaker = new CircuitBreakerManager();


type ProviderCandidate = {
    key: string;
    label: string;
    providerName: string;
    providerType: "Groq" | "OpenRouter";
    model: string;
    supportsReasoningEffort?: boolean;
};

async function callProviderApi(
    candidate: ProviderCandidate,
    messages: Array<{ role: "system" | "user" | "assistant"; content: string }>,
    temperature: number,
    maxTokens: number,
    reasoningEffort?: "low" | "medium" | "high"
): Promise<string> {
    if (candidate.providerType === "Groq") {
        type GroqCreateParams = Parameters<typeof client.chat.completions.create>[0];
        const reqBody: GroqCreateParams = {
            model: candidate.model,
            messages: messages as GroqCreateParams["messages"],
            temperature,
            max_completion_tokens: maxTokens,
            response_format: { type: "json_object" },
        };

        if (candidate.supportsReasoningEffort && reasoningEffort) {
            reqBody.reasoning_effort = reasoningEffort;
        }

        const res = (await client.chat.completions.create(reqBody)) as Groq.Chat.Completions.ChatCompletion;
        return res.choices[0]?.message?.content || "";
    } else {
        type OpenRouterCreateParams = Parameters<typeof openrouter.chat.completions.create>[0];
        const reqBody: OpenRouterCreateParams = {
            model: candidate.model,
            messages: messages as OpenRouterCreateParams["messages"],
            temperature,
            max_tokens: Math.max(maxTokens, 3000),
            response_format: { type: "json_object" },
        };

        try {
            const res = await openrouter.chat.completions.create(reqBody);
            const resObj = res as unknown as { choices?: Array<{ message?: { content?: string | null } }> };
            return resObj.choices?.[0]?.message?.content || "";
        } catch (err: unknown) {
            if (is400InvalidRequestError(err) && reqBody.response_format) {
                delete reqBody.response_format;
                const res = await openrouter.chat.completions.create(reqBody);
                const resObj = res as unknown as { choices?: Array<{ message?: { content?: string | null } }> };
                return resObj.choices?.[0]?.message?.content || "";
            }
            throw err;
        }
    }
}


type ExecutionOptions<T> = {
    candidates: ProviderCandidate[];
    prompt: string;
    schema: z.ZodSchema<T>;
    maxTokens: number;
    temperature?: number;
    reasoningEffort?: "low" | "medium" | "high";
    contextLabel: string;
    providerStats?: Record<string, number>;
};

async function executeProviderChain<T>(
    options: ExecutionOptions<T>
): Promise<{ result: T; modelName: string } | null> {
    const {
        candidates,
        prompt,
        schema,
        maxTokens,
        temperature = 0,
        reasoningEffort,
        contextLabel,
        providerStats,
    } = options;

    for (const candidate of candidates) {
        if (!globalCircuitBreaker.isAvailable(candidate.key)) {
            continue;
        }

        const messages = [
            {
                role: "system" as const,
                content:
                    "You are a precise senior software engineer. Return ONLY valid raw JSON.",
            },
            {
                role: "user" as const,
                content: prompt,
            },
        ];

        let responseContent: string | null = null;

        try {
            responseContent = await callProviderApi(
                candidate,
                messages,
                temperature,
                maxTokens,
                reasoningEffort
            );
        } catch (err: unknown) {
            if (isRateLimitError(err)) {
                globalCircuitBreaker.markCooldown(candidate.key, candidate.providerName, err);
                continue;
            }

            if (is400InvalidRequestError(err)) {
                console.log(
                    `Code Health: ${contextLabel} ${candidate.label} 400 error, trying next provider`
                );
                continue;
            }

            if (isNetworkOrServerError(err)) {
                await new Promise((r) => setTimeout(r, 500 + Math.random() * 200));
                try {
                    responseContent = await callProviderApi(
                        candidate,
                        messages,
                        temperature,
                        maxTokens,
                        reasoningEffort
                    );
                } catch (retryErr: unknown) {
                    if (isRateLimitError(retryErr)) {
                        globalCircuitBreaker.markCooldown(candidate.key, candidate.providerName, retryErr);
                    }
                    continue;
                }
            } else {
                continue;
            }
        }

        if (responseContent && responseContent.trim()) {
            try {
                const parsed = extractAndParseJson(responseContent);
                const validated = schema.parse(parsed);

                if (providerStats) {
                    const statsKey = candidate.providerName;
                    providerStats[statsKey] = (providerStats[statsKey] || 0) + 1;
                }

                return { result: validated, modelName: candidate.model };
            } catch (valErr: unknown) {
                const errDetail = valErr instanceof Error ? valErr.message : String(valErr);
                console.log(
                    `Code Health: ${contextLabel} ${candidate.label} returned invalid JSON/output, retrying once`
                );

                const repairMessages = [
                    ...messages,
                    {
                        role: "assistant" as const,
                        content: responseContent,
                    },
                    {
                        role: "user" as const,
                        content: `CRITICAL INSTRUCTION: Your previous output failed schema validation with error: ${errDetail}. You MUST return ONLY valid JSON matching the exact required schema structure. All required keys must be present. Do NOT include markdown code blocks or explanatory prose outside the JSON object.`,
                    },
                ];

                try {
                    const repairContent = await callProviderApi(
                        candidate,
                        repairMessages,
                        temperature,
                        maxTokens,
                        reasoningEffort
                    );

                    if (repairContent && repairContent.trim()) {
                        const repairParsed = extractAndParseJson(repairContent);
                        const repairValidated = schema.parse(repairParsed);

                        if (providerStats) {
                            const statsKey = candidate.providerName;
                            providerStats[statsKey] = (providerStats[statsKey] || 0) + 1;
                        }

                        return { result: repairValidated, modelName: candidate.model };
                    }
                } catch (repairErr: unknown) {
                    if (isRateLimitError(repairErr)) {
                        globalCircuitBreaker.markCooldown(candidate.key, candidate.providerName, repairErr);
                    }
                }
            }
        }
    }

    return null;
}


async function processWithConcurrency<T, R>(
    items: T[],
    concurrencyLimit: number,
    fn: (item: T, index: number) => Promise<R>
): Promise<R[]> {
    const results: R[] = new Array(items.length);
    let currentIndex = 0;

    async function worker() {
        while (currentIndex < items.length) {
            const index = currentIndex++;
            results[index] = await fn(items[index], index);
        }
    }

    const workers: Promise<void>[] = [];
    for (let i = 0; i < Math.min(concurrencyLimit, items.length); i++) {
        workers.push(worker());
    }

    await Promise.all(workers);
    return results;
}


export async function generateCodeHealth(
    repositoryName: string,
    languages: Record<string, number>,
    files: ScannedFile[]
): Promise<CodeHealthResult> {

    const primaryCodeModel = process.env.GROQ_CODE_MODEL || "openai/gpt-oss-20b";
    const openrouterCodeFallbackModel =
        process.env.OPENROUTER_CODE_FALLBACK_MODEL || "cohere/north-mini-code:free";
    const openrouterCodeRouterModel =
        process.env.OPENROUTER_CODE_ROUTER_MODEL || "openrouter/free";
    const fallbackCodeModel = process.env.GROQ_CODE_FALLBACK_MODEL || "groq/compound-mini";

    const primarySynthesisModel = process.env.GROQ_SYNTHESIS_MODEL || "openai/gpt-oss-120b";
    const fallbackSynthesisModel = process.env.GROQ_SYNTHESIS_FALLBACK_MODEL || "groq/compound-mini";

    const codeCandidates: ProviderCandidate[] = [
        {
            key: `Groq:${primaryCodeModel}`,
            label: `Groq primary (${primaryCodeModel})`,
            providerName: "Groq primary",
            providerType: "Groq",
            model: primaryCodeModel,
            supportsReasoningEffort: true,
        },
    ];

    if (openrouterCodeFallbackModel && process.env.OPENROUTER_API_KEY) {
        codeCandidates.push({
            key: `OpenRouter:${openrouterCodeFallbackModel}`,
            label: `OpenRouter coding fallback (${openrouterCodeFallbackModel})`,
            providerName: "OpenRouter coding fallback",
            providerType: "OpenRouter",
            model: openrouterCodeFallbackModel,
            supportsReasoningEffort: false,
        });
    }

    if (
        openrouterCodeRouterModel &&
        process.env.OPENROUTER_API_KEY &&
        openrouterCodeRouterModel !== openrouterCodeFallbackModel
    ) {
        codeCandidates.push({
            key: `OpenRouter:${openrouterCodeRouterModel}`,
            label: `OpenRouter free router (${openrouterCodeRouterModel})`,
            providerName: "OpenRouter free router",
            providerType: "OpenRouter",
            model: openrouterCodeRouterModel,
            supportsReasoningEffort: false,
        });
    }

    if (fallbackCodeModel && fallbackCodeModel !== primaryCodeModel) {
        codeCandidates.push({
            key: `Groq:${fallbackCodeModel}`,
            label: `Groq Compound fallback (${fallbackCodeModel})`,
            providerName: "Groq Compound fallback",
            providerType: "Groq",
            model: fallbackCodeModel,
            supportsReasoningEffort: false,
        });
    }

    const chunks = chunkCodeFiles(files);

    if (chunks.length === 0) {
        throw new Error("No code chunks available for analysis.");
    }

    console.log(
        `Code Health: ${files.length} files → ${chunks.length} chunks`
    );
    console.log(`Code Health: concurrency 2`);

    const providerStats: Record<string, number> = {};

    const rawChunkResults = await processWithConcurrency(
        chunks,
        2,
        async (chunk, i) => {
            const prompt = buildCodeHealthChunkPrompt({
                repositoryName,
                chunkIndex: i + 1,
                totalChunks: chunks.length,
                files: chunk.map((file) => ({
                    path: file.path,
                    content: file.content,
                })),
            });

            const execRes = await executeProviderChain({
                candidates: codeCandidates,
                prompt,
                schema: chunkObservationSchema,
                maxTokens: 600,
                temperature: 0,
                reasoningEffort: "low",
                contextLabel: `chunk ${i + 1}`,
                providerStats,
            });

            return execRes ? execRes.result : null;
        }
    );

    const chunkResults = rawChunkResults.filter(
        (res): res is z.infer<typeof chunkObservationSchema> => res !== null
    );

    const skippedCount = chunks.length - chunkResults.length;

    console.log(
        `Code Health: ${chunkResults.length}/${chunks.length} chunks successful`
    );

    if (chunkResults.length === 0) {
        throw new Error("AI provider rate limit: All AI models are currently rate-limited or unavailable. Please try again in a few moments.");
    }


    let groupResults: unknown[];

    if (chunkResults.length <= 8) {
        console.log(
            `Code Health: skipping group synthesis (${chunkResults.length} chunks)`
        );
        groupResults = chunkResults;
    } else {
        const groups = splitIntoGroups(chunkResults, 4);

        console.log(
            `Code Health: synthesizing ${groups.length} groups`
        );

        groupResults = [];
        let groupFailed = false;

        for (let i = 0; i < groups.length; i++) {
            const groupPrompt = buildCodeHealthGroupPrompt({
                repositoryName,
                chunkResults: groups[i],
            });

            const groupRes = await executeProviderChain({
                candidates: codeCandidates,
                prompt: groupPrompt,
                schema: groupObservationSchema,
                maxTokens: 700,
                temperature: 0,
                reasoningEffort: "low",
                contextLabel: `group ${i + 1}/${groups.length}`,
                providerStats,
            });

            if (!groupRes) {
                console.log(
                    `Code Health: group ${i + 1} synthesis failed on available providers, falling back to direct chunk observations.`
                );
                groupFailed = true;
                break;
            }

            groupResults.push(groupRes.result);
        }

        if (groupFailed || groupResults.length === 0) {
            groupResults = chunkResults;
        }
    }


    const synthesisCandidates: ProviderCandidate[] = [
        {
            key: `Groq:${primarySynthesisModel}`,
            label: `Groq synthesis primary (${primarySynthesisModel})`,
            providerName: "Groq primary",
            providerType: "Groq",
            model: primarySynthesisModel,
            supportsReasoningEffort: true,
        },
    ];

    if (openrouterCodeFallbackModel && process.env.OPENROUTER_API_KEY) {
        synthesisCandidates.push({
            key: `OpenRouter:${openrouterCodeFallbackModel}`,
            label: `OpenRouter synthesis fallback (${openrouterCodeFallbackModel})`,
            providerName: "OpenRouter coding fallback",
            providerType: "OpenRouter",
            model: openrouterCodeFallbackModel,
            supportsReasoningEffort: false,
        });
    }

    if (fallbackSynthesisModel && fallbackSynthesisModel !== primarySynthesisModel) {
        synthesisCandidates.push({
            key: `Groq:${fallbackSynthesisModel}`,
            label: `Groq synthesis fallback (${fallbackSynthesisModel})`,
            providerName: "Groq Compound fallback",
            providerType: "Groq",
            model: fallbackSynthesisModel,
            supportsReasoningEffort: false,
        });
    }

    console.log(`Code Health: final synthesis`);

    const finalSynthesisPrompt = buildCodeHealthSynthesisPrompt({
        repositoryName,
        chunkResults: groupResults,
    });

    const finalRes = await executeProviderChain({
        candidates: synthesisCandidates,
        prompt: finalSynthesisPrompt,
        schema: codeHealthSchema,
        maxTokens: 2000,
        temperature: 0,
        reasoningEffort: "medium",
        contextLabel: "final synthesis",
        providerStats,
    });

    if (!finalRes) {
        throw new Error("Code Health: final synthesis failed on all available providers.");
    }

    console.log("\nCode Health provider summary:");
    console.log(`- Groq primary: ${providerStats["Groq primary"] || 0} successful`);
    console.log(`- OpenRouter coding fallback: ${providerStats["OpenRouter coding fallback"] || 0} successful`);
    console.log(`- OpenRouter free router: ${providerStats["OpenRouter free router"] || 0} successful`);
    console.log(`- Groq Compound fallback: ${providerStats["Groq Compound fallback"] || 0} successful`);
    console.log(`- Skipped: ${skippedCount}`);
    console.log(`- Total chunks: ${chunks.length}\n`);

    return finalRes.result;
}