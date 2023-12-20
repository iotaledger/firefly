import { IError } from '@core/error/interfaces'
import { IWallet } from '@core/profile/interfaces'
import { getWallet } from '@core/profile/actions'
import { UnableToGetBoundWalletError } from '@core/wallet/errors'

// TODO(2.0) Fix all usages
export async function getBoundWallet(walletId: string, createWalletsIfNotFound: boolean = false): Promise<IWallet> {
    try {
        /**
         * CAUTION: Do NOT remove the `await` keyword here.
         * It is needed in the case of handling an AccountNotFound
         * error by creating more accounts.
         */
        const wallet = await getWallet(walletId)
        return wallet
    } catch (err) {
        // TODO: Update error type when sdk Error enum has been updated
        if ((err as IError)?.type === 'wallet' && createWalletsIfNotFound) {
            // TODO(2.0) Adapt this logic
            /*
            for (let indexTocreateWallet = 0; indexTocreateWallet < accountIndex; indexTocreateWallet++) {
                const account = await createWallet({}, profileManager)
                if (account?.getMetadata()?.index === accountIndex) {
                    return account
                }
            }
            */
            throw new UnableToGetBoundWalletError()
        } else {
            throw err
        }
    }
}
