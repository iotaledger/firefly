import { BarcodeManager } from '../helpers'
import { showCameraScanner } from '../stores'

export function startQrScanner(_onSuccess: (result: string) => void, _onError: () => void): void {
    showCameraScanner.set(true)
    const onSuccess: (result: string) => void = (result: string) => {
        showCameraScanner.set(false)
        _onSuccess(result)
    }
    const onError: () => void = () => {
        showCameraScanner.set(false)
        _onError()
    }
    void BarcodeManager.startScanner(onSuccess, onError)
}
