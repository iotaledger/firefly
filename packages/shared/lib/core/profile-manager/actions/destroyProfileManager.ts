import { profileManager } from '../store'

export const destroyProfileManager = (): void => {
    // TODO: destroy manager properly with api call?
    profileManager.set(null)
}
