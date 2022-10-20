export const clamp = (n: number, min: number, max: number): number => {
    if (Number.isNaN(n) || Number.isNaN(min) || Number.isNaN(max)) return 0

    return Math.min(Math.max(n, min), max)
}
