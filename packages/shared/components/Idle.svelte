<script lang="typescript">
    import { onMount, onDestroy } from 'svelte'
    import { activeProfile } from 'shared/lib/profile'
    import { api, destroyActor, resetWallet } from 'shared/lib/wallet'
    import { resetRouter } from 'shared/lib/router'

    let timeout

    function debounce(callback, wait = 500) {
        let _timeout
        return (...args) => {
            const context = this
            clearTimeout(_timeout)
            _timeout = setTimeout(() => callback.apply(context, args), wait)
        }
    }

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
