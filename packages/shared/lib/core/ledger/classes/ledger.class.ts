import { ILedger } from '../interfaces'

declare global {
    interface Window {
        __LEDGER__: ILedger
    }
}

export const Ledger: ILedger = window['__LEDGER__']
