import { AddressWithOutputs, getBech32AddressFromAddressTypes, IWalletState } from '@core/wallet'
import { IWallet } from '@core/profile/interfaces'
import { Address } from '@iota/sdk/out/types'

// TODO(2.0) Fix all usages
export async function getAddressesWithOutputs(wallet: IWallet | IWalletState): Promise<AddressWithOutputs[]> {
    let addressesWithOutputs: AddressWithOutputs[] = []
    const addresses: Address[] = [] // await account.accounts
    const outputs = await wallet.outputs()

    const outputMapped: AddressWithOutputs[] = outputs.reduce((acc: AddressWithOutputs[], output) => {
        const address = getBech32AddressFromAddressTypes(output.address)
        const existingAddress = acc.find((a) => a.address === address)
        if (!existingAddress) {
            acc.push({ address, outputs: [output] })
        } else {
            existingAddress.outputs.push(output)
        }
        return acc
    }, [])

    addressesWithOutputs = addresses.map((address) => {
        const existingAddress = outputMapped.find((a) => a.address === address.toString())
        if (!existingAddress) {
            return { address: address.toString(), outputs: [] }
        }
        return existingAddress
    })
    return addressesWithOutputs
}
