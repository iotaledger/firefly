import { Address, AddressGenerationOptions } from '@iota/wallet'
import { getAccount } from '@core/profile-manager'

export async function generateAddressesFromAccount(
    accountIndex: number,
    amount: number,
    options?: AddressGenerationOptions
): Promise<Address[]> {
    return (await getAccount(accountIndex))?.generateAddresses(amount, options)
}
