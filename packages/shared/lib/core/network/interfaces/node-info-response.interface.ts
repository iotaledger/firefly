import { IStardustNodeInfo } from './node-info.interface'

export interface INodeInfoResponse {
    type: string
    payload: {
        nodeinfo: IStardustNodeInfo
        url: string
    }
}
