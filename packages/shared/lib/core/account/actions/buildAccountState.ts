import { SignerType } from '../enums'
import { IAccount, IAccountMetadata, IAccountState } from '../interfaces'

export async function buildAccountState(account: IAccount, metadata: IAccountMetadata): Promise<IAccountState> {
    const balance = await account.balance()
    return {
        ...account,
        ...metadata,
        depositAddress: account.meta.publicAddresses[0].address,
        balances: balance,
        // TODO: refactor onto the profile
        signerType: SignerType.Stronghold,
        // TODO: refactor or remove these below
        messages: [],
        addresses: [],
    }
}
