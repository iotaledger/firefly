export class BarcodeScanner {
    public static start(onSuccess: (response: string) => void, onError: () => void): void {
        // dummy
        try {
            const foo = ''
            onSuccess(foo)
        } catch (err) {
            onError()
        }
    }

    public static stop(): void {
        // dummy
    }
}
