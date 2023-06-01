import { TokenStandard } from '@core/wallet/enums'
import { IAsset } from '@core/wallet/interfaces'

export function canTransferAssetToLayer1(asset: IAsset): boolean {
    switch (asset.standard) {
        case TokenStandard.BaseToken:
        case TokenStandard.Irc27:
        case TokenStandard.Irc30:
            return true
        case TokenStandard.Erc20:
        default:
            return false
    }
}
