import { BooleanFilterOption } from '@core/utils/enums/filters'
import { writable, Writable } from 'svelte/store'
import { ProposalFilter } from '..'

export const proposalFilter: Writable<ProposalFilter> = writable({
    phase: {
        active: false,
        type: 'selection',
        localeKey: 'filters.phase',
        selected: BooleanFilterOption.Yes,
        choices: [BooleanFilterOption.Yes, BooleanFilterOption.No],
    },
    type: {
        active: false,
        type: 'selection',
        localeKey: 'filters.type',
        selected: BooleanFilterOption.Yes,
        choices: [BooleanFilterOption.Yes, BooleanFilterOption.No],
    },
    participated: {
        active: false,
        type: 'selection',
        localeKey: 'filters.participated',
        selected: BooleanFilterOption.Yes,
        choices: [BooleanFilterOption.Yes, BooleanFilterOption.No],
    },
})
