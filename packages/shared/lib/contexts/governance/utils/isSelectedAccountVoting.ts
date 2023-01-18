import { get } from 'svelte/store'
import { DEFAULT_PARTICIPATION_OVERVIEW } from '../constants'
import { participationOverview, updateParticipationOverview } from '../stores'

export async function isSelectedAccountVoting(): Promise<boolean> {
    await updateParticipationOverview()
    return get(participationOverview) === DEFAULT_PARTICIPATION_OVERVIEW
}
