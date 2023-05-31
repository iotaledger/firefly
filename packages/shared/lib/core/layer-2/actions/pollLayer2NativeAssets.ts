import { LAYER2_NATIVE_ASSETS_POLL_INTERVAL } from '../constants'
import { fetchSelectedAccountLayer2Balance } from './'

let pollInterval: number

export function pollLayer2NativeAssets(): void {
    clearLayer2NativeAssetsPoll()
    fetchSelectedAccountLayer2Balance()
    pollInterval = window.setInterval(() => {
        fetchSelectedAccountLayer2Balance()
    }, LAYER2_NATIVE_ASSETS_POLL_INTERVAL)
}

export function clearLayer2NativeAssetsPoll(): void {
    clearInterval(pollInterval)
}
