import { AddressWithOutputs, IAccount, IAccountState } from '../interfaces'
import { getBech32AddressFromAddressTypes } from '@core/wallet'

export async function getAddressesWithOutputs(account: IAccount | IAccountState): Promise<AddressWithOutputs[]> {
    let addressesWithOutputs: AddressWithOutputs[] = []
    const addresses = await account.addresses()
    const outputs = await account.outputs()

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
        const existingAddress = outputMapped.find((a) => a.address === address.address)
        if (!existingAddress) {
            return { address: address.address, outputs: [] }
        }
        return existingAddress
    })
    return addressesWithOutputs
}
