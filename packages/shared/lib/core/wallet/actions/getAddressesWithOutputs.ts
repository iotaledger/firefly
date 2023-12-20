import { AddressWithOutputs } from '@core/wallet'

// TODO(2.0) Fix all usages
export function getAddressesWithOutputs(/* wallet: IWallet | IWalletState*/): Promise<AddressWithOutputs[]> {
    const addressesWithOutputs: AddressWithOutputs[] = []
    // TODO (2.0): fix
    return Promise.resolve(addressesWithOutputs)

    /*
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
    return addressesWithOutputs*/
}
