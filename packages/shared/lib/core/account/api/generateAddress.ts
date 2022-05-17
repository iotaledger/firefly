import { Address, AddressGenerationOptions } from '@iota/wallet'
import { getAccount } from '@core/profile-manager'

export async function generateAddressFromAccount(
    accountId: string,
    options?: AddressGenerationOptions
): Promise<Address> {
    return (await getAccount(Number(accountId)))?.generateAddress(options)
}
