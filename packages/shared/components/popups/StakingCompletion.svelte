<script lang="typescript">
    import { Button, Icon, Text } from 'shared/components'
    import { Locale } from 'shared/lib/typings/i18n'
    import { closePopup } from 'shared/lib/popup'
    import { showAppNotification } from 'shared/lib/notifications'
    import { onMount } from 'svelte'
    import { StakingAction, StakingSelection } from '../../lib/typings/participation'
    import { asyncForEach, sleep } from '../../lib/utils'
    import { stakedAccounts } from '../../lib/participation'

    export let locale: Locale
    export let stakingSelections: StakingSelection[] = []

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
        stakingSelections = stakingSelections
    }

    const executeStakes = async (): Promise<void> => {
        await asyncForEach(stakingSelections.filter((ss) => ss.action === StakingAction.Stake), async (selection: StakingSelection, idx, arr) => {
            currentSelection = selection
            resetSelections()

            await sleep(1500)

            stakedAccounts.set([...$stakedAccounts, selection.account])
            currentSelection = undefined
            resetSelections()
        })
    }

    const executeUnstakes = async (): Promise<void> => {

    }

    const executeSelectionActions = async (): Promise<void> => {
        await executeStakes()
        await executeUnstakes()
    }

    onMount(async () => {
        if (!checkForStakingSelections()) return

        await executeSelectionActions()
    })
</script>

<div class="flex flex-col space-y-5">
    <Text type="h5">
        Staking wallets
    </Text>
    <Text type="p" secondary>
        When you stake a wallet, your funds are cocked.
        You can unlock these wallets at any time, but
        then you won’t get full staking rewards.
    </Text>
    <div class="staking flex flex-col scrollable-y">
        {#each stakingSelections as account}
            <div
                class="w-full space-x-4 mb-4 flex flex-row px-4 py-3 rounded-xl border border-1 border-solid items-center justify-between border-gray-300 dark:border-gray-700"
            >
                <Icon
                    icon={isAccountStaked(account) ? 'lock' : 'unlock'}
                    classes={!isAccountStaked(account) || isAccountBeingStaked(account) ? 'fill-current text-gray-500' : ''}
                />
                <div class="flex flex-col w-3/4">
                    <Text type="p" secondary={!isAccountStaked(account) || isAccountBeingStaked(account)}>
                        {account.alias}
                    </Text>
                    <Text type="p" secondary>
                        {account.balance} • {account.balanceEquiv}
                    </Text>
                </div>
                <div class="flex flex-row w-2/5">
                    {#if !isAccountStaked(account) && !isAccountBeingStaked(account)}
                        <Text type="p" secondary>Waiting to stake...</Text>
                    {:else if isAccountStaked(account)}
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
    </div>
    <div></div>
    <div class="flex flex-row space-x-1">
        <Button classes="w-full" onClick={() => closePopup(true)} disabled={!hasCompletedSelectionActions}>
            Done
        </Button>
    </div>
</div>
