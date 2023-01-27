import { BooleanFilterOption, OrderOption } from '@core/utils/enums/filters'
import { writable, Writable } from 'svelte/store'
import { ProposalFilter, ProposalStatus, ProposalType, ProposalOrderOption } from '..'

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
    order: {
        active: false,
        type: 'order',
        localeKey: 'filters.proposalOrder',
        selected: ProposalOrderOption.Name,
        ascDesc: OrderOption.Asc,
        choices: [ProposalOrderOption.Name, ProposalOrderOption.Phase],
    },
})
