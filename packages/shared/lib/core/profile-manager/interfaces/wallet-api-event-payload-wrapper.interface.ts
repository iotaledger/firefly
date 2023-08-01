import {
    ConsolidationRequiredWalletEvent,
    LedgerAddressGenerationWalletEvent,
    NewOutputWalletEvent,
    SpentOutputWalletEvent,
    TransactionInclusionWalletEvent,
    TransactionProgressWalletEvent,
} from '@iota/wallet/out/types'

export interface IWalletApiEventPayloadWrapper {
    accountIndex: number
    payload: IWalletApiEventPayload
}

export type IWalletApiEventPayload =
    | ConsolidationRequiredWalletEvent
    | LedgerAddressGenerationWalletEvent
    | NewOutputWalletEvent
    | SpentOutputWalletEvent
    | TransactionInclusionWalletEvent
    | TransactionProgressWalletEvent
