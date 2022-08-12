<script lang="typescript">
    import { onMount } from 'svelte'
    import { Animation, Button, OnboardingLayout, ShimmerClaimingAccountList, Spinner, Text } from 'shared/components'
    import { localize } from '@core/i18n'
    import { shimmerClaimingRouter } from '@core/router'
    import {
        claimShimmerRewards,
        findShimmerRewards,
        findShimmerRewardsForAccount,
        IShimmerClaimingAccount,
        onboardingProfile,
    } from '@contexts/onboarding'

    let shimmerClaimingAccounts: IShimmerClaimingAccount[]
    $: shimmerClaimingAccounts = $onboardingProfile?.shimmerClaimingAccounts ?? []

    let isSearchingForRewards = false
    let hasSearchedForRewardsBefore = false

    let isClaimingRewards = false
    let hasTriedClaimingRewards = false

    $: shouldSearchForRewardsButtonBeDisabled = isSearchingForRewards || isClaimingRewards
    $: shouldClaimRewardsButtonBeDisabled =
        !shimmerClaimingAccounts.some((shimmerClaimingAccount) => shimmerClaimingAccount.unclaimedRewards > 0) ||
        isSearchingForRewards ||
        isClaimingRewards

    function onBackClick(): void {
        $shimmerClaimingRouter.previous()
    }

    async function onUseBalanceFinderClick(): Promise<void> {
        try {
            isSearchingForRewards = true
            hasSearchedForRewardsBefore = true
            await findShimmerRewards()
        } catch (err) {
            console.error(err)
        } finally {
            isSearchingForRewards = false
        }
    }

    async function onClaimRewardsClick(): Promise<void> {
        try {
            isClaimingRewards = true
            hasTriedClaimingRewards = true
            await claimShimmerRewards()
            // $shimmerClaimingRouter.next()
        } catch (err) {
            console.error(err)
        } finally {
            isClaimingRewards = false
        }
    }

    async function onMountHelper(): Promise<void> {
        /**
         * NOTE: If the user only has one Shimmer claiming account,
         * it is likely they have just navigated to this view for
         * the first time. If they truly only have one account
         * with unclaimed rewards, then this will just sync every
         * time the user navigates to this view.
         */
        if ($onboardingProfile?.shimmerClaimingAccounts?.length === 1) {
            try {
                isSearchingForRewards = true
                await findShimmerRewardsForAccount($onboardingProfile?.shimmerClaimingAccounts[0])
            } catch (err) {
                console.error(err)
            } finally {
                isSearchingForRewards = false
            }
        }
    }

    onMount(() => {
        void onMountHelper()
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
