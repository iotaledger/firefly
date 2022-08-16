<script lang="ts">
    import { login, loginProgress, LOGIN_STEPS, resetLoginProgress } from '@core/profile'
    import { LoadingScreen } from 'shared/components'
    import { createEventDispatcher, onMount } from 'svelte'

    const dispatch = createEventDispatcher()

    $: statusMessage = $loginProgress?.stepMessage
    $: percent = ($loginProgress?.stepCount / Object.keys(LOGIN_STEPS).length) * 100

    onMount(async () => {
        try {
            await login()
            setTimeout(() => {
                dispatch('next')
                resetLoginProgress()
            }, 500)
        } catch {
            dispatch('previous')
            resetLoginProgress()
        }
    })
</script>

<LoadingScreen showProgressBar {statusMessage} {percent} />
