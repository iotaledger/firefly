import { activeWallets } from '@core/profile'
import { getSelectedWallet /* IWalletState*/ } from '@core/wallet'
import { get } from 'svelte/store'

import { IRegisteredProposals } from '../interfaces'
import { registeredProposals } from '../stores'
// import { createProposalFromError, createProposalFromEvent } from '../utils'
// import { getWalletsParticipationEventStatusForEvent } from './getWalletsParticipationEventStatusForEvent'

export async function initializeRegisteredProposals(): Promise<void> {
    const allProposals: { [walletId: string]: IRegisteredProposals } = {}

    // Get selected wallet first to speed up showing proposals for the user
    const _selectedWallet = getSelectedWallet()
    allProposals[_selectedWallet.id] = await getParticipationEventsAndCreateProposalsForWallet(_selectedWallet)
    registeredProposals.set(allProposals)

    // Then get the rest of the wallet in the background
    for (const wallet of get(activeWallets)) {
        if (!getSelectedWallet()) {
            break
        }
        if (wallet.id !== _selectedWallet.id) {
            allProposals[wallet.id] = await getParticipationEventsAndCreateProposalsForWallet(wallet)
        }
    }
    registeredProposals.set(allProposals)
}

// TODO: https://github.com/iotaledger/firefly/issues/7947
async function getParticipationEventsAndCreateProposalsForWallet(/* wallet: IWalletState*/): Promise<IRegisteredProposals> {
    // const proposals: IRegisteredProposals = {}
    // const events = await wallet.getParticipationEvents()
    // for (const event of Object.values(events)) {
    //     const proposal = createProposalFromEvent(event)
    //     if (!getSelectedWallet()) {
    //         break
    //     }
    //     try {
    //         await getWalletsParticipationEventStatusForEvent(event.id, wallet)
    //         proposals[event.id] = proposal
    //     } catch (err) {
    //         proposals[event.id] = createProposalFromError(proposal, err)
    //     }
    // }
    return Promise.resolve({})
}
