import { BooleanFilterOption } from '@core/utils/enums/filters'
import { writable, Writable } from 'svelte/store'
import { ProposalStatus, ProposalType } from '../enums'
import { ProposalFilter } from '../interfaces'

export const proposalFilter: Writable<ProposalFilter> = writable({
    phase: {
        active: false,
        type: 'selection',
        labelKey: 'filters.phase.label',
        localeKey: 'pills.proposalStatus',
        selected: ProposalStatus.Commencing,
        choices: [ProposalStatus.Commencing, ProposalStatus.Upcoming, ProposalStatus.Holding, ProposalStatus.Ended],
    },
    type: {
        active: false,
        type: 'selection',
        localeKey: 'filters.proposalType',
        selected: ProposalType.Official,
        choices: [ProposalType.Official, ProposalType.Custom],
    },
    participated: {
        active: false,
        type: 'selection',
        localeKey: 'filters.participated',
        selected: BooleanFilterOption.Yes,
        choices: [BooleanFilterOption.Yes, BooleanFilterOption.No],
    },
})
