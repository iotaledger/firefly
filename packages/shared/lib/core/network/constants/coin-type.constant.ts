import { NetworkProtocol } from '../enums'

export const COIN_TYPE: Readonly<{ [key in NetworkProtocol]?: number }> = {
    [NetworkProtocol.IOTA]: 4218,
    [NetworkProtocol.Shimmer]: 4219,
}
