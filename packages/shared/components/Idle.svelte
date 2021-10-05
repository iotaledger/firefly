<script lang="typescript">
    import { logout } from 'shared/lib/app'
    import { activeProfile } from 'shared/lib/profile'
    import { debounce } from 'shared/lib/utils'
    import { onDestroy } from 'svelte'
    import { get } from 'svelte/store'
    import { isIdleTimeValid, MILLISECONDS_PER_SECOND, SECONDS_PER_MINUTE } from 'shared/lib/time'

    let timeout
    let isDestroyed = false

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
                const timeoutDuration =
                    MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE * ap.settings.lockScreenTimeout

                if(!isIdleTimeValid(new Date(), timeoutDuration))
                    lock()

                timeout = setTimeout(lock, timeoutDuration)
            }
        }
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
    on:scroll={debounce(updateIdleTime)}/>
