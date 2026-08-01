export function formatSize(sizeInKB: number): string {

    if (sizeInKB < 1024) {
        return `${sizeInKB} KB`;
    }

    const sizeInMB = sizeInKB / 1024;

    if (sizeInMB < 1024) {
        return `${sizeInMB.toFixed(1)} MB`;
    }

    const sizeInGB = sizeInMB / 1024;

    return `${sizeInGB.toFixed(1)} GB`;
}