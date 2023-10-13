import { TokenMetadata, TokenStandard } from '@core/wallet'

export function getMaxDecimalsFromTokenMetadata(metadata: TokenMetadata, selectedUnit: string): number {
    let maxDecimals = 0
    if (metadata?.standard === TokenStandard.BaseToken) {
        if (selectedUnit === metadata?.unit) {
            maxDecimals = Math.min(metadata?.decimals, 18)
        } else if (selectedUnit === metadata?.subunit) {
            maxDecimals = 0
        }
    } else {
        maxDecimals = Math.min(metadata?.decimals, 18)
    }
    return maxDecimals
}
