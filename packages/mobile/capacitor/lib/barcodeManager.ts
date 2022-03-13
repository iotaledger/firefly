import { CheckPermissionResult, ScanResult } from '@capacitor-community/barcode-scanner'
import { BarcodeScanner, SupportedFormat } from '@capacitor-community/barcode-scanner'
import { localize } from 'shared/lib/i18n'
import { IBarcodeManager } from 'shared/lib/typings/barcodeManager'

const openQRBodyClass: string = 'qr-scanner'

const _stopScanner = async (): Promise<void> => {
    try {
        document.body.classList.remove(openQRBodyClass)
        await BarcodeScanner.showBackground()
        await BarcodeScanner.stopScan()
    } catch (err) {
        // eslint-disable-next-line no-empty
    }
}

const _checkPermission = async (): Promise<void> => {
    const status: CheckPermissionResult = await BarcodeScanner.checkPermission()
    if (status.denied) {
        // the user denied permission for good
        // redirect user to app settings if they want to grant it anyway
        // eslint-disable-next-line no-alert
        const c = confirm(localize('permissions.camera.requestInAppSettings'))
        if (c) {
            await BarcodeScanner.openAppSettings()
        }
    }
}

const _didUserGrantPermission = async (): Promise<boolean> => {
    // check if user already granted permission
    const status: CheckPermissionResult = await BarcodeScanner.checkPermission({ force: false })

    if (status?.granted) {
        // user granted permission
        return true
    }
    if (status?.denied) {
        // user denied permission
        return false
    }
    if (status?.asked) {
        // system requested the user for permission during this call
        // only possible when force set to true
    }
    if (status?.neverAsked) {
        // user has not been requested this permission before
        // it is advised to show the user some sort of prompt
        // this way you will not waste your only chance to ask for the permission
        // eslint-disable-next-line no-alert
        const c = confirm(localize('permissions.camera.request'))
        if (!c) {
            return false
        }
    }
    if (status?.restricted || status?.unknown) {
        // ios only
        // probably means the permission has been denied
        return false
    }
    // user has not denied permission
    // but the user also has not yet granted the permission
    // so request it
    const statusRequest: CheckPermissionResult = await BarcodeScanner.checkPermission({ force: true })

    if (statusRequest?.asked) {
        // system requested the user for permission during this call
        // only possible when force set to true
    }
    if (statusRequest?.granted) {
        // the user did grant the permission now
        return true
    }

    // user did not grant the permission, so he/she must have declined the request
    return false
}

/** Mobile Barcode Manager */
export const BarcodeManager: IBarcodeManager = {
    /**
     * Prepares qr code scanner
     * @method prepare
     */
    prepare: async (): Promise<void> => {
        await BarcodeScanner.prepare()
    },

    /**
     * start qr code scanner
     * @method startScanner
     */
    startScanner: async (onSuccess: (response: string) => void, onError: () => void): Promise<void> => {
        try {
            const permissionGranted = await _didUserGrantPermission()
            if (permissionGranted) {
                await BarcodeScanner.hideBackground()
                document.body.classList.add(openQRBodyClass)
                const result: ScanResult = await BarcodeScanner.startScan({
                    targetedFormats: [SupportedFormat.QR_CODE],
                })
                if (result?.hasContent && result?.content) {
                    document.body.classList.remove(openQRBodyClass)
                    onSuccess(result.content)
                }
            } else {
                await _checkPermission()
            }
        } catch (err) {
            try {
                await _stopScanner()
            } catch (err) {
                // eslint-disable-next-line no-empty
            }
            document.body.classList.remove(openQRBodyClass)
            onError()
        }
    },

    /**
     * Removes pincode entry from the keychain
     * @method stopScanner
     */
    stopScanner: _stopScanner,

    /**
     * Check permission, and navigate to settings if denied
     * @method checkPermission
     */
    checkPermission: _checkPermission,

    /**
     * Check if user has granted permission
     * @method didUserGrantPermission
     */
    didUserGrantPermission: _didUserGrantPermission,
}
