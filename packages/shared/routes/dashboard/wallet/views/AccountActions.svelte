<script lang="typescript">
    import { getContext } from 'svelte'
    import { Text, Button } from 'shared/components'
    import { Send, Receive, ManageAccount } from '.'
    import { accountViewState, AccountViewStates } from 'shared/lib/app'

    export let locale
    export let send
    export let generateAddress
    export let internalTransfer
    export let setAlias

    const account = getContext('selectedAccount')

    function handleSendClick() {
        accountViewState.set(AccountViewStates.Send)
    }
</script>

{#if $accountViewState === AccountViewStates.Init}
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
{:else if $accountViewState === AccountViewStates.Send}
    <Send {send} {internalTransfer} {locale} />
{:else if $accountViewState === AccountViewStates.Manage}
    <ManageAccount {locale} name={$account.name} {setAlias} />
{/if}
