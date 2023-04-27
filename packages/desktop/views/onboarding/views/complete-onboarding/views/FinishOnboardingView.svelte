<script lang="ts">
    import { OnboardingLayout } from '@components'
    import {
        ProfileRecoveryType,
        completeOnboardingProcess,
        isOnboardingLedgerProfile,
        onboardingProfile,
    } from '@contexts/onboarding'
    import { mobile } from '@core/app'
    import { localize } from '@core/i18n'
    import { checkOrConnectLedger } from '@core/ledger'
    import { Animation, Button, Icon, Text, TextHint } from '@ui'
    import { onboardingRouter } from '@views/onboarding/onboarding-router'
    import { onMount } from 'svelte'

    // TODO: what are these localised bodies they are not self documenting?
    let localizedBody = 'body'

    function onContinueClick(): void {
        if ($isOnboardingLedgerProfile) {
            checkOrConnectLedger(_continue)
        } else {
            void _continue()
        }
    }

    function _continue(): Promise<void> {
        completeOnboardingProcess()
        $onboardingRouter.next()
        return Promise.resolve()
    }

    onMount(() => {
        if ($onboardingProfile?.recoveryType === ProfileRecoveryType.FireflyLedger) {
            localizedBody = 'fireflyLedgerBody'
        }
    })
</script>

<OnboardingLayout allowBack={false}>
    <div slot="leftpane__content" class="flex flex-col space-y-6">
        <div class="relative flex flex-col items-center bg-gray-100 dark:bg-gray-900 rounded-2xl mt-10 p-10 pb-6">
            <div class="bg-green-500 rounded-2xl absolute -top-6 w-12 h-12 flex items-center justify-center">
                <Icon icon="success-check" classes="text-white" />
            </div>
            <Text type="h2" classes="mb-5 text-center">{localize('views.onboarding.congratulations.title')}</Text>
            <Text type="p" secondary classes="mb-2 text-center"
                >{localize(`views.onboarding.congratulations.${localizedBody}`)}</Text
            >
        </div>
        {#if $isOnboardingLedgerProfile}
            <TextHint warning text={localize('views.onboarding.congratulations.ledgerHint')} />
        {/if}
    </div>
    <div slot="leftpane__action">
        <Button classes="w-full" onClick={onContinueClick}>
            {localize('actions.finishSetup')}
        </Button>
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center {!$mobile && 'bg-pastel-yellow dark:bg-gray-900'}">
        <Animation classes="setup-anim-aspect-ratio" animation="congratulations-desktop" />
    </div>
</OnboardingLayout>
