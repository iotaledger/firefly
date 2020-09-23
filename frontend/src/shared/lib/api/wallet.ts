/**
 * Gets address for provided index
 * 
 * @method getAddress
 * 
 * @param {number} index 
 * 
 * @returns {Promise<string>}
 */
const getAddress = (index: number): Promise<string> => {
    return Promise.resolve(`${index ? 'U' : 'A'}`.repeat(81));
}

/**
 * Logs a message
 * 
 * @method log
 * 
 * @param {string} message
 * 
 * @returns {void} 
 */
const log = (message: string) => {
    console.log(message);
};

export interface IWalletRestrictedAPI {
    getAddress: (index: number) => Promise<string>;
};

export interface IWalletPublicAPI { };

export interface IWalletAPI {
    public: IWalletPublicAPI;
    restricted: IWalletRestrictedAPI;
};

const api: IWalletAPI = {
    public: {
        log
    },
    restricted: {
        getAddress
    }
}

export default api;
