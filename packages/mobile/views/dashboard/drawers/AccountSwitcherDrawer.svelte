<script lang="typescript">
    import { localize } from '@core/i18n'
    import { BASE_TOKEN } from '@core/network'
    import { activeProfile, visibleActiveAccounts } from '@core/profile'
    import { sumBalanceForAccounts } from '@core/account'
    import { formatTokenAmountBestMatch } from '@core/wallet'
    import features from '../../../features/features'
    import { AccountSwitcherMenuItem, Drawer } from '../../../../mobile/components'
    import { HR, Icon, Text, TextType } from 'shared/components'

    export let onClose: () => unknown = () => {}

    $: totalBalance = sumBalanceForAccounts($visibleActiveAccounts)
</script>

<Drawer {onClose} title={localize('general.accounts')}>
    <div class="flex flex-col w-full">
        <account-list class="accounts flex flex-col scrollable-y">
            {#each $visibleActiveAccounts as account}
                <AccountSwitcherMenuItem id="account-{account.index}" {account} onClick={onClose} />
            {/each}
        </account-list>
        <HR />
        <div class="flex flex-row-reverse h-16">
            <Text classes="opacity-50 m-auto w-full text-right" type={TextType.h5}>
                {localize('general.total', {
                    values: {
                        balance: formatTokenAmountBestMatch(totalBalance, BASE_TOKEN[$activeProfile.networkProtocol]),
                    },
                })}
            </Text>
            {#if features?.dashboard?.createAccount?.enabled}
                <button class="h-full" on:click={() => {}}>
                    <div class="flex flex-row items-center space-x-4">
                        <Icon icon="plus" height="12" width="12" classes="text-blue-500" />
                        <Text highlighted type={TextType.h5} classes="whitespace-nowrap"
                            >{localize('general.addAWallet')}</Text
                        >
                    </div>
                </button>
            {/if}
        </div>
    </div>
</Drawer>
