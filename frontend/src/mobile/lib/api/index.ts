
import walletAPI from './wallet'

import db from '../db'

/**
 * Restricted APIs
 */
const restrictedAPI = {
    ...walletAPI.restricted,
}

/**
 * Public APIs — Can be used by any component
 */
const publicAPI = {
    ...walletAPI.public,
}

/**
 * All public and restricted API calls
 */
export const API = {
    ...restrictedAPI,
    ...publicAPI
}

/**
 * API authorisation middleware
 */
const middleware = {
    get: (_target, action): ((moduleId: string, payload: any) => Promise<object>) => {
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
            // If all good, return the actual API call
            return API[action](...payload)
        }
    }
}

const handler: typeof API = new Proxy({}, middleware)

export default handler
