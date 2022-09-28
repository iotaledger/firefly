import { LedgerError } from '../enums'

export const LEDGER_ERROR_LOCALES = {
    [LedgerError.DeniedByUser]: 'error.send.cancelled',
    [LedgerError.DeviceNotFound]: 'error.ledger.notFound',
    [LedgerError.Generic]: 'error.global.generic',
    [LedgerError.Locked]: 'error.ledger.locked',
    [LedgerError.Transport]: 'error.ledger.generic',
}
