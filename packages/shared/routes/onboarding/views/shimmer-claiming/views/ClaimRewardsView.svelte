<script lang="typescript">
    import { onDestroy, onMount } from 'svelte'
    import { Animation, Button, OnboardingLayout, ShimmerClaimingAccountList, Spinner, Text } from 'shared/components'
    import { localize } from '@core/i18n'
    import { checkOrConnectLedger, pollLedgerNanoStatus, stopPollingLedgerNanoStatus } from '@core/ledger'
    import { unsubscribeFromWalletApiEvents } from '@core/profile-manager'
    import { shimmerClaimingRouter } from '@core/router'
    import {
        canUserClaimRewards,
        claimShimmerRewards,
        ClaimShimmerRewardsError,
        findShimmerRewards,
        FindShimmerRewardsError,
        findShimmerRewardsForAccount,
        hasUserClaimedRewards,
        isOnboardingLedgerProfile,
        onboardingProfile,
        ShimmerClaimingAccountState,
        shimmerClaimingProfileManager,
        subscribeToWalletApiEventsForShimmerClaiming,
    } from '@contexts/onboarding'
    import { closePopup } from '@lib/popup'

    $: shimmerClaimingAccounts = $onboardingProfile?.shimmerClaimingAccounts ?? []

    let isSearchingForRewards = false
    let hasSearchedForRewardsBefore = false

    let hasTriedClaimingRewards = false

    $: isClaimingRewards = shimmerClaimingAccounts.some(
        (shimmerClaimingAccount) => shimmerClaimingAccount.state === ShimmerClaimingAccountState.Claiming
    )

    $: shouldSearchForRewardsButtonBeEnabled = !isSearchingForRewards && !isClaimingRewards
    $: shouldClaimRewardsButtonBeEnabled =
        canUserClaimRewards(shimmerClaimingAccounts) && !isSearchingForRewards && !isClaimingRewards
    $: shouldShowContinueButton = hasUserClaimedRewards(shimmerClaimingAccounts)

    function onBackClick(): void {
        $shimmerClaimingRouter.previous()
    }

    async function searchForRewards(): Promise<void> {
        try {
            isSearchingForRewards = true
            hasSearchedForRewardsBefore = true
            if ($isOnboardingLedgerProfile) {
                stopPollingLedgerNanoStatus()
            }
            await findShimmerRewards()
        } catch (err) {
            throw new FindShimmerRewardsError()
        } finally {
            if ($isOnboardingLedgerProfile) {
                pollLedgerNanoStatus()
            }
            isSearchingForRewards = false
        }
    }

    async function onSearchForRewardsClick(): Promise<void> {
        if ($isOnboardingLedgerProfile) {
            checkOrConnectLedger(searchForRewards)
        } else {
            await searchForRewards()
        }
    }

    async function claimRewards(): Promise<void> {
        try {
            hasTriedClaimingRewards = true
            if ($isOnboardingLedgerProfile) {
                stopPollingLedgerNanoStatus()
            }
            await claimShimmerRewards()
        } catch (err) {
            throw new ClaimShimmerRewardsError()
        } finally {
            if ($isOnboardingLedgerProfile) {
                closePopup(true)
                pollLedgerNanoStatus()
            }
        }
    }

    async function onClaimRewardsClick(): Promise<void> {
        if ($isOnboardingLedgerProfile) {
            checkOrConnectLedger(claimRewards)
        } else {
            await claimRewards()
        }
    }

    function onContinueClick(): void {
        $shimmerClaimingRouter.next()
    }

    async function onMountHelper(): Promise<void> {
        subscribeToWalletApiEventsForShimmerClaiming()
        await $shimmerClaimingProfileManager.startBackgroundSync({ syncOnlyMostBasicOutputs: true })

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
                if ($isOnboardingLedgerProfile) {
                    stopPollingLedgerNanoStatus()
                }
                await findShimmerRewardsForAccount($onboardingProfile?.shimmerClaimingAccounts[0])
            } catch (err) {
                throw new FindShimmerRewardsError()
            } finally {
                if ($isOnboardingLedgerProfile) {
                    pollLedgerNanoStatus()
                }
                isSearchingForRewards = false
            }
        }
    }

    onMount(() => {
        void onMountHelper()
    })

    async function onDestroyHelper(): Promise<void> {
        unsubscribeFromWalletApiEvents(shimmerClaimingProfileManager)
        await $shimmerClaimingProfileManager?.stopBackgroundSync()
        if ($isOnboardingLedgerProfile) {
            stopPollingLedgerNanoStatus()
        }
    }

    onDestroy(() => {
        void onDestroyHelper()
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
            disabled={!shouldSearchForRewardsButtonBeEnabled}
            secondary
            onClick={onSearchForRewardsClick}
        >
            {#if isSearchingForRewards}
                <Spinner message={localize('actions.searching')} busy={true} classes="justify-center items-center" />
            {:else}
                {localize(`actions.${hasSearchedForRewardsBefore ? 'searchAgain' : 'searchForRewards'}`)}
            {/if}
        </Button>
        {#if shouldShowContinueButton}
            <Button classes="w-full" onClick={onContinueClick}>
                {localize('actions.continue')}
            </Button>
        {:else}
            <Button classes="w-full" disabled={!shouldClaimRewardsButtonBeEnabled} onClick={onClaimRewardsClick}>
                {#if isClaimingRewards}
                    <Spinner message={localize('actions.claiming')} busy={true} classes="justify-center items-center" />
                {:else}
                    {localize(`actions.${hasTriedClaimingRewards ? 'rerunClaimProcess' : 'claimRewards'}`)}
                {/if}
            </Button>
        {/if}
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center {true && 'bg-pastel-yellow dark:bg-gray-900'}">
        <Animation classes="setup-anim-aspect-ratio" animation="import-desktop" />
    </div>
</OnboardingLayout>
