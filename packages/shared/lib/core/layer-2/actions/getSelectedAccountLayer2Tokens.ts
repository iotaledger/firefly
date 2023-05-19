import { getSelectedAccountWrappedNativeTokens } from '.'
import { get } from 'svelte/store'
import { network } from '@core/network'
import { ERC_20_ABI } from '@core/layer-2'

const USDC_TOKEN_ADDRESS = '0x639A647fbe20b6c8ac19E48E2de44ea792c62c5C'

export async function getSelectedAccountLayer2Tokens(): Promise<unknown[]> {
    const wrappedNativeTokens = await getSelectedAccountWrappedNativeTokens()
    const nativeL2Tokens = await getNativeLayer2TokensForSelectedAccount()
    console.log([...wrappedNativeTokens, ...nativeL2Tokens])
    return [...wrappedNativeTokens, ...nativeL2Tokens]
}

export async function getNativeLayer2TokensForSelectedAccount(): Promise<unknown[]> {
    const address = '0xA88107749C850Df5A4BbbD2197889dF90103dd06' // get(selectedAccount)?.evmAddress
    if (address) {
        try {
            const chains = get(network)?.getChains()
            return await Promise.all(
                chains.map(async (chain) => {
                    const provider = chain.getProvider()
                    const contract = new provider.eth.Contract(ERC_20_ABI, USDC_TOKEN_ADDRESS)
                    const amount = await contract.methods.balanceOf(address).call()
                    const name = await contract.methods.name().call()
                    const symbol = await contract.methods.symbol().call()
                    const decimals = await contract.methods.decimals().call()
                    console.log(name, symbol, decimals)
                    return [{ name, symbol, decimals: Number(decimals), amount: Number(amount) }]
                })
            )
        } catch (err) {
            console.error(err)
            return []
        }
    } else {
        return []
    }
}
