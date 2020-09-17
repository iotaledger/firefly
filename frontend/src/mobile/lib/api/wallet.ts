/**
 * Gets address for provided index
 * 
 * @method getAddress
 * 
 * @param {number} index 
 * 
 * @returns {Promise<string>}
 */
const getAddress = async (index: number): Promise<string> => {
    return Promise.resolve(`${index ? 'U' : 'A'}`.repeat(81));
}

const api = {
    public: {},
    restricted: {
        getAddress
    }
}

export default api;
