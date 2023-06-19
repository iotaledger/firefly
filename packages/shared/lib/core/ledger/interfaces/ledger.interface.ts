import type { EvmTransactionData } from '@core/layer-2'

export interface ILedger {
    generateEvmAddress(bip32Path: string, verify?: boolean): void
    signEvmTransaction(data: EvmTransactionData, bip32Path: string): void
}
