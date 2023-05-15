export interface ILedger {
    generateEvmAddress(coinType: number, accountIndex: number, verify?: boolean): Promise<void>
}
