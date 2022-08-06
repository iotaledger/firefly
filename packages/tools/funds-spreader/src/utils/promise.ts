export async function promiseTimeout(timeoutDelay: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, timeoutDelay))
}
