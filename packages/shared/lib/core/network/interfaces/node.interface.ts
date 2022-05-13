import { INetwork } from './network.interface'
import { IAuth } from './auth.interface'

export interface INode {
    url: string
    auth?: IAuth
    network?: INetwork
    isPrimary?: boolean
    isDisabled?: boolean
}
