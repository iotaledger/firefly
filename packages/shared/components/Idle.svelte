<script lang="typescript">
    import { logout, lastActiveAt } from 'shared/lib/app'
    import { activeProfile } from 'shared/lib/profile'
    import { debounce } from 'shared/lib/utils'
    import { onDestroy } from 'svelte'
    import { get } from 'svelte/store'

    let timeout
    let isDestroyed = false

    function handleEvent(): void {
        // The events are debounced so the component can get onDestroy
        // called and be followed by a debounced handleEvent so
        // make sure the idle doesn't get triggered again when its
        // already destroyed
        if (!isDestroyed) {
            clearTimeout(timeout)

            const ap = get(activeProfile)
            if (ap) {
                const now = new Date()
                const timeoutDuration = ap.settings.lockScreenTimeout * 60 * 1000

                if(!isIdleTimeValid(now, timeoutDuration))
                    lock()

                timeout = setTimeout(lock, timeoutDuration)
            }
        }
    }

    function isIdleTimeValid(newLastActiveTime: Date, timeoutDuration: number): boolean {
        /**
         * CAUTION: An attacker may be able to manipulate the date / time on his device, so
         * it is necessary to ensure that the newLastActiveTime is really newer than the old one.
         */
        const oldLastActiveTime = get(lastActiveAt)
        const isValidIdleTimestamp = newLastActiveTime >= oldLastActiveTime

        const idleDuration = calculateUpdatedIdleDuration(newLastActiveTime)
        const isValidIdleDuration = idleDuration < timeoutDuration

        return isValidIdleTimestamp && isValidIdleDuration
    }

    function calculateUpdatedIdleDuration(newLastActiveTime: Date): number {
        const oldLastActiveTime = get(lastActiveAt)

        lastActiveAt.set(newLastActiveTime)

        return newLastActiveTime - oldLastActiveTime
    }

    function lock(): void {
        void logout()
    }

    onDestroy(() => {
        isDestroyed = true
        clearTimeout(timeout)
    })
</script>

<svelte:window
    on:keydown={debounce(handleEvent)}
    on:mousemove={debounce(handleEvent)}
    on:mousedown={debounce(handleEvent)}
    on:touchstart={debounce(handleEvent)}
    on:scroll={debounce(handleEvent)}/>
