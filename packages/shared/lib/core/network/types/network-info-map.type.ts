import { NetworkProtocol, NetworkType } from '../enums'
import { INetworkInfo } from '../interfaces'

export type NetworkInfoMap = {
    [key in NetworkProtocol]?: {
        [key in NetworkType]?: INetworkInfo
    }
}
