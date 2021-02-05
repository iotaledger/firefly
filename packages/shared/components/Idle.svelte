<script lang="typescript">
    import { onMount, onDestroy } from 'svelte'
    import { getActiveProfile } from 'shared/lib/app'
    import { api, destroyActor, clearWallet } from 'shared/lib/wallet'
    import { resetRouter } from 'shared/lib/router'

    let timeout

    function handleEvent() {
        clearTimeout(timeout)

        timeout = setTimeout(lock, 5000)
    }

    function lock() {
        api.lockStronghold({
            onSuccess() {
                destroyActor(getActiveProfile().id)
                clearWallet()
                resetRouter()
            },
            onError(error) {
                console.error(error)
            },
        })
    }

    onDestroy(() => {
        clearTimeout(timeout)
    })
</script>

<svelte:window
    on:keydown={handleEvent}
    on:mousemove={handleEvent}
    on:mousedown={handleEvent}
    on:touchstart={handleEvent}
    on:scroll={handleEvent} />
