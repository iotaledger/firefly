<script lang="typescript">
    import { onMount } from 'svelte'
    import { Button, Icon, Spinner, Text, Tooltip } from 'shared/components'
    import { convertToFiat, currencies, exchangeRates, formatCurrency } from 'shared/lib/currency'
    import { promptUserToConnectLedger } from 'shared/lib/ledger'
    import { hasNodePlugin, networkStatus } from 'shared/lib/networkStatus'
    import { showAppNotification } from 'shared/lib/notifications'
    import {
        canParticipate,
        getAccountParticipationAbility,
        getStakedFunds,
        getUnstakedFunds,
        isAccountPartiallyStaked,
        isAccountStaked, getIotasUntilMinimumAirdropReward,
    } from 'shared/lib/participation'
    import { getParticipationOverview, participate, stopParticipating } from 'shared/lib/participation/api'
    import { STAKING_EVENT_IDS } from 'shared/lib/participation/constants'
    import {
        accountToParticipate,
        isPerformingParticipation,
        participationAction,
        participationOverview,
        pendingParticipations,
        stakedAccounts,
        stakedAmount,
        stakingEventState,
    } from 'shared/lib/participation/stores'
    import { AccountParticipationAbility, Participation, ParticipationAction, StakingAirdrop } from 'shared/lib/participation/types'
    import { openPopup, popupState } from 'shared/lib/popup'
    import { activeProfile, isSoftwareProfile } from 'shared/lib/profile'
    import { checkStronghold } from 'shared/lib/stronghold'
    import { AvailableExchangeRates, CurrencyTypes } from 'shared/lib/typings/currency'
    import type { Locale } from 'shared/lib/typings/i18n'
    import { NodePlugin } from 'shared/lib/typings/node'
    import type { WalletAccount } from 'shared/lib/typings/wallet'
    import { formatUnitBestMatch } from 'shared/lib/units'
    import { transferState, wallet } from 'shared/lib/wallet'

    export let locale: Locale

    export let shouldParticipateOnMount = false
    export let participations: Participation[] = []

    let pendingParticipationIds = []
    let previousPendingParticipationsLength = 0
    let { accounts } = $wallet

    $: accountsWithParticipationAbilities = $accounts.map(account => ({
        account,
        participationAbility: getAccountParticipationAbility(account)
    }))
    
    $: canStake = canParticipate($stakingEventState)
    

    pendingParticipations.subscribe((participations) => {
        const currentParticipationsLength = participations.length

        if (currentParticipationsLength < previousPendingParticipationsLength) {
            const latestParticipationIds = participations.map((participation) => participation.messageId)

            if (latestParticipationIds.length === 0) {
                resetView()
            }

            pendingParticipationIds = latestParticipationIds
            previousPendingParticipationsLength = currentParticipationsLength
        }
    })

    $: $stakedAccounts, async () => getParticipationOverview()
    $: $accountToParticipate, async () => getParticipationOverview()

    const resetAccounts = (): void => {
        /**
         * NOTE: This is necessary for the page
         * to be re-rendered because updating arrays
         * in place will not update the UI (requires
         * variable re-assignment).
         */
        accounts = accounts
    }

    $: $participationOverview, resetAccounts()

    const resetView = (): void => {
        if (!isSoftwareProfile) {
            transferState.set(null)
        }

        isPerformingParticipation.set(false)

        accountToParticipate.set(undefined)
        participationAction.set(undefined)

        resetAccounts()
    }

    const displayErrorNotification = (error): void => {
        showAppNotification({
            type: 'error',
            message: locale(error.error),
        })
    }

    const getFormattedFiatAmount = (amount: number): string => {
        const currency = $activeProfile?.settings.currency ?? AvailableExchangeRates.USD
        return formatCurrency(convertToFiat(amount, $currencies[CurrencyTypes.USD], $exchangeRates[currency]), currency)
    }

    const handleParticipationAction = async (): Promise<void> => {
        if (!canStake) return
        if (!$accountToParticipate || !$participationAction) return

        isPerformingParticipation.set(true)

        const _sync = (messageIds: string[]) => {
            messageIds.forEach((id) => pendingParticipationIds.push(id))
            previousPendingParticipationsLength = messageIds.length
        }

        const hasParticipationPlugin = $networkStatus.nodePlugins.includes(NodePlugin.Participation)
        if (!hasParticipationPlugin) {
            showAppNotification({
                type: 'error',
                message: locale('error.node.pluginNotAvailable', { values: { nodePlugin: NodePlugin.Participation } }),
            })

            resetView()

            return
        }

        switch ($participationAction) {
            case ParticipationAction.Stake: {
                await participate($accountToParticipate?.id, participations)
                    .then((messageIds) => _sync(messageIds))
                    .catch((err) => {
                        console.error(err)

                        displayErrorNotification(err)
                        resetView()
                    })
                break
            }
            case ParticipationAction.Unstake:
                await stopParticipating($accountToParticipate?.id, STAKING_EVENT_IDS)
                    .then((messageIds) => _sync(messageIds))
                    .catch((err) => {
                        console.error(err)

                        displayErrorNotification(err)
                        resetView()
                    })
                break
            default:
                break
        }
    }

    const handleStakeClick = (account: WalletAccount): void => {
        const openStakingConfirmationPopup = () =>
            openPopup(
                {
                    type: 'stakingConfirmation',
                    props: {
                        accountToStake: account,
                    },
                },
                true
            )
        if ($isSoftwareProfile) {
            openStakingConfirmationPopup()
        } else {
            promptUserToConnectLedger(false, () => openStakingConfirmationPopup(), undefined, true)
        }
    }

    const handleUnstakeClick = (account: WalletAccount): void => {
        const _unstake = () => {
            accountToParticipate.set(account)
            participationAction.set(ParticipationAction.Unstake)

            if ($popupState.type !== 'stakingManager') {
                openPopup({
                    type: 'stakingManager',
                    props: {
                        shouldParticipateOnMount: true,
                    },
                })
            } else {
                void handleParticipationAction()
            }
        }

        if ($isSoftwareProfile) {
            checkStronghold(_unstake)
        } else {
            promptUserToConnectLedger(false, () => _unstake(), undefined, true)
        }
    }

    onMount(async () => {
        if (!hasNodePlugin(NodePlugin.Participation)) {
            showAppNotification({
                type: 'warning',
                message: locale('error.node.pluginNotAvailable', { values: { nodePlugin: NodePlugin.Participation } }),
            })

            resetView()

            return
        }

        /**
         * NOTE: Because of Stronghold and Ledger prompts to "unlock"
         * the wallets, this popup MAY BE instantiated with an "accountToAction",
         * which is the particular account the user chose to either stake or unstake.
         * We can safely assume here that there are no more confirmations to approve,
         * so we will perform the action (of either staking or unstaking).
         */
        if (shouldParticipateOnMount) {
            await handleParticipationAction()
        }
    })

    let showTooltip = false
    let tooltipAnchor: unknown
    const tooltipAnchors: { [accountIndex: number]: unknown } = {}
    let tooltipMinBalance: string = ''

    const toggleTooltip = (account: WalletAccount): void => {
        showTooltip = !showTooltip

        if(showTooltip) {
            tooltipAnchor = tooltipAnchors[account?.index]
            // Check for Assembly only because it has lower reward requirements
            tooltipMinBalance = <string>getIotasUntilMinimumAirdropReward(account, StakingAirdrop.Assembly, true)
        } else {
            tooltipAnchor = undefined
            tooltipMinBalance = ''
        }
    }
