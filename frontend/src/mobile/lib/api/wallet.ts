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

export interface IWalletRestrictedAPI {
    getAddress: (index: number) => Promise<string>;
};

export interface IWalletPublicAPI { };

export interface IWalletAPI {
    public: IWalletPublicAPI;
    restricted: IWalletRestrictedAPI;
};

const api: IWalletAPI = {
    public: {},
    restricted: {
        getAddress
    }
}

export default api;
