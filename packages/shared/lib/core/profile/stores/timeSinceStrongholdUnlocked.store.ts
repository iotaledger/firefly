import { time } from '@core/app'
import { derived } from 'svelte/store'
import { timeStrongholdLastUnlocked } from './timeStrongholdLastUnlocked.store'

const start: unknown = new Date()

export const timeSinceStrongholdUnlocked = derived(
    [time, timeStrongholdLastUnlocked],
    ([$time, $timeStrongholdLastUnlocked]) =>
        Math.round(($time?.getTime() - $timeStrongholdLastUnlocked?.getTime()) / 1000) ?? 0
)