</script>

<Text type="h5">{locale('popups.stakingManager.title')}</Text>
<Text type="p" secondary classes="mt-6 mb-4">{locale('popups.stakingManager.description')}</Text>
<div class="staking flex flex-col scrollable-y">
    {#each accountsWithParticipationAbilities as { account, participationAbility }}
        {#if participationAbility !== AccountParticipationAbility.HasDustAmount}
            <div class={`w-full mt-4 flex flex-col rounded-xl border-2 border-solid ${isAccountPartiallyStaked(account?.id) ? 'border-yellow-600' : 'border-gray-200 dark:border-gray-600'}`}>
                <div class="w-full space-x-4 px-5 py-3 flex flex-row justify-between items-center">
                    {#if isAccountStaked(account?.id)}
                        <div class="bg-green-100 rounded-2xl">
                            <Icon icon="success-check" width="18" height="18" classes="text-white" />
                        </div>
                    {:else if participationAbility === AccountParticipationAbility.WillNotReachMinAirdrop}
                        <div
                            bind:this={tooltipAnchors[account?.index]}
                            on:mouseenter={() => toggleTooltip(account)}
                            on:mouseleave={() => toggleTooltip(account)}
                        >
                            <Icon icon="exclamation" width="20" height="20" classes="text-orange-500" />
                        </div>
                    {:else}
                        <Icon
                            icon="unlock"
                            width="24"
                            height="24"
                            classes={$accountToParticipate?.id === account?.id ? 'text-gray-400' : 'text-gray-800 dark:text-white'} />
                    {/if}
                    <div class="flex flex-col w-3/4">
                        <Text type="p" classes="font-extrabold" disabled={$accountToParticipate?.id === account?.id}>
                            {account.alias}
                        </Text>
                        {#if isAccountPartiallyStaked(account?.id)}
                            <Text
                                type="p"
                                secondary={$accountToParticipate?.id !== account?.id}
                                disabled={$accountToParticipate?.id === account?.id}
                                classes="font-extrabold">
                                {formatUnitBestMatch(getStakedFunds(account))}
                                •
                                <Text
                                    type="p"
                                    secondary={$accountToParticipate?.id !== account?.id}
                                    disabled={$accountToParticipate?.id === account?.id}
                                    classes="inline">
                                    {getFormattedFiatAmount(getStakedFunds(account))}
                                </Text>
                            </Text>
                        {:else}
                            <Text
                                type="p"
                                secondary={$accountToParticipate?.id !== account?.id}
                                disabled={$accountToParticipate?.id === account?.id}
                                classes="font-extrabold">
                                {account.balance}
                                •
                                <Text
                                    type="p"
                                    secondary={$accountToParticipate?.id !== account?.id}
                                    disabled={$accountToParticipate?.id === account?.id}
                                    classes="inline">
                                    {account.balanceEquiv}
                                </Text>
                            </Text>
                        {/if}
                    </div>
                    <Button
                        disabled={$isPerformingParticipation || participationAbility === AccountParticipationAbility.HasPendingTransaction}
                        secondary={isAccountStaked(account?.id)}
                        onClick={() => (isAccountStaked(account?.id) ? handleUnstakeClick(account) : handleStakeClick(account))}>
                        {#if $accountToParticipate?.id !== account?.id && participationAbility === AccountParticipationAbility.HasPendingTransaction}
                            {locale('general.syncing')}
                        {:else if $accountToParticipate && $accountToParticipate?.id === account?.id && $participationAction}
                            <Spinner busy={$isPerformingParticipation} classes="mx-2 justify-center" />
                        {:else}
                            {locale(`actions.${isAccountStaked(account?.id) ? 'unstake' : 'stake'}`)}
                        {/if}
                    </Button>
                </div>
                {#if isAccountPartiallyStaked(account?.id) && $accountToParticipate?.id !== account?.id && participationAbility !== AccountParticipationAbility.WillNotReachMinAirdrop}
                    <div
                        class="space-x-4 mx-2 mb-2 pl-4 pr-2.5 py-3 flex flex-row justify-between items-center rounded-lg border-2 border-solid border-gray-200 dark:border-gray-600">
                        <Icon icon="exclamation" width="20" height="20" classes="fill-current text-yellow-600" />
                        <div class="flex flex-col w-3/4">
                            <Text type="p" classes="font-extrabold">{locale('general.unstakedFunds')}</Text>
                            <Text type="p" secondary classes="font-extrabold">
                                {formatUnitBestMatch(getUnstakedFunds(account))}
                                •
                                <Text type="p" secondary classes="inline">
                                    {getFormattedFiatAmount(getUnstakedFunds(account))}
                                </Text>
                            </Text>
                        </div>
                        <Button
                            caution={isAccountPartiallyStaked(account?.id) && $accountToParticipate?.id !== account?.id}
                            disabled={$isPerformingParticipation || participationAbility === AccountParticipationAbility.HasPendingTransaction}
                            onClick={() => handleStakeClick(account)}>
                            {locale('actions.merge')}
                        </Button>
                    </div>
                {/if}
            </div>
        {/if}
    {/each}
</div>

<div class="mt-2 text-center">
    <Text type="p" secondary classes="inline">
        {locale('popups.stakingManager.totalFundsStaked')}:

        <Text type="p" secondary bold classes="inline">{formatUnitBestMatch($stakedAmount)}</Text>
    </Text>
</div>

{#if showTooltip}
    <Tooltip anchor={tooltipAnchor} position="right">
        <Text type="p" classes="text-gray-900 bold mb-1 text-left">
            {locale('tooltips.stakingMinRewards.titleMinBalance', { values: { amount: tooltipMinBalance } })}
        </Text>
        <Text type="p" secondary classes="text-left">
            {locale('tooltips.stakingMinRewards.bodyMinBalance')}
        </Text>
    </Tooltip>
{/if}

<style>
    .staking {
        max-height: 36vh;
    }
</style>
