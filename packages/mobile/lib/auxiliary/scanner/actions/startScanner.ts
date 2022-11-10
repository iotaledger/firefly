import { BarcodeScanner } from '../classes'
import { showCameraScanner } from '../stores'

export function startScanner(_onSuccess: (result: string) => void, _onError: () => void): void {
    showCameraScanner.set(true)
    const onSuccess: (result: string) => void = (result: string) => {
        showCameraScanner.set(false)
        _onSuccess(result)
    }
    const onError: () => void = () => {
        showCameraScanner.set(false)
        _onError()
    }
    void BarcodeScanner.start(onSuccess, onError)
}
