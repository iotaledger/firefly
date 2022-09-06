<script lang="typescript">
    import { Animation, Button, Icon, OnboardingLayout, Text } from 'shared/components'
    import { onDestroy, onMount } from 'svelte'
    import { mobile } from '@core/app'
    import { onboardingRouter, ledgerSetupRouter } from '@core/router'
    import { localize } from '@core/i18n'
    import { completeOnboardingProcess, ProfileRecoveryType } from '@contexts/onboarding'
    import { onboardingProfile } from '@contexts/onboarding'

    // TODO: what are these localised bodies they are not self documenting?
    let localizedBody = 'body'

    function onContinueClick(): void {
        completeOnboardingProcess()
        $onboardingRouter.next()
    }

    onMount(() => {
        if ($onboardingProfile?.recoveryType === ProfileRecoveryType.FireflyLedger) {
            localizedBody = 'fireflyLedgerBody'
        }
    })

    onDestroy(() => {
        $ledgerSetupRouter.reset()
    })
</script>

<OnboardingLayout allowBack={false}>
    <div slot="leftpane__content">
        <div class="relative flex flex-col items-center bg-gray-100 dark:bg-gray-900 rounded-2xl mt-10 p-10 pb-6">
            <div class="bg-green-500 rounded-2xl absolute -top-6 w-12 h-12 flex items-center justify-center">
                <Icon icon="success-check" classes="text-white" />
            </div>
            <Text type="h2" classes="mb-5 text-center">{localize('views.onboarding.congratulations.title')}</Text>
            <Text type="p" secondary classes="mb-2 text-center"
                >{localize(`views.onboarding.congratulations.${localizedBody}`)}</Text
            >
        </div>
    </div>
    <div slot="leftpane__action">
        <Button autofocus classes="w-full" onClick={onContinueClick}>
            {localize('actions.finishSetup')}
        </Button>
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center {!$mobile && 'bg-pastel-yellow dark:bg-gray-900'}">
        <Animation classes="setup-anim-aspect-ratio" animation="congratulations-desktop" />
    </div>
</OnboardingLayout>
