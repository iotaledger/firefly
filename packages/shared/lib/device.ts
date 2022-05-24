import { get, writable, Writable } from 'svelte/store'
import { mobile } from '@core/app'
import { Platform } from './platform'

const BarcodeManager = Platform.BarcodeManager

export const showCameraScanner: Writable<boolean> = writable(false)

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
        void BarcodeManager.startScanner(onSuccess, onError)
    }
}

export const stopQRScanner = (): void => {
    if (get(mobile)) {
        showCameraScanner.set(false)
        void BarcodeManager.stopScanner()
    }
}
