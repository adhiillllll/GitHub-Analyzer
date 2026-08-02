export function decodeBase64(content: string): string {
    return atob(content.replace(/\n/g, ""));
}