import { IOTA_UNIT_MAP } from '@core/utils'
import { TokenMetadata, TokenStandard } from '@core/wallet'

export function getMaxDecimalsFromTokenMetadata(metadata: TokenMetadata, selectedUnit: string): number {
    let maxDecimals = 0
    if (metadata?.standard === TokenStandard.BaseToken) {
        if (metadata?.useMetricPrefix) {
            maxDecimals = IOTA_UNIT_MAP?.[selectedUnit?.substring(0, 1)] ?? 0
        } else if (!metadata?.useMetricPrefix) {
            if (selectedUnit === metadata?.unit) {
                maxDecimals = Math.min(metadata?.decimals, 18)
            } else if (selectedUnit === metadata?.subunit) {
                maxDecimals = 0
            }
        }
    } else {
        maxDecimals = Math.min(metadata?.decimals, 18)
    }
    return maxDecimals
}
