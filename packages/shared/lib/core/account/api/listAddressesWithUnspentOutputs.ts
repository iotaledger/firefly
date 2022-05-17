import { AddressWithUnspentOutputs } from '@iota/wallet'
import { getAccount } from '@core/profile-manager'

export async function listAddressesWithUnspentOutputs(id?: string): Promise<AddressWithUnspentOutputs[]> {
    return (await getAccount(Number(id)))?.listAddressesWithUnspentOutputs()
}
