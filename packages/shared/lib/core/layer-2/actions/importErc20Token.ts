import { get } from 'svelte/store'
import { network } from '@core/network'
import { ERC20_ABI } from '@core/layer-2'
import { selectedAccount } from '@core/account'

export async function importErc20Token(tokenAddress: string, chainId: number): Promise<void> {
    console.log('TOKEN ADDRESS: ', tokenAddress)
    console.log('CHAIN ID: ', chainId)

    // get contract ABI
    const chain = get(network)?.getChain(chainId)
    const provider = chain?.getProvider()
    if (provider) {
        const contract = new provider.eth.Contract(ERC20_ABI, tokenAddress)

        // TODO: Extract into separate function later
        const name = await contract.methods.name().call()
        const symbol = await contract.methods.symbol().call()
        const decimals = await contract.methods.decimals().call()
        console.log('METADATA: ', name, symbol, decimals)

        // TODO: Extract into separate function later
        // TODO: Get for all accounts
        const coinType = chain?.getConfiguration().coinType
        const selectedAccountAddress =
            get(selectedAccount)?.evmAddresses[coinType] ?? '0xA88107749C850Df5A4BbbD2197889dF90103dd06'
        const result = await contract.methods.balanceOf(selectedAccountAddress).call()
        console.log('BALANCE: ', result)
    }
}
