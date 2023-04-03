import { MILLISECONDS_PER_SECOND } from '@core/utils'

export async function fetchWithTimeout(url: string, secondsToTimeout: number, options: RequestInit): Promise<Response> {
    const controller = new AbortController()

    setTimeout(() => controller.abort(), secondsToTimeout * MILLISECONDS_PER_SECOND)

    return fetch(url, { ...options, signal: controller.signal })
}
