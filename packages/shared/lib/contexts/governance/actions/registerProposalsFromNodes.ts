import { IWalletState } from '@core/wallet/interfaces'
import { getActiveProfile } from '@core/profile/stores'
import { registerProposalsForWallets } from './registerProposalsForWallets'

export async function registerProposalsFromNodes(wallets: IWalletState[]): Promise<void> {
    const nodes = getActiveProfile().clientOptions?.nodes || []
    await Promise.all(nodes.map((node) => registerProposalsForWallets({ node }, wallets)))
}
