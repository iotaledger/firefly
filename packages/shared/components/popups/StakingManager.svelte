<script lang="typescript">
    import { onMount } from 'svelte'
    import { get } from 'svelte/store'

    import { Button, Icon, Spinner, Text } from 'shared/components'
    import { convertToFiat, currencies, exchangeRates, formatCurrency } from 'shared/lib/currency'
    import { AvailableExchangeRates, CurrencyTypes } from 'shared/lib/typings/currency'
    import { Locale } from 'shared/lib/typings/i18n'
    import { networkStatus } from 'shared/lib/networkStatus'
    import { NodePlugin } from 'shared/lib/typings/node'
    import { showAppNotification } from 'shared/lib/notifications'
    import { openPopup, popupState } from 'shared/lib/popup'
    import { activeProfile, isSoftwareProfile } from 'shared/lib/profile'
    import { checkStronghold } from 'shared/lib/stronghold'
    import { formatUnitBestMatch } from 'shared/lib/units'
    import { asyncSyncAccounts, transferState, wallet } from 'shared/lib/wallet'
    import { WalletAccount } from 'shared/lib/typings/wallet'

    import { getParticipationOverview, participate, stopParticipating } from 'shared/lib/participation/api'
    import { STAKING_EVENT_IDS, STAKING_PARTICIPATIONS } from 'shared/lib/participation/constants'
    import {
        canAccountParticipate,
        canParticipate,
        getStakedFunds, getStakingEventFromAirdrop,
        getUnstakedFunds,
        isAccountPartiallyStaked,
        isAccountStaked,
    } from 'shared/lib/participation'
    import {
        accountToParticipate,
        partiallyStakedAccounts,
        participationAction,
        participationOverview,
        stakedAccounts,
        stakedAmount,
        stakingEventState
    } from 'shared/lib/participation/stores'
    import { Participation, ParticipationAction, StakingAirdrop } from 'shared/lib/participation/types'

    export let locale: Locale

    export let isPerformingAction = false
    export let shouldParticipateOnMount = false
    export let airdropSelections: StakingAirdrop[] = []
    console.log('SELECTIONS: ', airdropSelections)

    let canStake
    $: canStake = canParticipate($stakingEventState)

    let accounts = get($wallet.accounts)
    let hasStakedAccounts = $stakedAccounts.length > 0

    $: $stakedAccounts, async () => await getParticipationOverview()
    $: $accountToParticipate, async () => await getParticipationOverview()

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

        accountToParticipate.set(undefined)
        participationAction.set(undefined)

        resetAccounts()
    }

    const getFormattedFiatAmount = (amount: number): string => {
        const currency = $activeProfile?.settings.currency ?? AvailableExchangeRates.USD
        return formatCurrency(convertToFiat(amount, $currencies[CurrencyTypes.USD], $exchangeRates[currency]), currency)
    }

    const handleParticipationAction = async (): Promise<void> => {
        if (!canStake) return
        if (!$accountToParticipate || !$participationAction) return

        isPerformingAction = true

        const isPartialStake = $partiallyStakedAccounts.find((psa) => psa.id === $accountToParticipate?.id) !== undefined

        const _sync = async () => {
            // Add a delay to cover for the transaction confirmation time
            // TODO: Might need to rethink of a better solution here.
            await new Promise((resolve) => setTimeout(resolve, 11000));

            await asyncSyncAccounts()
            await getParticipationOverview()

            showAppNotification({
                type: 'info',
                message: locale(`popups.stakingManager.${
                    $participationAction === ParticipationAction.Stake
                        ? `has${isPartialStake ? 'Partially' : ''}Staked`
                        : `has${isPartialStake ? 'Partially' : ''}Unstaked`
                }`)
            })

            resetView()
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
                const participations: Participation[] = airdropSelections.map((as) => (<Participation>{
                    eventId: getStakingEventFromAirdrop(<StakingAirdrop>as.toLowerCase()).eventId,
                    answers: [],
                }))
                console.log('PARTS: ', participations)
                await participate($accountToParticipate?.id, participations)
                    .then(() => _sync())
                    .catch((err) => {
                        console.error(err)
                        resetView()
                    })
                break
            }
            case ParticipationAction.Unstake:
                await stopParticipating($accountToParticipate?.id, STAKING_EVENT_IDS.concat(
                    "e5501ea9c8d950bceffc635275e7ce179a2334c42e9cc4e31c0f3c2c74db3d6a",
                    "11bf14a0b4c4e60554c73a261b878e09d67e4772b876808d2b3c42570eaeb614",
                    "415267d375c85531aec13e6471c04a01622dfcc9b285a009629dd2c9231da517",
                    "c4f23236b3ce22f9fe22583176813618b304bbfcfd24da68cbddf66196b0d8fd"
                ))
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
            hideBack: false,
            props: {
                accountToStake: account,
                onBack: () => {
                    openPopup({
                        type: 'stakingManager'
                    }, true)
                }
            },
        }, true)
    }

    const handleUnstakeClick = (account: WalletAccount): void => {
        const _unstake = async () => {
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
        // Fetch participation overview when this component mounts
        await getParticipationOverview()

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
</script>

<style>
    .staking {
        max-height: 36vh;
    }
</style>

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
                        <div
                            class="bg-{$accountToParticipate?.id === account?.id && $accountToParticipate && $participationAction && $participationAction !== ParticipationAction.Unstake ? 'yellow-600' : 'green-100'} rounded-2xl"
                        >
                            <Icon icon="success-check" width="18" height="18" classes="text-white" />
                        </div>
                    {:else}
                        <Icon icon="unlock" width="18" height="18" classes="{$accountToParticipate?.id === account?.id ? 'text-gray-400' : ''}" />
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
                                classes="font-extrabold"
                            >
                                {formatUnitBestMatch(getStakedFunds(account))} •
                                <Text
                                    type="p"
                                    secondary={$accountToParticipate?.id !== account?.id}
                                    disabled={$accountToParticipate?.id === account?.id}
                                    classes="inline"
                                >
                                    {getFormattedFiatAmount(getStakedFunds(account))}
                                </Text>
                            </Text>
                        {:else}
                            <Text
                                type="p"
                                secondary={$accountToParticipate?.id !== account?.id}
                                disabled={$accountToParticipate?.id === account?.id}
                                classes="font-extrabold"
                            >
                                {account.balance} •
                                <Text
                                    type="p"
                                    secondary={$accountToParticipate?.id !== account?.id}
                                    disabled={$accountToParticipate?.id === account?.id}
                                    classes="inline"
                                >
                                    {account.balanceEquiv}
                                </Text>
                            </Text>
                        {/if}
                    </div>
                    <Button
                        disabled={isPerformingAction}
                        secondary={isAccountStaked(account?.id)}
                        onClick={() => isAccountStaked(account?.id)
                            ? handleUnstakeClick(account)
                            : handleStakeClick(account)
                        }
                    >
                        {#if $accountToParticipate?.id === account?.id && $accountToParticipate && $participationAction}
                            <Spinner
                                busy={isPerformingAction}
                                classes="mx-2 justify-center"
                            />
                        {:else}
                            {locale(`actions.${isAccountStaked(account?.id) ? 'unstake' : 'stake'}`)}
                        {/if}
                    </Button>
                </div>
                {#if isAccountPartiallyStaked(account?.id) && $accountToParticipate?.id !== account?.id}
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

<div class="mt-2 text-center">
    <Text type="p" secondary classes="inline">
        {locale('popups.stakingManager.totalFundsStaked')}:
        <Text type="p" secondary bold classes="inline">
            {formatUnitBestMatch($stakedAmount)}
        </Text>
    </Text>
</div>
