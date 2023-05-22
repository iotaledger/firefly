import { IEvmAddresses } from '@core/network/interfaces'
import { ParticipationEventId } from '@iota/wallet/types'

export interface IAccountPersistedData {
    name: string
    color: string
    hidden: boolean
    shouldRevote: boolean
    removedProposalIds?: ParticipationEventId[]
    evmAddresses: IEvmAddresses
}
