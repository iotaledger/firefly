import { get } from 'svelte/store'

import { LedgerAppName } from '../enums'
import { ledgerNanoStatus } from '../stores'

export function isLedgerAppOpen(appName: LedgerAppName): boolean {
    return get(ledgerNanoStatus)?.app?.name === appName
}
