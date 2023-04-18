<script lang="ts">
    import { AccountSwitcherMenuItem } from '@components'
    import { HR, Icon, Text, TextType } from '@ui'

    import { sumBalanceForAccounts } from '@core/account'
    import { localize } from '@core/i18n'
    import { visibleActiveAccounts, getBaseToken } from '@core/profile'
    import { formatTokenAmountBestMatch } from '@core/wallet'

    import { closeDrawer, DrawerId, openDrawer } from '@/auxiliary/drawer'
    import features from '@features/features'
    import { Icon as IconEnum } from '@lib/auxiliary/icon'

    $: totalBalance = sumBalanceForAccounts($visibleActiveAccounts)

    function _closeDrawer(): void {
        closeDrawer(DrawerId.AccountSwitcher)
    }
    function onSwitch(): void {
        _closeDrawer()
    }
    function onAddClick(): void {
        _closeDrawer()
        openDrawer({ id: DrawerId.CreateAccount })
    }
</script>

<div class="flex-auto flex flex-col overflow-x-hidden w-full">
    <account-list class="accounts flex flex-col scrollable-y">
        {#each $visibleActiveAccounts as account}
            <AccountSwitcherMenuItem id="account-{account.index}" {account} onClick={onSwitch} />
        {/each}
    </account-list>
    <HR />
    <div class="flex flex-row-reverse h-16">
        <Text classes="opacity-50 m-auto w-full text-right" type={TextType.h5}>
            {localize('general.total', {
                values: {
                    balance: formatTokenAmountBestMatch(totalBalance, getBaseToken()),
                },
            })}
        </Text>
        {#if features?.dashboard?.createAccount?.enabled}
            <button class="h-full" on:click={onAddClick}>
                <div class="flex flex-row items-center space-x-4">
                    <Icon icon={IconEnum.Plus} height="12" width="12" classes="text-blue-500" />
                    <Text highlighted type={TextType.h5} classes="whitespace-nowrap"
                        >{localize('general.addAWallet')}</Text
                    >
                </div>
            </button>
        {/if}
    </div>
</div>
