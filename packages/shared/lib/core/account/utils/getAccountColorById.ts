import { visibleActiveAccounts } from '@core/profile/stores/active-accounts.store'
import { get } from 'svelte/store'

export function getAccountColorById(id: number): string {
    return get(visibleActiveAccounts)?.find((account) => account.index === id)?.color
}
