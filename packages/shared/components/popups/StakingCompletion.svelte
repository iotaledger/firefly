<script lang="typescript">
    import { Button, Icon, Text } from 'shared/components'
    import { Locale } from 'shared/lib/typings/i18n'
    import { closePopup } from 'shared/lib/popup'
    import { showAppNotification } from 'shared/lib/notifications'
    import { onMount } from 'svelte'
    import { StakingAction, StakingSelection } from '../../lib/typings/participation'
    import { asyncForEach, sleep } from '../../lib/utils'
    import { isAccountStaked, stakedAccounts } from '../../lib/participation'
    import { formatUnitBestMatch } from '../../lib/units'

    export let locale: Locale
    export let stakingSelections: StakingSelection[] = []

    const filterSelections = (action: StakingAction): StakingSelection[] => stakingSelections.filter((ss) => ss.action === action)
    let selectionsToStake = filterSelections(StakingAction.Stake)
    let selectionsToUnstake = filterSelections(StakingAction.Unstake)

    let currentSelection: StakingSelection
    let hasCompletedSelectionActions: boolean = false

    const checkForStakingSelections = (): boolean => {
        if (stakingSelections.length === 0) {
            showAppNotification({
                type: 'error',
                message: 'Unable to find accounts for staking.',
            })

            return false
        }

        return true
    }

    const resetSelections = (): void => {
        selectionsToStake = selectionsToStake
        selectionsToUnstake = selectionsToUnstake
    }

    const executeStakes = async (): Promise<void> => {
        await asyncForEach(selectionsToStake.filter((ss) => ss.action === StakingAction.Stake), async (selection: StakingSelection, idx, arr) => {
            currentSelection = selection
            resetSelections()

            await sleep(1500)

            stakedAccounts.set([...$stakedAccounts, selection.account])
            resetSelections()
        })
    }

    const executeUnstakes = async (): Promise<void> => {
        await asyncForEach(selectionsToUnstake.filter((ss) => ss.action === StakingAction.Unstake), async (selection: StakingSelection, idx, arr) => {
            currentSelection = selection
            resetSelections()

            await sleep(1500)

            stakedAccounts.set($stakedAccounts.filter((a) => a.id !== selection.account.id))
            resetSelections()
        })
    }

    const executeSelectionActions = async (): Promise<void> => {
        await executeStakes()
        await executeUnstakes()

        hasCompletedSelectionActions = true
    }

    const calculateSelectionFunds = (selections: StakingSelection[]): string =>
        formatUnitBestMatch(selections.map((s) => s.account.rawIotaBalance).reduce((amt, cur) => amt + cur, 0))

    onMount(async () => {
        if (!checkForStakingSelections()) return

        await executeSelectionActions()
    })
</script>

<div class="flex flex-col space-y-5">
    {#if selectionsToStake.length}
        <Text type="h4">
            Staking wallets
        </Text>
        <Text type="p" secondary>
            When you stake a wallet, your funds are cocked.
            You can unlock these wallets at any time, but
            then you won’t get full staking rewards.
        </Text>
        <div class="staking flex flex-col scrollable-y">
            {#each selectionsToStake as selection}
                <div
                    class="w-full space-x-4 mb-4 flex flex-row px-4 py-3 rounded-xl border border-1 border-solid items-center justify-between border-gray-300 dark:border-gray-700"
                >
                    <Icon
                        icon={isAccountStaked(selection.account.id) ? 'lock' : 'unlock'}
                        classes={isAccountStaked(selection.account.id) ? 'fill-current text-gray-500' : ''}
                    />
                    <div class="flex flex-col w-3/4">
                        <Text type="p" secondary={isAccountStaked(selection.account.id)}>
                            {selection.account.alias}
                        </Text>
                        <Text type="p" secondary>
                            {selection.account.balance} • {selection.account.balanceEquiv}
                        </Text>
                    </div>
                    <div class="flex flex-row w-2/5">
                        {#if !isAccountStaked(selection.account.id) && selection.account.id !== currentSelection?.account?.id}
                            <Text type="p" secondary>Waiting to stake...</Text>
                        {:else if isAccountStaked(selection.account.id)}
                            <Text type="p" secondary classes="mr-2">Wallet staked</Text>
                            <div class="bg-green-100 rounded-2xl relative">
                                <Icon icon="success-check" classes="text-white" width="20" height="20" />
                            </div>
                        {:else}
                            <Text type="p" secondary>Staking wallet...</Text>
                        {/if}
                    </div>
                </div>
            {/each}
            <Text type="p" secondary classes="text-center mb-4">
                Total funds staked:
                <Text type="p" secondary classes="ml-1 inline font-extrabold">
                    {calculateSelectionFunds(selectionsToStake)}
                </Text>
            </Text>
        </div>
    {/if}
    {#if selectionsToUnstake.length}
        <Text type="h4">
            Unstaking wallets
        </Text>
        <div class="staking flex flex-col scrollable-y">
            {#each selectionsToUnstake as selection}
                <div
                    class="w-full space-x-4 mb-4 flex flex-row px-4 py-3 rounded-xl border border-1 border-solid items-center justify-between border-gray-300 dark:border-gray-700"
                >
                    <Icon
                        icon={!isAccountStaked(selection.account.id) ? 'unlock' : 'lock'}
                        classes={!isAccountStaked(selection.account.id) ? 'fill-current text-gray-500' : ''}
                    />
                    <div class="flex flex-col w-3/4">
                        <Text type="p" secondary={!isAccountStaked(selection.account.id)}>
                            {selection.account.alias}
                        </Text>
                        <Text type="p" secondary>
                            {selection.account.balance} • {selection.account.balanceEquiv}
                        </Text>
                    </div>
                    <div class="flex flex-row w-1/2">
                        {#if isAccountStaked(selection.account.id) && selection.account.id !== currentSelection?.account?.id}
                            <Text type="p" secondary>Waiting to unstake...</Text>
                        {:else if !isAccountStaked(selection.account.id)}
                            <Text type="p" secondary classes="mr-2">Wallet unstaked</Text>
                            <div class="bg-yellow-500 rounded-2xl relative">
                                <Icon icon="success-check" classes="text-white" width="20" height="20" />
                            </div>
                        {:else}
                            <Text type="p" secondary>Unstaking wallet...</Text>
                        {/if}
                    </div>
                </div>
            {/each}
            <Text type="p" secondary classes="text-center mb-4">
                Total funds unstaked:
                <Text type="p" secondary classes="ml-1 inline font-extrabold">
                    {calculateSelectionFunds(selectionsToUnstake)}
                </Text>
            </Text>
        </div>
    {/if}
    <div></div>
    <div class="flex flex-row space-x-1">
        <Button classes="w-full" onClick={() => closePopup(true)} disabled={!hasCompletedSelectionActions}>
            Done
        </Button>
    </div>
</div>
