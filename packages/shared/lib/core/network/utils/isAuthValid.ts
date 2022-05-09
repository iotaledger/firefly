import { IAuth } from '../interfaces'

/**
 * Determines whether node authentication data is valid.
 * @method isAuthValid
 * @param {IAuth} auth
 * @returns {boolean}
 */
export function isAuthValid(auth: IAuth): boolean {
    return auth?.jwt || (auth?.username && auth?.password) ? true : false
}
