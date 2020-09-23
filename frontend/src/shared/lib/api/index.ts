
import walletAPI, { IWalletAPI, IWalletPublicAPI, IWalletRestrictedAPI } from './wallet'

import db from '../db'

interface IRestrictedAPI extends IWalletRestrictedAPI { };

interface IPublicAPI extends IWalletPublicAPI { };

interface IAPI extends IPublicAPI, IRestrictedAPI { };

/**
 * Restricted APIs
 */
const restrictedAPI: IRestrictedAPI = {
    ...walletAPI.restricted,
}

/**
 * Public APIs — Can be used by any component
 */
const publicAPI: IPublicAPI = {
    ...walletAPI.public,
}

/**
 * All public and restricted API calls
 */
export const API: IAPI = {
    ...restrictedAPI,
    ...publicAPI
}

/**
 * API authorisation middleware
 */
const middleware = {
    get: (_target: typeof API, action: keyof IAPI): ((moduleId: string, payload: any) => Promise<object>) => {
        return async (moduleId, payload): Promise<object> => {
            if (typeof API[action] !== 'function') {
                throw Error('Incorrect API call')
            }

            /**
             * Check user permission for restricted API calls
             */
            if (typeof restrictedAPI[action] === 'function') {
                /**
                 * Retrieve permission scopes from the database
                 */
                const { allowed, blocked } = db.modules[moduleId];

                // Deny if already blocked
                if (blocked.indexOf(action) > -1) {
                    throw Error('Permission denied')
                }
            }

            // @ts-ignore
            return API[action](...payload);
        }
    }
}

const handler: typeof API = new Proxy({} as IAPI, middleware)

export default handler
