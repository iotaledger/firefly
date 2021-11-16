<script lang="typescript">
    import { Button, Icon, Text } from 'shared/components'
    import { Locale } from 'shared/lib/typings/i18n'
    import { closePopup } from 'shared/lib/popup'
    import { WalletAccount } from 'shared/lib/typings/wallet'
    import { showAppNotification } from 'shared/lib/notifications'
    import { onMount } from 'svelte'
    import { stakedAccounts } from '../../lib/staking'
    import { asyncForEach, sleep } from '../../lib/utils'

    export let locale: Locale
    export let accountsToStake: WalletAccount[] = []

    let accountBeingStaked: WalletAccount
    let hasCompletedStaking: boolean = false

    const isAccountStaked = (account: WalletAccount): boolean =>
        $stakedAccounts.find((a) => a.id === account.id) !== undefined

    const isAccountBeingStaked = (account: WalletAccount): boolean =>
        accountBeingStaked?.id === account.id

    const checkForAccountsToStake = (): void => {
        if (accountsToStake.length === 0) {
            showAppNotification({
                type: 'error',
                message: 'Unable to find wallets for staking.',
            })
            closePopup(true)
        }
    }

    const stakeAccounts = async (): Promise<void> => {
        /**
         * NOTE: This exists so that the view can be updated
         * as progress is happening (since we're using an array,
         * the only way to do this is actually re-assign the value).
         */
        const _reset = () => accountsToStake = accountsToStake

        await asyncForEach(accountsToStake, async (account, idx, arr) => {
            accountBeingStaked = account
            _reset()

            await sleep(2400)

            stakedAccounts.update((_stakedAccounts) => [..._stakedAccounts, account])
            _reset()

            accountBeingStaked = undefined
        })

        hasCompletedStaking = true
    }

    onMount(async () => {
        checkForAccountsToStake()

        await stakeAccounts()
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
        {#each accountsToStake as account}
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
        <Button classes="w-full" onClick={() => closePopup(true)} disabled={!hasCompletedStaking}>
            Done
        </Button>
    </div>
</div>
