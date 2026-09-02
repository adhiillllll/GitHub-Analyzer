import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import { request } from "node:https";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

function fetchWithIpv4(input: RequestInfo | URL, init: RequestInit = {}) {
    return new Promise<Response>((resolve, reject) => {
        const url = new URL(input.toString());
        const headers = init.headers
            ? Object.fromEntries(new Headers(init.headers).entries())
            : undefined;

        const req = request(
            url,
            {
                method: init.method ?? "GET",
                headers,
                family: 4,
                timeout: 15000,
            },
            (res) => {
                const chunks: Buffer[] = [];

                res.on("data", (chunk: Buffer) => {
                    chunks.push(chunk);
                });

                res.on("end", () => {
                    resolve(
                        new Response(Buffer.concat(chunks), {
                            status: res.statusCode ?? 200,
                            statusText: res.statusMessage,
                            headers: res.headers as HeadersInit,
                        })
                    );
                });
            }
        );

        req.on("timeout", () => {
            req.destroy(new Error("Neon HTTPS request timed out"));
        });
        req.on("error", reject);

        if (init.body) {
            req.write(init.body as string | Buffer | Uint8Array);
        }

        req.end();
    });
}

neonConfig.poolQueryViaFetch = true;
neonConfig.fetchFunction = fetchWithIpv4;
neonConfig.webSocketConstructor = require("ws");

const databaseUrl = new URL(process.env.DATABASE_URL!);
databaseUrl.searchParams.delete("sslmode");
databaseUrl.searchParams.delete("channel_binding");

const adapter = new PrismaNeon({
    connectionString: databaseUrl.toString(),
});

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        adapter,
    });

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}
