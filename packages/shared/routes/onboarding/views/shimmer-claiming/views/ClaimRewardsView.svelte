<script lang="typescript">
    import { onMount } from 'svelte'
    import { Animation, Button, OnboardingLayout, ShimmerClaimingAccountList, Spinner, Text } from 'shared/components'
    import { localize } from '@core/i18n'
    import { shimmerClaimingRouter } from '@core/router'
    import { initialiseShimmerClaimingAccount, IShimmerClaimingAccount } from '@contexts/onboarding'

    let shimmerClaimingAccounts: IShimmerClaimingAccount[] = []

    function onBackClick(): void {
        $shimmerClaimingRouter.previous()
    }

    let isSearchingForRewards = false
    let hasSearchedForRewardsBefore = false

    function refreshView(): void {
        shimmerClaimingAccounts = shimmerClaimingAccounts
    }

    function onUseBalanceFinderClick(): void {
        isSearchingForRewards = true
        hasSearchedForRewardsBefore = true

        // do stuff
        refreshView()

        setTimeout(() => {
            isSearchingForRewards = false
        }, 2000)
    }

    let isClaimingRewards = false
    let hasTriedClaimingRewards = false

    function onClaimRewardsClick(): void {
        isClaimingRewards = true
        hasTriedClaimingRewards = true

        // do stuff
        refreshView()

        setTimeout(() => {
            isClaimingRewards = false
        }, 2000)

        // $shimmerClaimingRouter.next()
    }

    async function initialiseFirstShimmerClaimingAccount(): Promise<void> {
        isSearchingForRewards = true
        shimmerClaimingAccounts.push(await initialiseShimmerClaimingAccount())
        refreshView()
        isSearchingForRewards = false
    }

    onMount(() => {
        void initialiseFirstShimmerClaimingAccount()
    })
</script>

<OnboardingLayout {onBackClick}>
    <div slot="title">
        <Text type="h2">
            {localize('views.onboarding.shimmerClaiming.claimRewards.title')}
        </Text>
    </div>
    <div slot="leftpane__content" class="h-full flex flex-col">
        <Text type="p" secondary classes="mb-5">
            {localize('views.onboarding.shimmerClaiming.claimRewards.body')}
        </Text>
        <ShimmerClaimingAccountList {shimmerClaimingAccounts} />
    </div>
    <div slot="leftpane__action">
        <Button classes="w-full mb-5" secondary onClick={onUseBalanceFinderClick}>
            {#if isSearchingForRewards}
                <Spinner message={localize('actions.searching')} busy={true} classes="justify-center items-center" />
            {:else}
                {localize(`actions.${hasSearchedForRewardsBefore ? 'searchAgain' : 'searchForRewards'}`)}
            {/if}
        </Button>
        <Button classes="w-full" onClick={onClaimRewardsClick}>
            {#if isClaimingRewards}
                <Spinner message={localize('actions.claiming')} busy={true} classes="justify-center items-center" />
            {:else}
                {localize(`actions.${hasTriedClaimingRewards ? 'rerunClaimProcess' : 'claimRewards'}`)}
            {/if}
        </Button>
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center {true && 'bg-pastel-yellow dark:bg-gray-900'}">
        <Animation classes="setup-anim-aspect-ratio" animation="import-desktop" />
    </div>
</OnboardingLayout>
