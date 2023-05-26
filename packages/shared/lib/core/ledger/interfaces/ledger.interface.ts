import { IEvmTransactionData } from '@core/layer-2/interfaces'

export interface ILedger {
    generateEvmAddress(bip32Path: string, verify?: boolean): void
    signEvmTransaction(data: IEvmTransactionData, chainId: number, bip32Path: string): void
}
