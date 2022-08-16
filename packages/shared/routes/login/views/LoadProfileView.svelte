<script lang="ts">
    import { login } from '@core/profile'
    import { LoadingScreen } from 'shared/components'
    import { createEventDispatcher, onMount } from 'svelte'

    const dispatch = createEventDispatcher()

    const statusMessage = 'Loading profile...'
    const percent = 10

    onMount(async () => {
        try {
            await login()
            dispatch('next')
        } catch {
            dispatch('previous')
        }
    })
</script>

<LoadingScreen showProgressBar {statusMessage} {percent} />
