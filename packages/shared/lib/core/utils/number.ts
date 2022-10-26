export function range(size: number, start: number = 0): number[] {
    if (!size || size <= 0) return []

    if (!start || typeof start !== 'number') start = 0

    return Array.from(Array(size), (_, idx) => idx + start)
}

export function tryNumberOrZero(numberCandidate: unknown): number {
    const numberCandidateCasted = Number(numberCandidate)
    return Number.isNaN(numberCandidateCasted) ? 0 : numberCandidateCasted
}

export function isNumberLetterOrPunctuation(key: string): boolean {
    if (key.length !== 1) {
        return false
    }
    const code = key.charCodeAt(0)
    return (code >= 48 && code <= 57) || (code >= 65 && code <= 122)
}
