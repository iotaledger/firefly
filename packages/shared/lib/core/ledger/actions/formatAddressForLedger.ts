export function formatAddressForLedger(address: string): string {
    const len = address.length
    return `${address.slice(0, len / 2)}\n${address.slice(len / 2, len)}`
}
