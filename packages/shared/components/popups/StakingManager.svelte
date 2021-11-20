<script lang="typescript">
    import { get } from 'svelte/store'
    import { Button, Icon, Text } from 'shared/components'
    import { Locale } from 'shared/lib/typings/i18n'
    import { wallet } from 'shared/lib/wallet'
    import { WalletAccount } from '../../lib/typings/wallet'
    import { closePopup, openPopup } from '../../lib/popup'

    export let locale: Locale

    const handleStakeClick = (account: WalletAccount): void => {
        openPopup({
            type: 'stakingConfirmation',
            props: {
                accountToStake: account
            }
        }, true)
    }

    const handleDoneClick = (): void => {
        closePopup(true)
    }
</script>


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
        {#each get($wallet.accounts) as account}
            <div
                class="w-full space-x-4 mb-4 flex flex-row px-4 py-3 rounded-xl border border-1 border-solid items-center justify-between border-gray-300 dark:border-gray-700 hover:border-gray-500 dark:hover:border-gray-700 focus:border-gray-500 focus:hover:border-gray-700"
            >
                <Icon
                    icon="unlock"
                />
                <div class="flex flex-col w-3/4">
                    <Text type="p" classes="">
                        {account.alias}
                    </Text>
                    <Text type="p" secondary>
                        {account.balance} •
                        <Text type="p" secondary classes="inline">
                            {account.balanceEquiv}
                        </Text>
                    </Text>
                </div>
                <Button
                    onClick={() => handleStakeClick(account)}
                >
                    Stake
                </Button>
            </div>
        {/each}
    </div>
    <div></div>
    <div class="flex flex-row space-x-1">
        <Button
            classes="w-full"
            onClick={handleDoneClick}
        >
            Done
        </Button>
    </div>
</div>
