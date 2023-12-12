import { ParticipationEventRegistrationOptions } from '@iota/sdk/out/types'

import { IWalletState } from '@core/wallet/interfaces'

import { registerParticipationEvents } from './registerParticipationEvents'

export async function registerProposalsForWallets(
    registrationOptions: ParticipationEventRegistrationOptions,
    wallets: IWalletState[]
): Promise<void> {
    await Promise.all(wallets.map((wallet) => registerParticipationEvents(registrationOptions, wallet)))
}
