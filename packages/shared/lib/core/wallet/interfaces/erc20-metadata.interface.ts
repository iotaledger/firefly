import { TokenStandard } from '@core/wallet/enums'

export interface IErc20Metadata {
    standard: TokenStandard.Erc20
    name: string
    symbol: string
    decimals: number
}
