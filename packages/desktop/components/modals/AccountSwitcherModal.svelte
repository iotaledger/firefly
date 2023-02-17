<script lang="ts">
    import { tick } from 'svelte'
    import { AccountSwitcherMenuItem, HR, Icon, Modal, Text, TextType } from '@ui'
    import { sumBalanceForAccounts } from '@core/account'
    import { selectedAccount } from '@core/account/stores'
    import { localize } from '@core/i18n'
    import { BASE_TOKEN } from '@core/network'
    import { activeProfile, visibleActiveAccounts } from '@core/profile'
    import { formatTokenAmountBestMatch } from '@core/wallet'
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { openPopup } from '@auxiliary/popup'

    export let modal: Modal = undefined

    $: totalBalance = sumBalanceForAccounts($visibleActiveAccounts)

    async function scrollToSelectedAccount(): Promise<void> {
        await tick()
        const element = document.getElementById(`account-${$selectedAccount.index}`)
        element?.scrollIntoView({ behavior: 'auto' })
    }

    function handleCreateAccountClick(): void {
        modal?.close()
        openPopup({ id: 'createAccount' })
    }
</script>

<Modal
    bind:this={modal}
    on:open={scrollToSelectedAccount}
    classes="transform -translate-x-1/2"
    size="large"
    position={{ top: '30px', left: '50%' }}
>
    <account-list-container class="block p-4">
        <account-list class="flex flex-col space-y-1 max-h-96 scrollable-y">
            {#each $visibleActiveAccounts as account}
                <AccountSwitcherMenuItem id="account-{account.index}" {account} onClick={modal?.close} />
            {/each}
        </account-list>
    </account-list-container>
    <HR />
    <button
        type="button"
        class=" flex flex-row justify-between w-full p-8 hover:bg-gray-50 dark:hover:bg-gray-800"
        on:click={handleCreateAccountClick}
    >
        <div class="flex flex-row items-center space-x-4">
            <Icon icon={IconEnum.Plus} height="12" width="12" classes="text-blue-500" />
            <Text highlighted type={TextType.h5} classes="text-14">{localize('general.addAWallet')}</Text>
        </div>
        <Text classes="opacity-50" type={TextType.h5}>
            {localize('general.total', {
                values: {
                    balance: formatTokenAmountBestMatch(totalBalance, BASE_TOKEN[$activeProfile.networkProtocol]),
                },
            })}
        </Text>
    </button>
</Modal>
