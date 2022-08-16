<script lang="ts">
    import { LoadingScreen } from 'shared/components'
    import { localize } from '@core/i18n'
    import { loginProgress, LOGIN_STEPS } from '@core/profile'

    $: statusMessage = $loginProgress?.stepMessage
        ? localize('views.loadProfile.loginSteps.' + $loginProgress?.stepMessage) + '...'
        : ''
    $: percent = ($loginProgress?.stepCount / Object.keys(LOGIN_STEPS).length) * 100
</script>

<LoadingScreen showProgressBar {statusMessage} {percent} />
