import { writable } from 'svelte/store'
import { LOGIN_STEPS } from '../constants'
import { ILoginProgress } from '../interfaces'

export const loginProgress = writable<ILoginProgress>({ stepCount: 0, stepMessage: LOGIN_STEPS[0] })

export function incrementLoginProgress(): void {
    loginProgress.update((loginProgress) => ({
        stepCount: loginProgress?.stepCount + 1,
        stepMessage: LOGIN_STEPS?.[loginProgress?.stepCount + 1] ?? '',
    }))
}

export function resetLoginProgress(): void {
    loginProgress.set({
        stepCount: 0,
        stepMessage: LOGIN_STEPS?.[0],
    })
}
