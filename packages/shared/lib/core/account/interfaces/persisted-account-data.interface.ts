import { IEvmAddresses } from '@core/network/interfaces'
import { ParticipationEventId } from '@iota/wallet/types'

export interface IPersistedAccountData {
    name: string
    color: string
    hidden: boolean
    shouldRevote: boolean
    removedProposalIds?: ParticipationEventId[]
    evmAddresses: IEvmAddresses
}
