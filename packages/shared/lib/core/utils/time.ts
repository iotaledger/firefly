/**
 * Returns a timeout for a given duration (milliseconds).
 * @param ms
 */
export const sleep = (ms: number): Promise<number> => new Promise((resolve, reject) => setTimeout(resolve, ms))
