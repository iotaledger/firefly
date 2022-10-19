<script lang="typescript">
    import { onMount } from 'svelte'
    import { OnboardingLayout } from '../../../../../components'
    import { Button, Icon, Text, TextType } from 'shared/components'
    import { localize } from '@core/i18n'
    import {
        OnboardingRoute,
        onboardingRoute,
        profileRecoveryRouter,
        ProfileSetupRoute,
        profileSetupRoute,
    } from '../../../../../lib/core/router'
    import { updateOnboardingProfile } from '@contexts/onboarding'

    function onContinueClick(): void {
        $profileRecoveryRouter.next()
    }

    function onBackClick(): void {
        $profileRecoveryRouter.reset()
        profileSetupRoute.set(ProfileSetupRoute.SetupRecovered)
        onboardingRoute.set(OnboardingRoute.ProfileSetup)
    }

    onMount(() => {
        updateOnboardingProfile({ hasInitialisedProfileManager: true })
    })
</script>

<OnboardingLayout {onBackClick} animation="success-desktop">
    <div slot="content">
        <div class="flex flex-col items-center bg-gray-100 dark:bg-gray-900 rounded-2xl mt-10 p-5 pt-10 relative">
            <div class="flex items-center justify-center bg-green-500 rounded-2xl absolute -top-5 w-12 h-12 check-glow">
                <Icon icon="success-check" classes="text-white" />
            </div>
            <Text type={TextType.h2} classes="mb-5 text-center"
                >{localize('views.onboarding.profileRecovery.success.title')}</Text
            >
            <Text type={TextType.p} secondary classes="mb-2"
                >{localize('views.onboarding.profileRecovery.success.body')}</Text
            >
        </div>
    </div>
    <div slot="footer">
        <Button classes="w-full" onClick={onContinueClick}>{localize('actions.continue')}</Button>
    </div>
</OnboardingLayout>

<style type="text/scss">
    .check-glow {
        box-shadow: 0px 4px 8px rgba(97, 232, 132, 0.3); // shadow-color only available in tailwind v3 and theme color is not accepted by the rgba sass function
    }
</style>
