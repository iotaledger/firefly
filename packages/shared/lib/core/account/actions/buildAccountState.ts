import { AccountBalance } from '@iota/wallet'
import { SignerType } from '../enums'
import { IAccount, IAccountMetadata, IAccountState } from '../interfaces'

export async function buildAccountState(account: IAccount, metadata: IAccountMetadata): Promise<IAccountState> {
    let balances: AccountBalance = {
        baseCoin: {
            total: '0',
            available: '0',
        },
        requiredStorageDeposit: '0',
        nativeTokens: [],
        nfts: [],
        foundries: [],
        potentiallyLockedOutputs: {},
        aliases: [],
    }
    try {
        balances = await account.getBalance()
    } catch (error) {
        console.error(error)
    }

    return {
        ...account,
        ...metadata,
        depositAddress: account.meta.publicAddresses[0].address,
        balances,
        isTransferring: false,
        // TODO: refactor onto the profile
        signerType: SignerType.Stronghold,
        // TODO: refactor or remove these below
        messages: [],
    }
}
