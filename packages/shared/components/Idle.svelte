<script lang="typescript">
    import { logout } from 'shared/lib/app'
    import { activeProfile } from 'shared/lib/profile'
    import { debounce } from 'shared/lib/utils'
    import { onDestroy } from 'svelte'
    import { get } from 'svelte/store'

    let timeout
    let isDestroyed = false

    function handleEvent() {
        // The events are debounced so the component can get onDestroy
        // called and be followed by a debounced handleEvent so
        // make sure the idle doesn't get triggered again when its
        // already destroyed
        if (!isDestroyed) {
            clearTimeout(timeout)

            const ap = get(activeProfile)
            if (ap) {
                timeout = setTimeout(lock, ap.settings.lockScreenTimeout * 60 * 1000)
            }
        }
    }

    function lock() {
        logout()
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
    on:scroll={debounce(handleEvent)}
/>
