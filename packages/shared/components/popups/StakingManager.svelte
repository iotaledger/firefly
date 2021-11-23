<script lang="typescript">
    import { get } from 'svelte/store'
    import { Button, Icon, Spinner, Text } from 'shared/components'
    import { Locale } from 'shared/lib/typings/i18n'
    import { wallet } from 'shared/lib/wallet'
    import { WalletAccount } from 'shared/lib/typings/wallet'
    import { closePopup, openPopup, popupState } from 'shared/lib/popup'
    import { onMount } from 'svelte'
    import { formatUnitBestMatch } from 'shared/lib/units'
    import {
        canAccountParticipate,
        canParticipate,
        getPartiallyStakedFunds,
        getParticipationOverview,
        isAccountStaked,
        isAccountPartiallyStaked,
        participate,
        stakedAccounts,
        stakingEventState,
        stopParticipating
    } from 'shared/lib/participation'
    import { ParticipationAction } from 'shared/lib/typings/participation'
    import { isSoftwareProfile } from 'shared/lib/profile'
    import { checkStronghold } from 'shared/lib/stronghold'

    export let locale: Locale

    export let accountToAction: WalletAccount
    export let participationAction: ParticipationAction

    let canStake
    $: canStake = canParticipate($stakingEventState)

    let accounts = get($wallet.accounts)
    let hasStakedAccounts = $stakedAccounts.length > 0
    let isPerformingAction = false

    const resetView = (): void => {
        isPerformingAction = false

        accountToAction = undefined
        participationAction = undefined

        /**
         * NOTE: This is necessary for the page
         * to be re-rendered because updating arrays
         * in place will not update the UI (requires
         * variable re-assignment).
         */
        accounts = accounts
    }

    const handleParticipationAction = async (): Promise<void> => {
        if (!canStake) return
        if (!accountToAction || !participationAction) return

        isPerformingAction = true

        console.log('PERFORMING ACTION: ', participationAction, '\nFOR ACCOUNT: ', accountToAction)

        switch (participationAction) {
            case ParticipationAction.Stake:
                await participate(accountToAction)
                    .catch((err) => {
                        console.error(err)

                        resetView()
                    })
                break
            case ParticipationAction.Unstake:
                await stopParticipating(accountToAction)
                    .catch((err) => {
                        console.error(err)

                        resetView()
                    })
                break
            default:
                break
        }

        await getParticipationOverview()

        resetView()
    }

    const handleStakeClick = (account: WalletAccount): void => {
        openPopup({
            type: 'stakingConfirmation',
            props: {
                accountToStake: account,
            },
        }, true)
    }

    const handlePartialStakeClick = (account: WalletAccount): void => {
        console.log('PARTIAL: ', account)
    }

    const handleUnstakeClick = (account: WalletAccount): void => {
        console.log('UNSTAKE FOR: ', account)

        const _unstake = async () => {
            if ($popupState.type !== 'stakingManager') {
                openPopup({
                    type: 'stakingManager',
                    hideClose: true,
                    preventClose: true,
                    props: {
                        accountToAction: account,
                        participationAction: ParticipationAction.Unstake,
                    },
                })
            } else {
                accountToAction = account
                participationAction = ParticipationAction.Unstake

                await handleParticipationAction()
            }
        }

        if ($isSoftwareProfile) {
            checkStronghold(_unstake)
        } else {
            console.log('TODO: Handle unstake flow for Ledger')
        }
    }

    const handleDoneClick = (): void => {
        closePopup(true)
    }

    onMount(async () => {
        /**
         * NOTE: Because of Stronghold and Ledger prompts to "unlock"
         * the wallets, this popup MAY BE instantiated with an "accountToAction",
         * which is the particular account the user chose to either stake or unstake.
         * We can safely assume here that there are no more confirmations to approve,
         * so we will perform the action (of either staking or unstaking).
         */
        await handleParticipationAction()
    })
</script>


<div class="flex flex-col space-y-5">
    {#if hasStakedAccounts}
        <Text type="h5">
            Manage your staked wallets
        </Text>
    {:else}
        <Text type="h5">
            Choose which wallets you want to stake
        </Text>
    {/if}
    <Text type="p" secondary>
        When you stake a wallet, your funds are cocked.
        You can unlock these wallets at any time, but
        then you won’t get full staking rewards.
    </Text>
    <div class="staking flex flex-col scrollable-y">
        {#each accounts as account}
            {#if canAccountParticipate(account)}
                <div
                    class="w-full mb-4 flex flex-col rounded-xl border border-1 border-solid border-gray-300 dark:border-gray-700 hover:border-gray-500 dark:hover:border-gray-700 focus:border-gray-500 focus:hover:border-gray-700"
                >
                    <div class="w-full space-x-4 px-5 py-3 flex flex-row justify-between items-center">
                        {#if isAccountStaked(account?.id)}
                            <div class="bg-green-100 rounded-2xl">
                                <Icon icon="success-check" width="18" height="18" classes="text-white" />
                            </div>
                        {:else}
                            <Icon icon="unlock" width="18" height="18" />
                        {/if}
                        <div class="flex flex-col w-3/4">
                            <Text type="p" classes="font-extrabold">
                                {account.alias}
                            </Text>
                            <Text type="p" secondary classes="font-extrabold">
                                {account.balance} •
                                <Text type="p" secondary classes="inline">
                                    {account.balanceEquiv}
                                </Text>
                            </Text>
                        </div>
                        <Button
                            disabled={isPerformingAction}
                            secondary={isAccountStaked(account?.id)}
                            onClick={() => isAccountStaked(account?.id)
                                ? handleUnstakeClick(account)
                                : handleStakeClick(account)
                            }
                        >
                            {#if accountToAction?.id === account?.id}
                                <Spinner
                                    busy={isPerformingAction}
                                    message={participationAction === ParticipationAction.Stake ? 'Staking' : 'Unstaking'}
                                    classes="justify-center"
                                />
                            {:else}
                                {isAccountStaked(account?.id) ? 'Unstake' : 'Stake'}
                            {/if}
                        </Button>
                    </div>
                    {#if isAccountPartiallyStaked(account?.id)}
                        <div class="space-x-4 mx-1 mb-1 px-4 py-3 flex flex-row justify-between items-center rounded-lg bg-yellow-50">
                            <Icon icon="exclamation" width="18" height="18" classes="fill-current text-yellow-600" />
                            <div class="flex flex-col w-3/4">
                                <Text type="p" classes="font-extrabold">
                                    Unstaked funds
                                </Text>
                                <Text type="p" secondary classes="font-extrabold">
                                    {formatUnitBestMatch(getPartiallyStakedFunds(account))}
                                </Text>
                            </div>
                            <Button
                                disabled={isPerformingAction}
                                onClick={() => handlePartialStakeClick(account)}
                            >
                                {#if accountToAction?.id === account?.id}
                                    <Spinner
                                        busy={isPerformingAction}
                                        message="Staking"
                                        classes="justify-center"
                                    />
                                {:else}
                                    Stake
                                {/if}
                            </Button>
                        </div>
                    {/if}
                </div>
            {/if}
        {/each}
    </div>
    <div></div>
    <div class="flex flex-row space-x-1">
        <Button
            disabled={isPerformingAction}
            classes="w-full"
            onClick={handleDoneClick}
        >
            Done
        </Button>
    </div>
</div>
