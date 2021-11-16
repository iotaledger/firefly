<script lang="typescript">
    import { Button, Icon, Text, Toggle } from 'shared/components'
    import { closePopup, openPopup } from 'shared/lib/popup'
    import { Locale } from 'shared/lib/typings/i18n'
    import { get } from 'svelte/store'
    import { DUST_THRESHOLD, wallet } from '../../lib/wallet'
    import { WalletAccount } from '../../lib/typings/wallet'

    export let locale: Locale

    interface StakingAccount extends WalletAccount {
        willStake: boolean
    }

    let stakableAccounts: StakingAccount[] = get($wallet.accounts).map((a) => ({ ...a, willStake: false }))

    const canAccountBeStaked = (account: StakingAccount): boolean =>
        account.rawIotaBalance >= DUST_THRESHOLD

    const handleStakeAccountToggle = (account: StakingAccount): void => {
        if (!canAccountBeStaked(account)) return

        stakableAccounts = stakableAccounts.map((a) => ({
            ...a,
            willStake: a.id === account.id ? !a.willStake : a.willStake
        }))
    }

    const handleStakeClick = (): void => {
        openPopup({
            type: 'stakingConfirmation',
            hideClose: true,
            props: {
                accountsToStake: stakableAccounts.filter((a) => a.willStake),
            },
        })
    }
</script>

<style>
    .staking {
        max-height: 25vh;
    }
</style>

<div class="flex flex-col space-y-5">
    <Text type="h5">
        Choose which wallets you want to stake
    </Text>
    <Text type="p" secondary>
        When you stake a wallet, your funds are cocked.
        You can unlock these wallets at any time, but
        then you won’t get full staking rewards.
    </Text>
    <div class="staking flex flex-col scrollable-y">
        {#each stakableAccounts as account}
            <div
                on:click={() => handleStakeAccountToggle(account)}
                class="w-full space-x-4 mb-4 flex flex-row px-4 py-3 rounded-xl border border-1 border-solid items-center justify-between border-gray-300 dark:border-gray-700 {canAccountBeStaked(account) ? 'hover:border-gray-500 dark:hover:border-gray-700 focus:border-gray-500 focus:hover:border-gray-700' : ''}"
            >
                <Icon
                    icon={account.willStake ? 'lock' : 'unlock'}
                    classes={canAccountBeStaked(account) ? '' : 'fill-current text-gray-500'}
                />
                <div class="flex flex-col w-3/4">
                    <Text type="p" secondary={!canAccountBeStaked(account)}>
                        {account.alias}
                    </Text>
                    <Text type="p" secondary>
                        {account.balance} • {account.balanceEquiv}
                    </Text>
                </div>
                <Toggle
                    active={account.willStake}
                    onClick={() => handleStakeAccountToggle(account)}
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
        <Button classes="w-1/2" onClick={handleStakeClick}>
            Stake
        </Button>
    </div>
</div>
