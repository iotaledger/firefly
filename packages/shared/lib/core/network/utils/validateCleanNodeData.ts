import { stripSpaces, stripTrailingSlash } from '@lib/helpers'
import { INode } from '../interfaces'
import { checkNodeUrlValidity } from './checkNodeUrlValidity'
import { cleanAuth } from './cleanAuth'

export function validateCleanNodeData(data: INode): INode {
    const cleanData = {
        url: stripTrailingSlash(stripSpaces(data?.url)),
        auth: cleanAuth(data?.auth),
    }
    const error = checkNodeUrlValidity([], data?.url, false)
    if (!error) {
        return cleanData
    }
    throw error
}
