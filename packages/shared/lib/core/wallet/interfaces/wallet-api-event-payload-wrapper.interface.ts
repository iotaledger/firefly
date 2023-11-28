import {
    ConsolidationRequiredWalletEvent,
    LedgerAddressGenerationWalletEvent,
    NewOutputWalletEvent,
    SpentOutputWalletEvent,
    TransactionInclusionWalletEvent,
    TransactionProgressWalletEvent,
} from '@iota/sdk/out/types'

export interface IWalletApiEventPayloadWrapper {
    walletId: string
    payload: IWalletApiEventPayload
}

export type IWalletApiEventPayload =
    | ConsolidationRequiredWalletEvent
    | LedgerAddressGenerationWalletEvent
    | NewOutputWalletEvent
    | SpentOutputWalletEvent
    | TransactionInclusionWalletEvent
    | TransactionProgressWalletEvent
