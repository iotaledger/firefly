import { writable } from 'svelte/store'
import { LOGIN_STEPS } from '../constants'
import { ILoginProgress } from '../interfaces'

export const loginProgress = writable<ILoginProgress>({ stepCount: 0, stepMessage: LOGIN_STEPS[0] })

export function incrementLoginProgress(incrementBy: number = 1): void {
    loginProgress.update((loginProgress) => ({
        stepCount: loginProgress?.stepCount + incrementBy,
        stepMessage: LOGIN_STEPS?.[loginProgress?.stepCount + incrementBy] ?? '',
    }))
}

export function resetLoginProgress(): void {
    loginProgress.set({
        stepCount: 0,
        stepMessage: LOGIN_STEPS?.[0],
    })
}
