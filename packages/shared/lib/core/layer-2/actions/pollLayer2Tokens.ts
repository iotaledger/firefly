import { LAYER2_TOKENS_POLL_INTERVAL } from '../constants'
import { fetchSelectedAccountLayer2Balance } from '.'

let pollInterval: number

export function pollLayer2Tokens(): void {
    clearLayer2TokensPoll()
    fetchSelectedAccountLayer2Balance()
    pollInterval = window.setInterval(() => {
        fetchSelectedAccountLayer2Balance()
    }, LAYER2_TOKENS_POLL_INTERVAL)
}

export function clearLayer2TokensPoll(): void {
    clearInterval(pollInterval)
}
