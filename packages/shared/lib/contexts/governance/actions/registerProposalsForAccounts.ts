import { ParticipationEventRegistrationOptions } from '@iota/sdk/out/types'

import { IAccountState } from '@core/account/interfaces'

import { registerParticipationEvents } from './registerParticipationEvents'

export async function registerProposalsForAccounts(
    registrationOptions: ParticipationEventRegistrationOptions,
    accounts: IAccountState[]
): Promise<void> {
    await Promise.all(accounts.map((account) => registerParticipationEvents(registrationOptions, account)))
}
