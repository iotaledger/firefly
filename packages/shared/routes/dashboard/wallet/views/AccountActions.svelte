<script lang="typescript">
    import { createEventDispatcher, getContext } from 'svelte'
    import { Text, Button } from 'shared/components'
    import { Send, Receive, ManageAccount } from '.'
    import { AccountState } from './Account.svelte'

    export let locale
    export let send
    export let generateAddress
    export let internalTransfer
    export let setAlias

    const dispatch = createEventDispatcher()

    const account = getContext('selectedAccount')

    const state = getContext('accountState')

    function handleSendClick() {
        dispatch('next', AccountState.Send)
    }
</script>

{#if $state === AccountState.Init}
    <div class="w-full h-full flex flex-col justify-between p-8">
        <div class="flex flex-col justify-between">
            <div class="flex flex-col justify-between items-center">
                <Button icon="send" classes="w-full mb-5 p-4" secondary onClick={() => handleSendClick()}>
                    {locale('general.send_funds')}
                    <Text type="p" smaller secondary>{locale('general.send_tokens_to_address')}</Text>
                </Button>
                <Receive on:next on:previous {generateAddress} {locale} />
            </div>
        </div>
    </div>
{:else if $state === AccountState.Send}
    <Send on:next on:previous {send} {internalTransfer} {locale} />
{:else if $state === AccountState.Manage}
    <ManageAccount on:next on:previous {locale} name={$account.name} {setAlias} />
{/if}
