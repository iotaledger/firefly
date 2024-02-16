<script lang="ts">
    import { closePopup } from '@auxiliary/popup'
    import { OnboardingLayout } from '@components'
    import {
        ClaimShimmerRewardsError,
        FindShimmerRewardsError,
        RestoreProfileType,
        ShimmerClaimingWalletState,
        canUserClaimRewards,
        canUserRecoverFromShimmerClaiming,
        claimShimmerRewards,
        createShimmerClaimingProfileManager,
        findShimmerRewards,
        hasUserClaimedRewards,
        initialiseAccountRecoveryConfigurationForShimmerClaiming,
        initialiseFirstShimmerClaimingAccount,
        isOnboardingLedgerProfile,
        onboardingProfile,
        shimmerClaimingProfileManager,
        subscribeToWalletApiEventsForShimmerClaiming,
        syncShimmerClaimingAccount,
    } from '@contexts/onboarding'
    import {
        copyStrongholdFileToProfileDirectory,
        getTemporaryProfileManagerStorageDirectory,
    } from '@contexts/onboarding/helpers'
    import { localize } from '@core/i18n'
    import {
        checkOrConnectLedger,
        handleLedgerError,
        pollLedgerNanoStatus,
        stopPollingLedgerNanoStatus,
    } from '@core/ledger'
    import { Animation, Button, ShimmerClaimingAccountTile, Text } from '@ui'
    import { onDestroy, onMount } from 'svelte'
    import { restoreProfileRouter } from '@core/router'
    import { AnimationEnum } from '@auxiliary/animation'
    import { setStrongholdPassword, unsubscribeFromWalletApiEvents } from '@core/wallet/actions'

    $: shimmerClaimingAccounts = $onboardingProfile?.shimmerClaimingAccounts ?? []

    let isSettingUp = false
    let isSearchingForRewards = false
    let hasSearchedForRewardsBefore = false

    let hasTriedClaimingRewards = false

    $: isClaimingRewards = shimmerClaimingAccounts.some(
        (shimmerClaimingAccount) => shimmerClaimingAccount.state === ShimmerClaimingWalletState.Claiming
    )

    $: shouldSearchForRewardsButtonBeEnabled =
        !isSettingUp && !isSearchingForRewards && !isClaimingRewards && !hasUserClaimedRewards(shimmerClaimingAccounts)
    $: shouldClaimRewardsButtonBeEnabled =
        canUserClaimRewards(shimmerClaimingAccounts) && !isSettingUp && !isSearchingForRewards && !isClaimingRewards
    $: shouldShowContinueButton =
        hasUserClaimedRewards(shimmerClaimingAccounts) ||
        (hasSearchedForRewardsBefore && canUserRecoverFromShimmerClaiming(shimmerClaimingAccounts))

    function onContinueClick(): void {
        $restoreProfileRouter.next()
    }

    async function ledgerRaceConditionProtectionWrapper(_function: () => unknown): Promise<void> {
        try {
            if ($isOnboardingLedgerProfile) {
                stopPollingLedgerNanoStatus()
            }
            await _function()
        } catch (err) {
            console.error('Error in ledgerRaceConditionProtectionWrapper')
        } finally {
            if ($isOnboardingLedgerProfile) {
                pollLedgerNanoStatus()
            }
        }
    }

    async function searchForRewards(): Promise<void> {
        try {
            isSearchingForRewards = true
            await findShimmerRewards()
            hasSearchedForRewardsBefore = true
        } catch (err) {
            if ($isOnboardingLedgerProfile) {
                handleLedgerError(err?.error ?? err)
            } else {
                throw new FindShimmerRewardsError(err)
            }
        } finally {
            isSearchingForRewards = false
        }
    }

    async function onSearchForRewardsClick(): Promise<void> {
        if ($isOnboardingLedgerProfile) {
            void checkOrConnectLedger(() => ledgerRaceConditionProtectionWrapper(searchForRewards))
        } else {
            await ledgerRaceConditionProtectionWrapper(searchForRewards)
        }
    }

    async function claimRewards(): Promise<void> {
        try {
            hasTriedClaimingRewards = true
            await $shimmerClaimingProfileManager.startBackgroundSync({ syncOnlyMostBasicOutputs: true })
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
            }
            hasTriedClaimingRewards = true
        }
    }

    async function onClaimRewardsClick(): Promise<void> {
        if ($isOnboardingLedgerProfile) {
            void checkOrConnectLedger(() => ledgerRaceConditionProtectionWrapper(claimRewards))
        } else {
            await ledgerRaceConditionProtectionWrapper(claimRewards)
        }
    }

    async function setupShimmerClaiming(): Promise<void> {
        initialiseAccountRecoveryConfigurationForShimmerClaiming()
        if (!$onboardingProfile?.shimmerClaimingAccounts || $onboardingProfile?.shimmerClaimingAccounts?.length < 1) {
            try {
                isSettingUp = true
                if ($onboardingProfile?.restoreProfileType === RestoreProfileType.Stronghold) {
                    const shimmerClaimingProfileDirectory = await getTemporaryProfileManagerStorageDirectory()
                    await copyStrongholdFileToProfileDirectory(
                        shimmerClaimingProfileDirectory,
                        $onboardingProfile?.importFilePath
                    )
                    await setStrongholdPassword($onboardingProfile?.strongholdPassword)
                }

                await createShimmerClaimingProfileManager()

                subscribeToWalletApiEventsForShimmerClaiming()
                await $shimmerClaimingProfileManager.startBackgroundSync({
                    syncOnlyMostBasicOutputs: true,
                    syncIncomingTransactions: true,
                })

                if ($onboardingProfile?.restoreProfileType === RestoreProfileType.Mnemonic) {
                    await $shimmerClaimingProfileManager?.setStrongholdPassword($onboardingProfile?.strongholdPassword)
                    await $shimmerClaimingProfileManager?.storeMnemonic($onboardingProfile?.mnemonic?.join(' '))
                } else if ($onboardingProfile?.restoreProfileType === RestoreProfileType.Stronghold) {
                    await $shimmerClaimingProfileManager?.setStrongholdPassword($onboardingProfile?.strongholdPassword)
                }

                await initialiseFirstShimmerClaimingAccount()
                await syncShimmerClaimingAccount($onboardingProfile?.shimmerClaimingAccounts?.[0])

                onSearchForRewardsClick()
            } catch (err) {
                if ($isOnboardingLedgerProfile) {
                    handleLedgerError(err?.error ?? err)
                } else {
                    throw new FindShimmerRewardsError(err)
                }
            } finally {
                isSettingUp = false
            }
        }
    }

    onMount(() => {
        void ledgerRaceConditionProtectionWrapper(setupShimmerClaiming)
    })

    async function teardownShimmerClaiming(): Promise<void> {
        await unsubscribeFromWalletApiEvents(shimmerClaimingProfileManager)
        await $shimmerClaimingProfileManager?.stopBackgroundSync()
    }

    onDestroy(() => {
        void teardownShimmerClaiming()
    })
