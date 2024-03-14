import { INodeInfoBaseToken } from '@iota/sdk/out/types'
import { TokenStandard } from '../enums'

export interface IBaseToken extends INodeInfoBaseToken {
    standard: TokenStandard.BaseToken
}
