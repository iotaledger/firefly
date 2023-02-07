import { proposalFilter } from '@contexts/governance/stores'
import { activityFilter, assetFilter } from '@core/wallet'

export function clearFilters(): void {
    proposalFilter.update((state) => {
        for (const key in state) {
            state[key].active = false
            state[key].value = undefined
        }
        return state
    })

    assetFilter.update((state) => {
        for (const key in state) {
            state[key].active = false
            state[key].value = undefined
        }
        return state
    })

    activityFilter.update((state) => {
        for (const key in state) {
            state[key].active = false
            state[key].value = undefined
        }
        return state
    })
}
