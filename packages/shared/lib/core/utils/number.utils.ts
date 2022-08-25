export function tryNumberOrZero(numberCandidate: unknown): number {
    const numberCandidateCasted = Number(numberCandidate)
    return Number.isNaN(numberCandidateCasted) ? 0 : numberCandidateCasted
}