</script>

<OnboardingLayout allowBack={false}>
    <div slot="title">
        <Text type="h2">
            {localize('views.onboarding.shimmerClaiming.claimRewards.title')}
        </Text>
    </div>
    <div slot="leftpane__content" class="h-full flex flex-col">
        <Text type="p" secondary classes="mb-5">
            {localize('views.onboarding.shimmerClaiming.claimRewards.body')}
        </Text>
        {#if shimmerClaimingAccounts && shimmerClaimingAccounts?.length > 0}
            <div class="flex-auto overflow-y-auto h-1 space-y-3 w-full scrollable-y">
                {#each shimmerClaimingAccounts as shimmerClaimingAccount}
                    <ShimmerClaimingAccountTile
                        {shimmerClaimingAccount}
                        baseToken={$onboardingProfile?.network?.baseToken}
                    />
                {/each}
            </div>
        {/if}
    </div>
    <div slot="leftpane__action">
        <Button
            classes="w-full mb-5"
            disabled={!shouldSearchForRewardsButtonBeEnabled}
            outline
            onClick={onSearchForRewardsClick}
            isBusy={isSettingUp || isSearchingForRewards}
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
    <div slot="rightpane" class="w-full h-full flex justify-center bg-pastel-yellow dark:bg-gray-900">
        <Animation animation={AnimationEnum.ImportDesktop} />
    </div>
</OnboardingLayout>
