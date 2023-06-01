export interface ILedger {
    generateEvmAddress(bip32Path: string, verify?: boolean): void
    signEvmTransaction(data: Buffer, bip32Path: string): void
}
