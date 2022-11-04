import { BarcodeScanner } from '../classes'
import { showCameraScanner } from '../stores'

export function stopScanner(): void {
    showCameraScanner.set(false)
    void BarcodeScanner.stop()
}
