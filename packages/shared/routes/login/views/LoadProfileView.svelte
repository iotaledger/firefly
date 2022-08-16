<script lang="ts">
    import { onMount } from 'svelte'
    import { LoadingScreen } from 'shared/components'
    import { localize } from '@core/i18n'
    import { login, loginProgress, LOGIN_STEPS, resetLoginProgress } from '@core/profile'
    import { loginRouter } from '@core/router'

    $: statusMessage = localize('views.loadProfile.loginSteps.' + $loginProgress?.stepMessage) + '...'
    $: percent = ($loginProgress?.stepCount / Object.keys(LOGIN_STEPS).length) * 100

    onMount(async () => {
        try {
            await login()
            setTimeout(() => {
                $loginRouter.next()
                resetLoginProgress()
            }, 500)
        } catch {
            $loginRouter.previous()
            resetLoginProgress()
        }
    })
</script>

<LoadingScreen showProgressBar {statusMessage} {percent} />
