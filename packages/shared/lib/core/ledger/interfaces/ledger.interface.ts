import { IEvmTransactionData } from '@core/layer-2/interfaces'

export interface ILedger {
    generateEvmAddress(coinType: number, accountIndex: number, verify?: boolean): Promise<void>
    signEvmTransaction(data: IEvmTransactionData, coinType: number, accountIndex: number): void
}
