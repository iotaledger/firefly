import { ParticipationEventMap /* ParticipationEventRegistrationOptions*/ } from '@iota/sdk/out/types'
// import { getSelectedWallet, IWalletState } from 'shared/lib/core/wallet'
// import { addProposalsFromParticipationEventMap } from './addProposalsFromParticipationEventMap'

// TODO: https://github.com/iotaledger/firefly/issues/7947
export async function registerParticipationEvents(): Promise<ParticipationEventMap> {
// registrationOptions: ParticipationEventRegistrationOptions,
// wallet: IWalletState
    // let newRegistrationOptions = registrationOptions
    // const { removedProposalIds } = getSelectedWallet() ?? {}
    // if (removedProposalIds?.length > 0) {
    //     newRegistrationOptions = {
    //         ...registrationOptions,
    //         eventsToIgnore: removedProposalIds ?? [],
    //     }
    // }

    // const eventMap = await wallet.registerParticipationEvents(newRegistrationOptions)
    // addProposalsFromParticipationEventMap(eventMap, wallet)
    // return eventMap
    return Promise.resolve({})
}
