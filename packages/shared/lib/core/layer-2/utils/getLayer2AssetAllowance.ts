import { IAsset, TokenStandard } from '@core/wallet'
import { ILayer2AssetAllowance } from '../interfaces'

export function getLayer2Allowance(asset: IAsset, amount: string): ILayer2AssetAllowance {
    if (asset.metadata?.standard === (TokenStandard.BaseToken as unknown as string)) {
        return {
            baseTokens: amount,
            nativeTokens: [],
            nfts: [],
        }
    } else {
        return {
            baseTokens: '0',
            nativeTokens: [
                {
                    ID: [asset.id],
                    amount,
                },
            ],
            nfts: [],
        }
    }
}
