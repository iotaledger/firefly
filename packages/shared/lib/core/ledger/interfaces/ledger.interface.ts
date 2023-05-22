
export interface ILedger {
    generateEvmAddress(coinType: number, accountIndex: number, verify?: boolean): Promise<void>
    signEvmTransaction(data: Uint8Array): void
}
