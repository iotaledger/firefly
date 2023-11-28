import { Balance } from '@iota/sdk/out/types'
import { IPersistedWalletData } from '../interfaces/persisted-account-data.interface';
import { IWalletState } from '../interfaces/account-state.interface';
import { IWallet } from '@core/profile/interfaces';
import { getDepositAddress } from '../utils/getDepositAddress';
import { getAddressesWithOutputs } from './getAddressesWithOutputs';

// TODO(2.0): Fix usages of buildAccountState
export async function buildWalletState(
    wallet: IWallet,
    walletPersistedData: IPersistedWalletData
): Promise<IWalletState> {
    let balances: Balance = {
        baseCoin: {
            total: BigInt(0),
            available: BigInt(0),
            votingPower: '0',
        },
        requiredStorageDeposit: {
            account: BigInt(0),
            basic: BigInt(0),
            foundry: BigInt(0),
            nft: BigInt(0),
        },
        nativeTokens: [],
        nfts: [],
        foundries: [],
        potentiallyLockedOutputs: {},
        accounts: [],
    }
    
    let depositAddress = ''
    let votingPower = ''
    try {
        balances = await wallet.getBalance()
        depositAddress = await getDepositAddress(wallet)
        votingPower = balances.baseCoin.votingPower
    } catch (err) {
        console.error(err)
    }
    const addressesWithOutputs = await getAddressesWithOutputs(wallet)

    return {
        ...wallet,
        ...walletPersistedData,
        depositAddress,
        balances,
        hasVotingPowerTransactionInProgress: false,
        hasVotingTransactionInProgress: false,
        hasConsolidatingOutputsTransactionInProgress: false,
        isTransferring: false,
        votingPower,
        addressesWithOutputs,
    } as IWalletState
}
