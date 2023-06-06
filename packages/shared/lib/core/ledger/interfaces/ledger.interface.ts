import type { TxData } from '@ethereumjs/tx'

export interface ILedger {
    generateEvmAddress(bip32Path: string, verify?: boolean): void
    signEvmTransaction(data: TxData, bip32Path: string): void
}
