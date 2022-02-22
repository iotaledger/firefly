<script lang="typescript">
    import { Button, Text } from 'shared/components'
    import { localize } from 'shared/lib/i18n'
    import { activeProfile } from 'shared/lib/profile'
    import { accountRoute } from 'shared/lib/router'
    import { AccountRoutes } from 'shared/lib/typings/routes'
    import { selectedAccount } from 'shared/lib/wallet'
    import { ManageAccount, Receive, Send } from '.'

    export let onSend = (..._: any[]): void => {}
    export let onGenerateAddress = (..._: any[]): void => {}
    export let onInternalTransfer = (..._: any[]): void => {}

    export let isGeneratingAddress

    const hiddenAccounts = $activeProfile?.hiddenAccounts ?? []

    function handleSendClick() {
        accountRoute.set(AccountRoutes.Send)
    }
</script>

{#if $accountRoute === AccountRoutes.Init}
    <div class="w-full h-full flex flex-col justify-between p-8">
        <div class="flex flex-col justify-between h-full">
            <div class="flex flex-col justify-between items-center h-full">
                {#if hiddenAccounts.includes($selectedAccount?.id)}
                    <Text type="p" secondary>{localize('general.accountRemoved')}</Text>
                {:else}
                    <Button icon="send" classes="w-full mb-6 p-4" secondary onClick={() => handleSendClick()}>
                        {localize('general.sendFunds')}
                        <Text type="p" smaller secondary>{localize('general.sendTokensToAddress')}</Text>
                    </Button>
                    <Receive {isGeneratingAddress} {onGenerateAddress} />
                {/if}
            </div>
        </div>
    </div>
{:else if $accountRoute === AccountRoutes.Send}
    <Send {onSend} {onInternalTransfer} />
{:else if $accountRoute === AccountRoutes.Manage}
    <ManageAccount alias={$selectedAccount.alias} account={$selectedAccount} />
{/if}
