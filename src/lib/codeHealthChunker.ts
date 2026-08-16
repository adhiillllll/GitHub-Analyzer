import { ScannedFile } from "@/lib/codeScanner";

const MAX_CHUNK_CHARS = 2_500;

export function chunkCodeFiles(
    files: ScannedFile[]
): ScannedFile[][] {

    const chunks: ScannedFile[][] = [];

    let currentChunk: ScannedFile[] = [];
    let currentSize = 0;

    for (const file of files) {

        const content = file.content;

        
        if (
            content.length <= MAX_CHUNK_CHARS &&
            currentSize + content.length <= MAX_CHUNK_CHARS
        ) {
            currentChunk.push(file);
            currentSize += content.length;
            continue;
        }

        
        if (currentChunk.length > 0) {
            chunks.push(currentChunk);
            currentChunk = [];
            currentSize = 0;
        }

        
        if (content.length > MAX_CHUNK_CHARS) {

            for (
                let start = 0;
                start < content.length;
                start += MAX_CHUNK_CHARS
            ) {

                const piece = content.slice(
                    start,
                    start + MAX_CHUNK_CHARS
                );

                chunks.push([
                    {
                        ...file,
                        content: piece,
                        size: piece.length,
                    },
                ]);
            }

            continue;
        }

        
        currentChunk.push(file);
        currentSize = content.length;
    }

    if (currentChunk.length > 0) {
        chunks.push(currentChunk);
    }

    return chunks;
}