<script lang="ts">
    import { OnboardingLayout } from '../../../../../components'
    import { Button, Icon, Text, TextType } from 'shared/components'
    import { localize } from '@core/i18n'
    import { BASE_TOKEN, NetworkProtocol } from '@core/network'
    import { shimmerClaimingRouter } from '../../../../../lib/routers'
    import { formatTokenAmountBestMatch } from '@core/wallet'
    import { onboardingProfile, sumTotalClaimedRewards } from '@contexts/onboarding'

    $: totalRewards = sumTotalClaimedRewards($onboardingProfile?.shimmerClaimingAccounts)

    function onContinueClick(): void {
        $shimmerClaimingRouter.next()
    }
</script>

<OnboardingLayout allowBack={false}>
    <div slot="content">
        <div
            class="relative flex flex-col h-full items-center bg-gray-100 dark:bg-gray-900 rounded-2xl mt-10 p-10 pb-6"
        >
            <div class="bg-green-500 rounded-2xl absolute -top-6 w-12 h-12 flex items-center justify-center">
                <Icon icon="success-check" classes="text-white" />
            </div>
            <Text type={TextType.h3} classes="mb-5 text-center">
                {localize('views.onboarding.shimmerClaiming.success.title')}
            </Text>
            <Text type={TextType.p} secondary fontSize="15" classes="mb-5 text-center">
                {localize('views.onboarding.shimmerClaiming.success.body')}
            </Text>
            <div class="flex flex-col justify-center items-center">
                <Text type={TextType.p} fontSize="15" highlighted
                    >{localize('views.onboarding.shimmerClaiming.success.totalRewards')}</Text
                >
                <Text type={TextType.h3}
                    >{formatTokenAmountBestMatch(totalRewards, BASE_TOKEN[NetworkProtocol.Shimmer])}</Text
                >
            </div>
        </div>
    </div>
    <div slot="footer">
        <Button classes="w-full" onClick={onContinueClick}>
            {localize('actions.continue')}
        </Button>
    </div>
</OnboardingLayout>
