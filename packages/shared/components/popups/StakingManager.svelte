<script lang="typescript">
    import { get } from 'svelte/store'
    import { Button, Icon, Spinner, Text } from 'shared/components'
    import { Locale } from 'shared/lib/typings/i18n'
    import { asyncSyncAccounts, transferState, wallet } from 'shared/lib/wallet'
    import { WalletAccount } from 'shared/lib/typings/wallet'
    import { closePopup, openPopup, popupState } from 'shared/lib/popup'
    import { onMount } from 'svelte'
    import { formatUnitBestMatch } from 'shared/lib/units'
    import {
        canAccountParticipate,
        canParticipate,
        getParticipationOverview,
        getStakedFunds,
        getUnstakedFunds,
        isAccountPartiallyStaked,
        isAccountStaked,
        participate, participationOverview,
        stakedAccounts,
        STAKING_EVENT_IDS,
        STAKING_PARTICIPATIONS,
        stakingEventState,
        stopParticipating
    } from 'shared/lib/participation'
    import { ParticipationAction } from 'shared/lib/typings/participation'
    import { activeProfile, isSoftwareProfile } from 'shared/lib/profile'
    import { checkStronghold } from 'shared/lib/stronghold'
    import { convertToFiat, currencies, exchangeRates, formatCurrency } from 'shared/lib/currency'
    import { AvailableExchangeRates, CurrencyTypes } from 'shared/lib/typings/currency'
    import { showAppNotification } from 'shared/lib/notifications'
    import {
        GeneratingRemainderDepositAddressEvent,
        PreparedTransactionEvent,
        TransactionEventData,
        TransferProgressEventData,
        TransferProgressEventType,
        TransferState,
    } from 'shared/lib/typings/events'
    import { NodePlugin } from 'shared/lib/typings/node'
    import { networkStatus } from 'shared/lib/networkStatus'
    import { MILLISECONDS_PER_SECOND } from '../../lib/time'

    export let locale: Locale

    export let accountToAction: WalletAccount
    export let participationAction: ParticipationAction

    export let shouldParticipateOnMount = false

    let canStake
    $: canStake = canParticipate($stakingEventState)

    export let isPerformingAction = false
    let accounts = get($wallet.accounts)
    let hasStakedAccounts = $stakedAccounts.length > 0

    let transactionEventData: TransferProgressEventData = null

   // TODO: This is an exact copy of a method defined in Wallet.svelte. Need to move it to shared.
   const handleTransactionEventData = (eventData: TransferProgressEventData): TransactionEventData => {
        if (!eventData) return {}

        const remainderData = eventData as GeneratingRemainderDepositAddressEvent
        if (remainderData?.address) return { remainderAddress: remainderData?.address }

        const txData = eventData as PreparedTransactionEvent
        if (!(txData?.inputs && txData?.outputs) || txData?.inputs.length <= 0 || txData?.outputs.length <= 0) return {}

        const numOutputs = txData.outputs.length
        if (numOutputs === 1) {
            return {
                toAddress: txData.outputs[0].address,
                toAmount: txData.outputs[0].amount,
            }
        } else if (numOutputs > 1) {
            return {
                toAddress: txData.outputs[0].address,
                toAmount: txData.outputs[0].amount,

                remainderAddress: txData.outputs[numOutputs - 1].address,
                remainderAmount: txData.outputs[numOutputs - 1].amount,
            }
        } else {
            return txData
        }
    }

    const handleTransferState = (state: TransferState): void => {
        if (!state) return

        const _onCancel = () => {
            transferState.set(null)

            closePopup(true)
        }

        const { data, type } = state
        switch (type) {
            // If a user presses "Accept" on ledger, this is the next transfer progress item.
            case TransferProgressEventType.PerformingPoW:
                // Close the current pop up i.e., the one with ledger transaction details
                closePopup(true)
                // Re-open the staking manager pop up
                openPopup({
                    type: 'stakingManager',
                    props: {
                        accountToAction,
                        participationAction,
                        isPerformingAction: true
                    },
                })
                break

            case TransferProgressEventType.SigningTransaction:
                openPopup({
                    type: 'ledgerTransaction',
                    hideClose: true,
                    props: {
                        onCancel: _onCancel,
                        ...handleTransactionEventData(transactionEventData),
                    },
                })

                break

            case TransferProgressEventType.PreparedTransaction:
                transactionEventData = data

                break

            default:
                break
        }
    }

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

        isPerformingAction = false

        accountToAction = undefined
        participationAction = undefined

        resetAccounts()
    }

    const getFormattedFiatAmount = (amount: number): string => {
        const currency = $activeProfile?.settings.currency ?? AvailableExchangeRates.USD
        return formatCurrency(convertToFiat(amount, $currencies[CurrencyTypes.USD], $exchangeRates[currency]), currency)
    }

    const handleParticipationAction = async (): Promise<void> => {
        if (!canStake) return
        if (!accountToAction || !participationAction) return

        isPerformingAction = true

        const _displaySuccessNotification = () => {
            showAppNotification({
                type: 'info',
                message: locale(`popups.stakingManager.${
                    participationAction === ParticipationAction.Stake
                        ? 'hasStaked'
                        : 'hasUnstaked'
                }`)
            })
        };

        const _sync = () => {
            // Add a delay to cover for the transaction confirmation time
            // TODO: Might need to rethink of a better solution here.
            return new Promise((resolve) => setTimeout(resolve, 6 * MILLISECONDS_PER_SECOND))
                .then(() => asyncSyncAccounts())
                .then(() => getParticipationOverview())
                .then(() => {
                    _displaySuccessNotification()
                     resetView()
                })
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

        switch (participationAction) {
            case ParticipationAction.Stake:
                await participate(accountToAction?.id, STAKING_PARTICIPATIONS)
                    .then(() => _sync())
                    .catch((err) => {
                        console.error(err)
                        resetView()
                    })
                break
            case ParticipationAction.Unstake:
                await stopParticipating(accountToAction?.id, STAKING_EVENT_IDS)
                    .then(() => _sync())
                    .catch((err) => {
                        console.error(err)
                        resetView()
                    })
                break
            default:
                break
        }
    }

    const handleStakeClick = (account: WalletAccount): void => {
        openPopup({
            type: 'stakingConfirmation',
            props: {
                accountToStake: account,
            },
        }, true)
    }

    const handleUnstakeClick = (account: WalletAccount): void => {
        const _unstake = async () => {
            if ($popupState.type !== 'stakingManager') {
                openPopup({
                    type: 'stakingManager',
                    props: {
                        accountToAction: account,
                        participationAction: ParticipationAction.Unstake,
                        shouldParticipateOnMount: true
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
            _unstake()
        }
    }

    onMount(async () => {
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

    /** Subscribe to transfer state */
    transferState.subscribe((state) => {
        if (!$isSoftwareProfile) {
            handleTransferState(state)
        }
    })
</script>

<Text type="h5">
    {locale(`popups.stakingManager.titleWith${hasStakedAccounts ? '' : 'No'}Stake`)}
</Text>
<Text type="p" secondary classes="mt-6 mb-2">
    {locale('popups.stakingManager.description')}
</Text>
<div class="staking flex flex-col scrollable-y">
    {#each accounts as account}
        {#if canAccountParticipate(account)}
            <div
                class="w-full mt-4 flex flex-col rounded-xl border border-1 border-solid border-gray-300 dark:border-gray-700 hover:border-gray-500 dark:hover:border-gray-700 focus:border-gray-500 focus:hover:border-gray-700"
            >
                <div class="w-full space-x-4 px-5 py-3 flex flex-row justify-between items-center">
                    {#if isAccountStaked(account?.id)}
                        <div class="bg-green-100 rounded-2xl">
                            <Icon icon="success-check" width="18" height="18" classes="text-white" />
                        </div>
                    {:else}
                        <Icon icon="unlock" width="18" height="18" />
                    {/if}
                    {#if isAccountPartiallyStaked(account?.id)}
                        <div class="flex flex-col w-3/4">
                            <Text type="p" classes="font-extrabold">
                                {account.alias}
                            </Text>
                            <Text type="p" secondary classes="font-extrabold">
                                {formatUnitBestMatch(getStakedFunds(account))} •
                                <Text type="p" secondary classes="inline">
                                    {getFormattedFiatAmount(getStakedFunds(account))}
                                </Text>
                            </Text>
                        </div>
                    {:else}
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
                    {/if}
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
                                message={locale(`general.${participationAction === ParticipationAction.Stake ? 'staking' : 'unstaking'}`)}
                                classes="mx-2 justify-center"
                            />
                        {:else}
                            {locale(`actions.${isAccountStaked(account?.id) ? 'unstake' : 'stake'}`)}
                        {/if}
                    </Button>
                </div>
                {#if isAccountPartiallyStaked(account?.id) && accountToAction?.id !== account?.id}
                    <div class="space-x-4 mx-1 mb-1 px-4 py-3 flex flex-row justify-between items-center rounded-lg bg-yellow-50">
                        <Icon icon="exclamation" width="18" height="18" classes="fill-current text-yellow-600" />
                        <div class="flex flex-col w-3/4">
                            <Text type="p" classes="font-extrabold">
                                {locale('general.unstakedFunds')}
                            </Text>
                            <Text type="p" secondary classes="font-extrabold">
                                {formatUnitBestMatch(getUnstakedFunds(account))} •
                                <Text type="p" secondary classes="inline">
                                    {getFormattedFiatAmount(getUnstakedFunds(account))}
                                </Text>
                            </Text>
                        </div>
                        <Button
                            disabled={isPerformingAction}
                            onClick={() => handleStakeClick(account)}
                        >
                            {locale('actions.stake')}
                        </Button>
                    </div>
                {/if}
            </div>
        {/if}
    {/each}
</div>
<!--    <div></div>-->
<!--    <div class="flex flex-row space-x-1">-->
<!--        <Button-->
<!--            disabled={isPerformingAction}-->
<!--            secondary-->
<!--            classes="w-full"-->
<!--            onClick={handleDoneClick}-->
<!--        >-->
<!--            Done-->
<!--        </Button>-->
<!--    </div>-->
