export function buildBip32Path(coinType: number, accountIndex: number): string {
    return `44'/${coinType}'/${accountIndex}'/0/0`
}
