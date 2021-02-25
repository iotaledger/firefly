<script lang="typescript">
    import { getContext } from 'svelte'
    import { Text, Button } from 'shared/components'
    import { Send, Receive, ManageAccount } from '.'
    import { accountRoute } from 'shared/lib/router'
    import { AccountRoutes } from 'shared/lib/typings/routes'

    export let locale
    export let send
    export let generateAddress
    export let internalTransfer
    export let setAlias

    const account = getContext('selectedAccount')
    function handleSendClick() {
        accountRoute.set(AccountRoutes.Send)
    }
</script>

{#if $accountRoute === AccountRoutes.Init}
    <div class="w-full h-full flex flex-col justify-between p-8">
        <div class="flex flex-col justify-between">
            <div class="flex flex-col justify-between items-center">
                <Button icon="send" classes="w-full mb-5 p-4" secondary onClick={() => handleSendClick()}>
                    {locale('general.send_funds')}
                    <Text type="p" smaller secondary>{locale('general.send_tokens_to_address')}</Text>
                </Button>
                <Receive {generateAddress} {locale} />
            </div>
        </div>
    </div>
{:else if $accountRoute === AccountRoutes.Send}
    <Send {send} {internalTransfer} {locale} />
{:else if $accountRoute === AccountRoutes.Manage}
    <ManageAccount {locale} name={$account.name} {setAlias} />
{/if}
