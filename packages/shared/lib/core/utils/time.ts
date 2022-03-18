/**
 * Returns a timeout for a given duration (milliseconds).
 * @param ms
 */
export function sleep(ms: number): Promise<number> {
    return new Promise((resolve, reject) => setTimeout(resolve, ms))
}
