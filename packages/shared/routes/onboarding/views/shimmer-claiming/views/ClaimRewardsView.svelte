<script lang="typescript">
    import { onDestroy, onMount } from 'svelte'
    import { Animation, Button, OnboardingLayout, ShimmerClaimingAccountList, Spinner, Text } from 'shared/components'
    import { localize } from '@core/i18n'
    import { displayNotificationForLedgerProfile, getLedgerDeviceStatus } from '@core/ledger'
    import { subscribeToWalletApiEvents, unsubscribeFromWalletApiEvents } from '@core/profile-manager'
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
        shimmerClaimingProfileManager,
    } from '@contexts/onboarding'
    import { closePopup } from '@lib/popup'

    $: shimmerClaimingAccounts = $onboardingProfile?.shimmerClaimingAccounts ?? []

    let isSearchingForRewards = false
    let hasSearchedForRewardsBefore = false

    let isClaimingRewards = false
    let hasTriedClaimingRewards = false

    $: shouldSearchForRewardsButtonBeEnabled = !isSearchingForRewards && !isClaimingRewards
    $: shouldClaimRewardsButtonBeEnabled =
        canUserClaimRewards(shimmerClaimingAccounts) && !isSearchingForRewards && !isClaimingRewards
    $: shouldShowContinueButton = hasUserClaimedRewards(shimmerClaimingAccounts)

    function onBackClick(): void {
        $shimmerClaimingRouter.previous()
    }

    function _onLedgerNotConnected(): void {
        displayNotificationForLedgerProfile('error', true)
    }

    async function onUseBalanceFinderClickInternal(): Promise<void> {
        try {
            isSearchingForRewards = true
            hasSearchedForRewardsBefore = true
            await findShimmerRewards()
        } catch (err) {
            console.error(err)
            throw new FindShimmerRewardsError()
        } finally {
            isSearchingForRewards = false
        }
    }

    async function onUseBalanceFinderClick(): Promise<void> {
        if ($isOnboardingLedgerProfile) {
            await getLedgerDeviceStatus(onUseBalanceFinderClickInternal, _onLedgerNotConnected, _onLedgerNotConnected)
        } else {
            await onUseBalanceFinderClickInternal()
        }
    }

    async function onClaimRewardsClickInternal(): Promise<void> {
        try {
            isClaimingRewards = true
            hasTriedClaimingRewards = true
            await claimShimmerRewards()
        } catch (err) {
            throw new ClaimShimmerRewardsError()
        } finally {
            if ($isOnboardingLedgerProfile) {
                closePopup(true)
            }
            isClaimingRewards = false
        }
    }

    async function onClaimRewardsClick(): Promise<void> {
        if ($isOnboardingLedgerProfile) {
            await getLedgerDeviceStatus(onClaimRewardsClickInternal, _onLedgerNotConnected, _onLedgerNotConnected)
        } else {
            await onClaimRewardsClickInternal()
        }
    }

    function onContinueClick(): void {
        $shimmerClaimingRouter.next()
    }

    async function onMountHelper(): Promise<void> {
        if ($isOnboardingLedgerProfile) {
            /**
             * NOTE: We have to register and event handler for transaction
             * progress specifically for Ledger profiles, since the user
             * MUST confirm what is displayed in the UI matches what is prompted
             * on the actual Ledger device.
             */
            subscribeToWalletApiEvents(shimmerClaimingProfileManager)
        }

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
                throw new FindShimmerRewardsError()
            } finally {
                isSearchingForRewards = false
            }
        }
    }

    onMount(() => {
        void onMountHelper()
    })

    onDestroy(() => {
        if ($isOnboardingLedgerProfile) {
            unsubscribeFromWalletApiEvents(shimmerClaimingProfileManager)
        }
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
            onClick={onUseBalanceFinderClick}
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
