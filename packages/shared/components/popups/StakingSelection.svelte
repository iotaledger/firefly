<script lang="typescript">
    import { Button, Icon, Text, Toggle } from 'shared/components'
    import { closePopup, openPopup } from 'shared/lib/popup'
    import { Locale } from 'shared/lib/typings/i18n'
    import { get } from 'svelte/store'
    import { DUST_THRESHOLD, wallet } from 'shared/lib/wallet'
    import { stakedAccounts } from 'shared/lib/participation'
    import { StakingAction, StakingSelection } from '../../lib/typings/participation'
    import { WalletAccount } from '../../lib/typings/wallet'

    export let locale: Locale

    let hasStakedAccounts = $stakedAccounts.length !== 0
    let stakingSelections: StakingSelection[] =
        get($wallet.accounts).map((a) => ({ action: StakingAction.Nothing, account: a }))

    const canDoSelectionAction = (selection: StakingSelection): boolean =>
        selection.account.rawIotaBalance >= DUST_THRESHOLD

    const isAccountStaked = (account: WalletAccount): boolean =>
        $stakedAccounts.find((a) => a.id === account.id) !== undefined

    const shouldSelectionBeActive = (selection: StakingSelection): boolean => {
        switch (selection.action) {
            case StakingAction.Stake:
                return true
            case StakingAction.Unstake:
                return false
            case StakingAction.Nothing:
                return $stakedAccounts.find((a) => a.id === selection.account.id) !== undefined
            default:
                return false
        }
    }

    const handleStakeAccountToggle = (selection: StakingSelection): void => {
        if (!canDoSelectionAction(selection)) return

        let { account, action } = selection
        if (isAccountStaked(account)) {
            action = action === StakingAction.Nothing ? StakingAction.Unstake : StakingAction.Nothing
        } else {
            action = action === StakingAction.Nothing ? StakingAction.Stake : StakingAction.Nothing
        }

        stakingSelections = stakingSelections.map((ss) => ({
            ...ss,
            action: ss.account.id === account.id ? action : ss.action
        }))

        console.log('SELECTION: ', stakingSelections.find((ss) => ss.account.id === account.id))
    }

    const handleActionClick = (popupType: string): void => {
        openPopup({
            type: popupType,
            hideClose: true,
            preventClose: popupType === 'stakingCompletion',
            props: {
                stakingSelections: stakingSelections.filter((ss) => ss.action !== StakingAction.Nothing),
            }
        })
    }

    const handleStakeClick = (): void => handleActionClick('stakingConfirmation')
    const handleSaveClick = (): void => handleActionClick('stakingCompletion')
</script>

<style>
    .staking {
        max-height: 25vh;
    }
</style>

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
        {#each stakingSelections as ss}
            <div
                on:click={() => handleStakeAccountToggle(ss)}
                class="w-full space-x-4 mb-4 flex flex-row px-4 py-3 rounded-xl border border-1 border-solid items-center justify-between border-gray-300 dark:border-gray-700 {canDoSelectionAction(ss) ? 'hover:border-gray-500 dark:hover:border-gray-700 focus:border-gray-500 focus:hover:border-gray-700' : ''}"
            >
                <Icon
                    icon={shouldSelectionBeActive(ss) ? 'lock' : 'unlock'}
                    classes={canDoSelectionAction(ss) ? '' : 'fill-current text-gray-500'}
                />
                <div class="flex flex-col w-3/4">
                    <Text type="p" secondary={!canDoSelectionAction(ss)}>
                        {ss.account.alias}
                    </Text>
                    <Text type="p" secondary>
                        {ss.account.balance} • {ss.account.balanceEquiv}
                    </Text>
                </div>
                <Toggle
                    active={shouldSelectionBeActive(ss)}
                    onClick={() => handleStakeAccountToggle(ss)}
                    classes="justify-self-start"
                />
            </div>
        {/each}
    </div>
    <div></div>
    <div class="flex flex-row space-x-2">
        <Button secondary classes="w-1/2" onClick={closePopup}>
            {locale('actions.cancel')}
        </Button>
        {#if hasStakedAccounts}
            <Button classes="w-1/2" onClick={handleSaveClick}>
                Save
            </Button>
        {:else}
            <Button classes="w-1/2" onClick={handleStakeClick}>
                Stake
            </Button>
        {/if}
    </div>
</div>
