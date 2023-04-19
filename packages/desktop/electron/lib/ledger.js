const TransportNodeHid = require('@ledgerhq/hw-transport-node-hid').default
const AppEth = require('@ledgerhq/hw-app-eth').default
const { listen } = require('@ledgerhq/logs');

// This a very basic example
// Ideally you should not run this code in main thread
// but run it in a dedicated node.js process
export function getEthereumInfo(verify) {
    return TransportNodeHid.open('')
    .then(transport => {
        listen(log => console.log(log))
        const appEth = new AppEth(transport);
        return appEth.getAddress('44\'/60\'/0\'/0/0').then(r =>
            transport
                .close()
                .catch(e => {})
                .then(() => r)
            );
    })
    .catch(e => {
        console.warn(e);
        // try again until success!
        return new Promise(s => setTimeout(s, 1000)).then(() =>
            getEthereumInfo(verify)
        );
    });
}
