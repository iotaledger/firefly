import { LedgerError } from '../enums'

export function deriveLedgerError(error: string): LedgerError | undefined {
    return Object.values(LedgerError).find((ledgerError) => error?.includes(ledgerError))
}
