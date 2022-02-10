import { mobile } from 'shared/lib/app'
import type { Writable } from 'svelte/store'
import { get, writable } from 'svelte/store'
import { startScanner, stopScanner } from '../../mobile/lib/qrScanner'

export const showCameraScanner: Writable<boolean> = writable(false)

export const startQRScanner = (_onSuccess: (result: string) => void, _onError: () => void): void => {
    showCameraScanner.set(true)
    const onSuccess = (result: string) => {
        showCameraScanner.set(false)
        _onSuccess(result)
    }
    const onError = () => {
        showCameraScanner.set(false)
        _onError()
    }
    void startScanner(onSuccess, onError)
}

export const stopQRScanner = (): void => {
    if (get(mobile)) {
        showCameraScanner.set(false)
        void stopScanner()
    } else {
        // nothing to do here
    }
}
