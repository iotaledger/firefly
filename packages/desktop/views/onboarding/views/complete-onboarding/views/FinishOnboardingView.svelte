<script lang="ts">
    import { AnimationEnum } from '@auxiliary/animation'
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { OnboardingLayout } from '@components'
    import {
        RestoreProfileType,
        completeOnboardingProcess,
        isOnboardingLedgerProfile,
        onboardingProfile,
    } from '@contexts/onboarding'
    import { mobile } from '@core/app'
    import { localize } from '@core/i18n'
    import { checkOrConnectLedger } from '@core/ledger'
    import { setStrongholdPassword } from '@core/profile-manager'
    import { Animation, Button, Icon, Text, TextHint } from '@ui'
    import { TextType } from '@ui/enums'
    import { onboardingRouter } from '@views/onboarding/onboarding-router'

    function onContinueClick(): void {
        if ($isOnboardingLedgerProfile) {
            checkOrConnectLedger(_continue)
        } else {
            void _continue()
        }
    }

    async function _continue(): Promise<void> {
        // Note: needed to cover the cases where the user has waited so long that the stronghold is locked
        if ($onboardingProfile?.restoreProfileType === RestoreProfileType.Stronghold) {
            await setStrongholdPassword($onboardingProfile.strongholdPassword)
        }
        completeOnboardingProcess()
        $onboardingRouter.next()
        return Promise.resolve()
    }
</script>

<OnboardingLayout allowBack={false}>
    <div slot="leftpane__content" class="flex flex-col space-y-6">
        <div class="relative flex flex-col items-center bg-gray-100 dark:bg-gray-900 rounded-2xl mt-10 p-10 pb-6">
            <div class="bg-green-500 rounded-2xl absolute -top-6 w-12 h-12 flex items-center justify-center">
                <Icon icon={IconEnum.SuccessCheck} classes="text-white" />
            </div>
            <Text type={TextType.h2} classes="mb-5 text-center">
                {localize('views.onboarding.congratulations.title')}
            </Text>
            <Text type={TextType.p} secondary classes="mb-2 text-center">
                {localize('views.onboarding.congratulations.body')}
            </Text>
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
        <Animation classes="setup-anim-aspect-ratio" animation={AnimationEnum.CongratulationsDesktop} />
    </div>
</OnboardingLayout>
