import { mobile } from 'shared/lib/app'
import { Electron } from 'shared/lib/electron'
import type { Writable } from 'svelte/store'
import { get, writable } from 'svelte/store'
import { startScanner, stopScanner } from '../../mobile/lib/qrScanner'

export const showCameraScanner: Writable<boolean> = writable(false)

export const openUrl = (url: string): void => {
    if (get(mobile)) {
        // TODO: implement
    } else {
        Electron.openUrl(url)
    }
}

export const startQRScanner = (_onSuccess: (result: string) => void, _onError: () => void): void => {
    if (get(mobile)) {
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
    } else {
        // nothing to do here
    }
}

export const stopQRScanner = (): void => {
    if (get(mobile)) {
        showCameraScanner.set(false)
        void stopScanner()
    } else {
        // nothing to do here
    }
}
