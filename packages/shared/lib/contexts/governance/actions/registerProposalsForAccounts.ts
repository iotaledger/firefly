import { ParticipationEventRegistrationOptions } from '@iota/sdk/out/types'

import { IWalletState } from '@core/wallet/interfaces'

import { registerParticipationEvents } from './registerParticipationEvents'

export async function registerProposalsForAccounts(
    registrationOptions: ParticipationEventRegistrationOptions,
    accounts: IWalletState[]
): Promise<void> {
    await Promise.all(accounts.map((account) => registerParticipationEvents(registrationOptions, account)))
}
