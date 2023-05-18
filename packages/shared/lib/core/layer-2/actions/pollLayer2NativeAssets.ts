import { LAYER2_NATIVE_ASSETS_POLL_INTERVAL } from '../constants'
import { getSelectedAccountL2Tokens } from './'

let pollInterval: number

export function pollLayer2NativeAssets(): void {
    clearLayer2NativeAssetsPoll()
    void getSelectedAccountL2Tokens()
    pollInterval = window.setInterval(() => {
        void getSelectedAccountL2Tokens()
    }, LAYER2_NATIVE_ASSETS_POLL_INTERVAL)
}

export function clearLayer2NativeAssetsPoll(): void {
    clearInterval(pollInterval)
}
