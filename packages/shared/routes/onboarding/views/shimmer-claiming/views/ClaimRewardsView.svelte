<script lang="typescript">
    import { onDestroy, onMount } from 'svelte'
    import { Animation, Button, OnboardingLayout, ShimmerClaimingAccountList, Text } from 'shared/components'
    import { localize } from '@core/i18n'
    import {
        checkOrConnectLedger,
        handleLedgerError,
        pollLedgerNanoStatus,
        stopPollingLedgerNanoStatus,
    } from '@core/ledger'
    import { unsubscribeFromWalletApiEvents } from '@core/profile-manager'
    import { shimmerClaimingRouter } from '@core/router'
    import {
        canUserClaimRewards,
        claimShimmerRewards,
        ClaimShimmerRewardsError,
        findShimmerRewards,
        FindShimmerRewardsError,
        syncShimmerClaimingAccount,
        hasNoUnclaimedRewards,
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

    $: shouldSearchForRewardsButtonBeEnabled =
        !isSearchingForRewards && !isClaimingRewards && !hasUserClaimedRewards(shimmerClaimingAccounts)
    $: shouldClaimRewardsButtonBeEnabled =
        canUserClaimRewards(shimmerClaimingAccounts) && !isSearchingForRewards && !isClaimingRewards
    $: shouldShowContinueButton =
        hasUserClaimedRewards(shimmerClaimingAccounts) ||
        (hasSearchedForRewardsBefore && hasNoUnclaimedRewards(shimmerClaimingAccounts))

    function onBackClick(): void {
        $shimmerClaimingRouter.previous()
    }

    async function searchForRewards(): Promise<void> {
        try {
            isSearchingForRewards = true
            if ($isOnboardingLedgerProfile) {
                stopPollingLedgerNanoStatus()
            }
            await findShimmerRewards()
        } catch (err) {
            if ($isOnboardingLedgerProfile) {
                handleLedgerError(err?.error ?? err)
            } else {
                throw new FindShimmerRewardsError(err)
            }
        } finally {
            if ($isOnboardingLedgerProfile) {
                pollLedgerNanoStatus()
            }
            hasSearchedForRewardsBefore = true
            isSearchingForRewards = false
        }
    }

    async function onSearchForRewardsClick(): Promise<void> {
        if ($isOnboardingLedgerProfile) {
            void checkOrConnectLedger(searchForRewards)
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
            if ($isOnboardingLedgerProfile) {
                handleLedgerError(err?.error ?? err)
            } else {
                throw new ClaimShimmerRewardsError(err)
            }
        } finally {
            if ($isOnboardingLedgerProfile) {
                closePopup(true)
                pollLedgerNanoStatus()
            }
            hasTriedClaimingRewards = true
        }
    }

    async function onClaimRewardsClick(): Promise<void> {
        if ($isOnboardingLedgerProfile) {
            void checkOrConnectLedger(claimRewards)
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
                await syncShimmerClaimingAccount($onboardingProfile?.shimmerClaimingAccounts[0])
                await findShimmerRewards()
            } catch (err) {
                if ($isOnboardingLedgerProfile) {
                    handleLedgerError(err?.error ?? err)
                } else {
                    throw new FindShimmerRewardsError(err)
                }
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
            outline
            onClick={onSearchForRewardsClick}
            isBusy={isSearchingForRewards}
            busyMessage={localize('actions.searching')}
        >
            {localize(`actions.${hasSearchedForRewardsBefore ? 'searchAgain' : 'searchForRewards'}`)}
        </Button>
        {#if shouldShowContinueButton}
            <Button classes="w-full" disabled={isSearchingForRewards} onClick={onContinueClick}>
                {localize('actions.continue')}
            </Button>
        {:else}
            <Button
                classes="w-full"
                disabled={!shouldClaimRewardsButtonBeEnabled}
                onClick={onClaimRewardsClick}
                isBusy={isClaimingRewards}
                busyMessage={localize('actions.claiming')}
            >
                {localize(`actions.${hasTriedClaimingRewards ? 'rerunClaimProcess' : 'claimRewards'}`)}
            </Button>
        {/if}
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center {true && 'bg-pastel-yellow dark:bg-gray-900'}">
        <Animation classes="setup-anim-aspect-ratio" animation="import-desktop" />
    </div>
</OnboardingLayout>
