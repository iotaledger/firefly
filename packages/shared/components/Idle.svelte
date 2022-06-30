<script lang="typescript">
    import { lastActiveAt, logout } from 'shared/lib/app'
    import { activeProfile } from 'shared/lib/profile'
    import { MILLISECONDS_PER_SECOND, SECONDS_PER_MINUTE } from 'shared/lib/time'
    import { debounce } from 'shared/lib/utils'
    import { wallet } from 'shared/lib/wallet'
    import { onDestroy } from 'svelte'
    import { get } from 'svelte/store'

    const { accountsLoaded } = $wallet

    let timeout
    let isDestroyed = false

    // Initialize idle time when the accounts are loaded.
    // Important for mobile as the user can simply login and not touch the screen for a while.
    $: if ($accountsLoaded) {
        debounce(updateIdleTime)()
    }

    function updateIdleTime(): void {
        /**
         * CAUTION: Events must be debounced so that the component can have
         * onDestroy properly called. Without this there is a risk of an event
         * triggering again after this component has already been destroyed.
         */
        if (!isDestroyed) {
            clearTimeout(timeout)

            const ap = get(activeProfile)
            if (ap) {
                const timeoutDuration = MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE * ap.settings.lockScreenTimeout

                if (!isIdleTimeValid(new Date(), timeoutDuration)) lock()

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

        return newLastActiveTime.getTime() - oldLastActiveTime.getTime()
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
    on:keydown={debounce(updateIdleTime)}
    on:mousemove={debounce(updateIdleTime)}
    on:mousedown={debounce(updateIdleTime)}
    on:touchstart={debounce(updateIdleTime)}
    on:scroll={debounce(updateIdleTime)}
/>
