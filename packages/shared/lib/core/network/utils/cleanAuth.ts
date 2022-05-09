import { IAuth } from '../interfaces'

/**
 * Strips node authentication of unnecessary data, sometimes important for having
 * successful API requests to a node.
 *
 * @method cleanAuth
 * @param {IAuth} auth
 * @returns {IAuth}
 */
export function cleanAuth(auth: IAuth): IAuth {
    return auth?.jwt ? auth : { username: auth?.username || '', password: auth?.password || '' }
}
