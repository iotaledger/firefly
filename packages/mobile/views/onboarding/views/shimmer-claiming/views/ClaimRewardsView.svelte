<script lang="ts">
    import { onDestroy, onMount } from 'svelte'
    import { OnboardingLayout, ShimmerClaimingAccountList } from '@components'
    import { Button, Text, TextType } from '@ui'
    import { localize } from '@core/i18n'
    import {
        checkOrConnectLedger,
        handleLedgerError,
        pollLedgerNanoStatus,
        stopPollingLedgerNanoStatus,
    } from '@core/ledger'
    import { unsubscribeFromWalletApiEvents } from '@core/profile-manager'
    import { shimmerClaimingRouter } from '@/routers'
    import {
        canUserClaimRewards,
        claimShimmerRewards,
        ClaimShimmerRewardsError,
        findShimmerRewards,
        FindShimmerRewardsError,
        syncShimmerClaimingAccount,
        canUserRecoverFromShimmerClaiming,
        hasUserClaimedRewards,
        isOnboardingLedgerProfile,
        onboardingProfile,
        ShimmerClaimingAccountState,
        shimmerClaimingProfileManager,
        subscribeToWalletApiEventsForShimmerClaiming,
        initialiseAccountRecoveryConfigurationForShimmerClaiming,
    } from '@contexts/onboarding'

    $: shimmerClaimingAccounts = $onboardingProfile?.shimmerClaimingAccounts ?? []

    let isSearchingForRewards = false
    let hasSearchedForRewardsBefore = false

    let hasTriedClaimingRewards = false

    const title = localize('views.onboarding.shimmerClaiming.claimRewards.title')

    $: isClaimingRewards = shimmerClaimingAccounts.some(
        (shimmerClaimingAccount) => shimmerClaimingAccount.state === ShimmerClaimingAccountState.Claiming
    )

    $: shouldSearchForRewardsButtonBeEnabled =
        !isSearchingForRewards && !isClaimingRewards && !hasUserClaimedRewards(shimmerClaimingAccounts)
    $: shouldClaimRewardsButtonBeEnabled =
        canUserClaimRewards(shimmerClaimingAccounts) && !isSearchingForRewards && !isClaimingRewards
    $: shouldShowContinueButton =
        hasUserClaimedRewards(shimmerClaimingAccounts) ||
        (hasSearchedForRewardsBefore && canUserRecoverFromShimmerClaiming(shimmerClaimingAccounts))

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
            hasSearchedForRewardsBefore = true
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
            await $shimmerClaimingProfileManager.startBackgroundSync({ syncOnlyMostBasicOutputs: true })
            await claimShimmerRewards()
        } catch (err) {
            if ($isOnboardingLedgerProfile) {
                handleLedgerError(err?.error ?? err)
            } else {
                throw new ClaimShimmerRewardsError(err)
            }
        } finally {
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
        initialiseAccountRecoveryConfigurationForShimmerClaiming()
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

<OnboardingLayout {onBackClick} {title}>
    <div slot="content" class="h-full flex flex-col">
        <Text type={TextType.p} secondary fontSize="15" classes="mb-5">
            {localize('views.onboarding.shimmerClaiming.claimRewards.body')}
        </Text>
        <ShimmerClaimingAccountList {shimmerClaimingAccounts} />
    </div>
    <div slot="footer">
        <div class="flex flex-col space-y-4">
            <Button
                classes="w-full"
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
    </div>
</OnboardingLayout>
