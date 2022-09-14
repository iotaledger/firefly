export function getByteLengthOfString(str: string): number {
    return new Blob([str]).size
}
