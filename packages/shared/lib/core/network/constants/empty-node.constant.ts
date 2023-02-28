import { INode } from '../interfaces'

export const EMPTY_NODE: INode = {
    url: '',
    auth: {
        jwt: '',
        basicAuthNamePwd: ['', ''],
    },
}
