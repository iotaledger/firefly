<script lang="typescript">
    import { Animation, Button, Icon, OnboardingLayout, Text } from 'shared/components'
    import { mobile } from '@core/app'
    import { localize } from '@core/i18n'
    import { BASE_TOKEN, NetworkProtocol } from '@core/network'
    import { shimmerClaimingRouter } from '@core/router'
    import { formatTokenAmountBestMatch } from '@core/wallet'
    import { onboardingProfile, sumTotalClaimedRewards } from '@contexts/onboarding'

    $: totalRewards = sumTotalClaimedRewards($onboardingProfile?.shimmerClaimingAccounts)

    function onContinueClick(): void {
        $shimmerClaimingRouter.next()
    }
</script>

<OnboardingLayout allowBack={false}>
    <div slot="leftpane__content">
        <div class="relative flex flex-col items-center bg-gray-100 dark:bg-gray-900 rounded-2xl mt-10 p-10 pb-6">
            <div class="bg-green-500 rounded-2xl absolute -top-6 w-12 h-12 flex items-center justify-center">
                <Icon icon="success-check" classes="text-white" />
            </div>
            <Text type="h2" classes="mb-5 text-center"
                >{localize('views.onboarding.shimmerClaiming.success.title')}</Text
            >
            <Text type="p" secondary classes="mb-5 text-center">
                {localize('views.onboarding.shimmerClaiming.success.body')}
            </Text>
            <div class="flex flex-col justify-center items-center">
                <Text type="p" highlighted>{localize('views.onboarding.shimmerClaiming.success.totalRewards')}</Text>
                <Text type="h3">{formatTokenAmountBestMatch(totalRewards, BASE_TOKEN[NetworkProtocol.Shimmer])}</Text>
            </div>
        </div>
    </div>
    <div slot="leftpane__action">
        <Button classes="w-full" onClick={onContinueClick}>
            {localize('actions.continue')}
        </Button>
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center {!$mobile && 'bg-pastel-yellow dark:bg-gray-900'}">
        <Animation classes="setup-anim-aspect-ratio" animation="congratulations-desktop" />
    </div>
</OnboardingLayout>
