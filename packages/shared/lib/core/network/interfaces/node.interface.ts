import { IAuth } from './auth.interface'

export interface INode {
    url: string
    auth?: IAuth
    disabled?: boolean
}
