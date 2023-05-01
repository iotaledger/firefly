export function range(size: number, start: number = 0): number[] {
    if (typeof size !== 'number' || size <= 0) {
        return []
    }

    if (typeof start !== 'number') {
        start = 0
    }

    return Array.from({ length: size }, (_, index) => index + start)
}

export function tryNumberOrZero(numberCandidate: unknown): number {
    if (typeof numberCandidate === 'number' && !Number.isNaN(numberCandidate)) {
        return numberCandidate
    }

    const numberCandidateCasted = Number(numberCandidate)
    return Number.isNaN(numberCandidateCasted) ? 0 : numberCandidateCasted
}

export function isNumberLetterOrPunctuation(key: string): boolean {
    if (typeof key !== 'string' || key.length !== 1) {
        return false
    }

    const code = key.charCodeAt(0)
    const isNumber = code >= 48 && code <= 57
    const isUpperCaseLetter = code >= 65 && code <= 90
    const isLowerCaseLetter = code >= 97 && code <= 122

    return isNumber || isUpperCaseLetter || isLowerCaseLetter
}

export function round(value: number, precision: number = 0): number {
    if (typeof value !== 'number' || Number.isNaN(value) || typeof precision !== 'number' || Number.isNaN(precision)) {
        return null
    }

    const multiplier = 10 ** precision
    return Math.round(value * multiplier) / multiplier
}
