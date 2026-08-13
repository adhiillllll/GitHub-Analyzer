import { ScannedFile } from "@/lib/codeScanner";

const MAX_CHUNK_CHARS = 7_000;

export function chunkCodeFiles(
    files: ScannedFile[]
): ScannedFile[][] {

    const chunks: ScannedFile[][] = [];
    let currentChunk: ScannedFile[] = [];
    let currentSize = 0;

    for (const file of files) {

        const fileSize = file.content.length;

        // If one file is larger than the chunk limit,
        // keep it in its own chunk.
        if (
            currentChunk.length > 0 &&
            currentSize + fileSize > MAX_CHUNK_CHARS
        ) {
            chunks.push(currentChunk);

            currentChunk = [];
            currentSize = 0;
        }

        currentChunk.push(file);
        currentSize += fileSize;
    }

    if (currentChunk.length > 0) {
        chunks.push(currentChunk);
    }

    return chunks;
}