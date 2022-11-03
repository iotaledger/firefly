import {
    BarcodeScanner as _BarcodeScanner,
    CheckPermissionResult,
    ScanResult,
    SupportedFormat,
} from '@capacitor-community/barcode-scanner'

import { localize } from '@core/i18n'

import { OPEN_SCANNER_BODY_CLASS } from '../constants'

export class BarcodeScanner {
    private static async _stopScanner(): Promise<void> {
        try {
            document.body.classList.remove(OPEN_SCANNER_BODY_CLASS)
            await _BarcodeScanner.showBackground()
            await _BarcodeScanner.stopScan()
        } catch (err) {
            // eslint-disable-next-line no-empty
        }
    }
    private static async _checkPermission(): Promise<void> {
        const status: CheckPermissionResult = await _BarcodeScanner.checkPermission()
        if (status.denied) {
            // the user denied permission for good
            // redirect user to app settings if they want to grant it anyway
            // eslint-disable-next-line no-alert
            const c = confirm(localize('permissions.camera.requestInAppSettings'))
            if (c) {
                await _BarcodeScanner.openAppSettings()
            }
        }
    }
    private static async _didUserGrantPermission(): Promise<boolean> {
        // check if user already granted permission
        const status: CheckPermissionResult = await _BarcodeScanner.checkPermission({ force: false })

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
        const statusRequest: CheckPermissionResult = await _BarcodeScanner.checkPermission({ force: true })

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

    public static async prepare(): Promise<void> {
        await BarcodeScanner.prepare()
    }

    public static async start(onSuccess: (response: string) => void, onError: () => void): Promise<void> {
        try {
            const permissionGranted = await this._didUserGrantPermission()
            if (permissionGranted) {
                await _BarcodeScanner.hideBackground()
                document.body.classList.add(OPEN_SCANNER_BODY_CLASS)
                const result: ScanResult = await _BarcodeScanner.startScan({
                    targetedFormats: [SupportedFormat.QR_CODE],
                })
                if (result?.hasContent && result?.content) {
                    document.body.classList.remove(OPEN_SCANNER_BODY_CLASS)
                    onSuccess(result.content)
                }
            } else {
                await this._checkPermission()
            }
        } catch (err) {
            try {
                await this._stopScanner()
            } catch (err) {
                // eslint-disable-next-line no-empty
            }
            document.body.classList.remove(OPEN_SCANNER_BODY_CLASS)
            onError()
        }
    }

    public static async stop(): Promise<void> {
        return this._stopScanner()
    }

    public static async checkPermission(): Promise<void> {
        return this._checkPermission()
    }

    public static async didUserGrantPermission(): Promise<boolean> {
        return this._didUserGrantPermission()
    }
}
