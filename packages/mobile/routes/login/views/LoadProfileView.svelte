<script lang="ts">
    import { LoadingScreen } from 'shared/components'
    import { localize } from '@core/i18n'
    import { loginProgress, LOGIN_STEPS } from '@core/profile'

    let percent = 0

    $: statusMessage = $loginProgress?.stepMessage
        ? localize('views.loadProfile.loginSteps.' + $loginProgress?.stepMessage) + '...'
        : ''
    $: $loginProgress?.stepMessage, calculatePercentage()

    function calculatePercentage(): void {
        const currentStep = $loginProgress?.stepCount
        const totalSteps = Object.keys(LOGIN_STEPS).length
        const totalParts = (totalSteps * (totalSteps + 1)) / 2
        const percentageOfOnePart = 100 / totalParts
        const cumaltivePartsSoFar = (currentStep * (currentStep + 1)) / 2
        percent = percentageOfOnePart * cumaltivePartsSoFar
    }
</script>

<div class="h-full p-5">
    <LoadingScreen showProgressBar {statusMessage} {percent} />
</div>
