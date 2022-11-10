import { MILLISECONDS_PER_SECOND, SECONDS_PER_MINUTE } from '@core/utils'

export function getDefaultStrongholdName(): string {
    // Match https://github.com/iotaledger/wallet.rs/blob/ffbeaa3466b44f79dd5f87e14ed1bdc4846d9e85/src/account_manager.rs#L1428
    // Trim milliseconds and replace colons with dashes
    const timezoneOffset = new Date().getTimezoneOffset() * MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE // offset in milliseconds
    const localIsoTime = new Date(Date.now() - timezoneOffset).toISOString()
    const date = localIsoTime.slice(0, -5).replace(/:/g, '-')
    return `firefly-backup-${date}.stronghold`
}
