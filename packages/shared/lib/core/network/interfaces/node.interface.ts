import { Auth } from '@iota/sdk/out/types'

export interface INode {
    url: string
    auth?: Auth
    disabled?: boolean
}
