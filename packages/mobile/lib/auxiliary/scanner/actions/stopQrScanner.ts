import { BarcodeManager } from '../helpers'
import { showCameraScanner } from '../stores'

export function stopQrScanner(): void {
    showCameraScanner.set(false)
    void BarcodeManager.stopScanner()
}
