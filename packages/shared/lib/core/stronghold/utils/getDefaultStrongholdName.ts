export function getDefaultStrongholdName(): string {
    // Match https://github.com/iotaledger/wallet.rs/blob/ffbeaa3466b44f79dd5f87e14ed1bdc4846d9e85/src/account_manager.rs#L1428
    // Trim milliseconds and replace colons with dashes
    const tzoffset = new Date().getTimezoneOffset() * 60000 // offset in milliseconds
    const localISOTime = new Date(Date.now() - tzoffset).toISOString()
    const date = localISOTime.slice(0, -5).replace(/:/g, '-')
    return `firefly-backup-${date}.stronghold`
}
