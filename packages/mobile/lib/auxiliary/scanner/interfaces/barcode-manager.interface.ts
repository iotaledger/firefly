export interface IBarcodeManager {
    prepare(): Promise<void>
    startScanner(onSuccess: (response: string) => void, onError: () => void): Promise<void>
    stopScanner(): Promise<void>
    checkPermission(): Promise<void>
    didUserGrantPermission(): Promise<boolean>
}
