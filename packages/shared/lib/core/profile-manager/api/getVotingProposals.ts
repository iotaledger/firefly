import { get } from 'svelte/store'
import { Event } from '@iota/wallet'
import { profileManager } from '@core/profile-manager'

export function getVotingEvents(): Promise<Event[]> {
    const manager = get(profileManager)
    return manager.getParticipationEvents()
}
