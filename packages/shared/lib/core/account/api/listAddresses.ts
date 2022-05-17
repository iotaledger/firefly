import { Address } from '@iota/wallet'
import { getAccount } from '@core/profile-manager'

export async function listAddresses(id?: string): Promise<Address[]> {
    return (await getAccount(Number(id)))?.listAddresses()
}
