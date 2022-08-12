<script lang="typescript">
    import { onMount } from 'svelte'
    import { Animation, Button, OnboardingLayout, ShimmerClaimingAccountList, Spinner, Text } from 'shared/components'
    import { localize } from '@core/i18n'
    import { shimmerClaimingRouter } from '@core/router'
    import {
        claimShimmerRewards,
        findShimmerRewards,
        initialiseShimmerClaimingAccount,
        IShimmerClaimingAccount,
    } from '@contexts/onboarding'

    let shimmerClaimingAccounts: IShimmerClaimingAccount[] = []

    let isSearchingForRewards = false
    let hasSearchedForRewardsBefore = false

    let isClaimingRewards = false
    let hasTriedClaimingRewards = false

    $: shouldSearchForRewardsButtonBeDisabled = isSearchingForRewards || isClaimingRewards
    $: shouldClaimRewardsButtonBeDisabled =
        !shimmerClaimingAccounts.some((shimmerClaimingAccount) => shimmerClaimingAccount.unclaimedRewards > 0) ||
        isSearchingForRewards

    function onBackClick(): void {
        $shimmerClaimingRouter.previous()
    }

    function refreshView(): void {
        shimmerClaimingAccounts = shimmerClaimingAccounts
    }

    async function onUseBalanceFinderClick(): Promise<void> {
        isSearchingForRewards = true
        hasSearchedForRewardsBefore = true

        await findShimmerRewards()
        refreshView()

        isSearchingForRewards = false
    }

    async function onClaimRewardsClick(): Promise<void> {
        isClaimingRewards = true
        hasTriedClaimingRewards = true

        await claimShimmerRewards()
        refreshView()

        isClaimingRewards = false

        // $shimmerClaimingRouter.next()
    }

    async function initialiseFirstShimmerClaimingAccount(): Promise<void> {
        isSearchingForRewards = true

        const shimmerClaimingAccount = await initialiseShimmerClaimingAccount()
        shimmerClaimingAccounts.push(shimmerClaimingAccount)

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
        <Button
            classes="w-full mb-5"
            disabled={shouldSearchForRewardsButtonBeDisabled}
            secondary
            onClick={onUseBalanceFinderClick}
        >
            {#if isSearchingForRewards}
                <Spinner message={localize('actions.searching')} busy={true} classes="justify-center items-center" />
            {:else}
                {localize(`actions.${hasSearchedForRewardsBefore ? 'searchAgain' : 'searchForRewards'}`)}
            {/if}
        </Button>
        <Button classes="w-full" disabled={shouldClaimRewardsButtonBeDisabled} onClick={onClaimRewardsClick}>
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
