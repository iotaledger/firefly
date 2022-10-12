import { Address, AddressGenerationOptions } from '@iota/wallet'
import { getAccount } from '@core/profile-manager'

export async function generateAddressFromAccount(
    accountIndex: number,
    options?: AddressGenerationOptions
): Promise<Address> {
    return (await getAccount(accountIndex))?.generateAddress(options)
}
