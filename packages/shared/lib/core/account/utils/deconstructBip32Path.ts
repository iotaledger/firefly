const BIP_32_LEVELS = 5

export function deconstructBip32Path(path: string): {
    coinType: number
    accountIndex: number
    change: number
    addressIndex: number
} {
    const pathArray = path.split('/')
    if (pathArray.length !== BIP_32_LEVELS) {
        throw new Error('Invalid BIP-32 path length')
    }

    const _path = pathArray.map((p) => {
        const sanitizedPath = p.replace('\'', '')
        return Number(sanitizedPath)
    })

    return {
        coinType: _path[1],
        accountIndex: _path[2],
        change: _path[3],
        addressIndex: _path[4],
    }
}
