<script lang="typescript">
    import { activeProfile } from 'shared/lib/profile'
    import { resetRouter } from 'shared/lib/router'
    import { debounce } from 'shared/lib/utils'
    import { api, destroyActor, resetWallet } from 'shared/lib/wallet'
    import { onDestroy } from 'svelte'

    let timeout

    function handleEvent() {
        clearTimeout(timeout)

        timeout = setTimeout(lock, $activeProfile.settings.lockScreenTimeout * 60 * 1000)
    }

    function lock() {
        api.lockStronghold({
            onSuccess() {
                destroyActor($activeProfile.id)
                resetWallet()
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
    on:keydown={debounce(handleEvent)}
    on:mousemove={debounce(handleEvent)}
    on:mousedown={debounce(handleEvent)}
    on:touchstart={debounce(handleEvent)}
    on:scroll={debounce(handleEvent)} />
