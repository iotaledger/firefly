<script lang="ts">
    import { localize } from '@core/i18n'
    import { loginProgress, LOGIN_STEPS } from '@core/profile'
    import { Animation, Text, ProgressBar } from 'shared/components'

    let percent = 0
    let statusMessage = ''

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

<div class="flex flex-col justify-center align-center items-center w-full h-full">
    <Animation classes="h-64 w-64" animation="loading-desktop" loop={true} renderer="canvas" />
    <progress-wrapper class="max-w-md w-full">
        <ProgressBar {percent} message={statusMessage} />
    </progress-wrapper>
    <Text classes="pt-8">{statusMessage}</Text>
</div>
