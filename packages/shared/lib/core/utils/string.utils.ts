export function isStringTrue(value: string): boolean {
    return value === 'true'
}

export function getByteLengthOfString(str: string): number {
    return new Blob([str]).size
}

export function chunkString(str: string, size: number = 0): string[] {
    if (str) {
        const numChunks = Math.ceil(str.length / size)
        const chunks = new Array(numChunks)

        for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
            chunks[i] = str.substr(o, size)
        }

        return chunks
    } else {
        return []
    }
}
