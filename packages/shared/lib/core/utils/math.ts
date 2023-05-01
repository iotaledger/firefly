export const clamp = (n: number, min: number, max: number): number => {
    if (Number.isFinite(n) && Number.isFinite(min) && Number.isFinite(max)) {
        return Math.min(Math.max(n, min), max)
    }
    return 0
}
