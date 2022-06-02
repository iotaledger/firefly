import { queriedActivities } from '../stores'

// TODO: We need to save all of the hidden activities in local storage
// TBD: 2 options for hidding:
// _- in the selected-account-activities we always filter out all of the activities that are saved in the localstorage
//  - we initialize the activities with a "isHidden" flag -> better performance, but more redundant code
export function hideActivity(id: string): void {
    queriedActivities.update((state) => {
        const activity = state.find((activity) => activity.id === id)
        activity.isHidden = true
        return state
    })
}
