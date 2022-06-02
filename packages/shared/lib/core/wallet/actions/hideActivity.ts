import { queriedActivities } from '../stores'

export function hideActivity(id: string): void {
    queriedActivities.update((state) => {
        const activity = state.find((activity) => activity.id === id)
        activity.isHidden = true
        return state
    })
}
