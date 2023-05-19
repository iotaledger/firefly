import { LAYER2_NATIVE_ASSETS_POLL_INTERVAL } from '../constants'
import { getSelectedAccountLayer2Tokens } from './'

let pollInterval: number

export function pollLayer2NativeAssets(): void {
    clearLayer2NativeAssetsPoll()
    void getSelectedAccountLayer2Tokens()
    pollInterval = window.setInterval(() => {
        void getSelectedAccountLayer2Tokens()
    }, LAYER2_NATIVE_ASSETS_POLL_INTERVAL)
}

export function clearLayer2NativeAssetsPoll(): void {
    clearInterval(pollInterval)
}
