import { get } from 'svelte/store'
import { DEFAULT_PARTICIPATION_OVERVIEW } from '../constants'
import { participationOverview } from '../stores'

export function isSelectedAccountVoting(): boolean {
    return get(participationOverview) === DEFAULT_PARTICIPATION_OVERVIEW
}
