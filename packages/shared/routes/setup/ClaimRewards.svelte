<script lang="typescript">
    import { Animation, Button, Icon, OnboardingLayout, Text, WalletList } from 'shared/components'
    import { localize } from '@core/i18n'

    function handleBackClick(): void {
        // console.log('BACK TO PREVIOUS PAGE!')
    }

    function handleUseBalanceFinderClick(): void {
        // console.log('FINDING BALANCES!')
    }

    function handleClaimRewardsClick(): void {
        // console.log('CLAIMING REWARDS!')
    }
</script>

<OnboardingLayout onBackClick={handleBackClick}>
    <div slot="title">
        <Text type="h2">Your Shimmer staking rewards</Text>
    </div>
    <div slot="leftpane__content">
        <Text type="p" secondary classes="mb-5">
            Please check that your Shimmer staking rewards are correct. If not, please use the balance finder.
        </Text>
        <WalletList />
    </div>
    <div slot="leftpane__action">
        <Button classes="w-full mb-5" secondary onClick={handleUseBalanceFinderClick}>Use balance finder</Button>
        <Button classes="w-full" onClick={handleClaimRewardsClick}>Claim rewards</Button>
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center {true && 'bg-pastel-yellow dark:bg-gray-900'}">
        <Animation classes="setup-anim-aspect-ratio" animation="import-desktop" />
    </div>
</OnboardingLayout>
