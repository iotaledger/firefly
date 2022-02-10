<script lang="typescript">
    import { Button, Text } from 'shared/components'
    import { activeProfile } from 'shared/lib/profile'
    import { accountRoute } from 'shared/lib/router'
    import { AccountRoutes } from 'shared/lib/typings/routes'
    import { selectedAccountId } from 'shared/lib/wallet'
    import { getContext } from 'svelte'
    import type { Readable } from 'svelte/store'
    import { ManageAccount, Receive, Send } from '.'
    import { Locale } from 'shared/lib/typings/i18n'
    import { WalletAccount } from 'shared/lib/typings/wallet'

    export let locale: Locale

    export let onSend = (..._: any[]): void => {}
    export let onGenerateAddress = (..._: any[]): void => {}
    export let onInternalTransfer = (..._: any[]): void => {}

    export let isGeneratingAddress

    const hiddenAccounts = $activeProfile?.hiddenAccounts ?? []

    const account = getContext<Readable<WalletAccount>>('selectedAccount')
    function handleSendClick() {
        accountRoute.set(AccountRoutes.Send)
    }
</script>

{#if $accountRoute === AccountRoutes.Init}
    <div class="w-full h-full flex flex-col justify-between p-8">
        <div class="flex flex-col justify-between h-full">
            <div class="flex flex-col justify-between items-center h-full">
                {#if hiddenAccounts.includes($selectedAccountId)}
                    <Text type="p" secondary>{locale('general.accountRemoved')}</Text>
                {:else}
                    <Button icon="send" classes="w-full mb-6 p-4" secondary onClick={() => handleSendClick()}>
                        {locale('general.sendFunds')}
                        <Text type="p" smaller secondary>{locale('general.sendTokensToAddress')}</Text>
                    </Button>
                    <Receive {isGeneratingAddress} {onGenerateAddress} {locale} />
                {/if}
            </div>
        </div>
    </div>
{:else if $accountRoute === AccountRoutes.Send}
    <Send {onSend} {onInternalTransfer} {locale} />
{:else if $accountRoute === AccountRoutes.Manage}
    <ManageAccount {locale} alias={$account.alias} account={$account} />
{/if}
