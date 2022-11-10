import { derived } from 'svelte/store'

import { time } from '@core/app/stores/time.store'

import { timeStrongholdLastUnlocked } from './timeStrongholdLastUnlocked.store'

export const timeSinceStrongholdUnlocked = derived(
    [time, timeStrongholdLastUnlocked],
    ([$time, $timeStrongholdLastUnlocked]) =>
        Math.round(($time?.getTime() - $timeStrongholdLastUnlocked?.getTime()) / 1000) ?? 0
)
