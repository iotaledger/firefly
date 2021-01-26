<script lang="typescript">
    import { createEventDispatcher, getContext } from 'svelte'
    import { Text, Button, Icon } from 'shared/components'
    import { Send, Receive, ManageAccount } from '.'
    import { AccountState } from './Account.svelte'

    export let locale
    export let send
    export let generateAddress
    export let internalTransfer

    const dispatch = createEventDispatcher()

    const account = getContext('selectedAccount')
    const state = getContext('accountState')
    const showQR = getContext('showQrPopup')

    function handleTransferClick() {
        dispatch('next', AccountState.Transfer)
    }
    function handleManageClick() {
        dispatch('next', AccountState.Manage)
    }
    function handleSendClick() {
        dispatch('next', AccountState.Send)
    }
    function handleReceiveClick() {
        dispatch('next', AccountState.Receive)
    }
</script>

{#if $state === AccountState.Init}
    <div class="w-full h-full flex flex-col justify-between p-8">
        <div class="flex flex-col justify-between">
            <div class="flex flex-row mb-6 justify-between items-center">
                <button
                    on:click={() => showQR.set(true)}
                    class="w-full rounded-2xl bg-gray-50 dark:bg-gray-900 dark:bg-opacity-50 flex items-center p-4 text-left">
                    <div class="flex flex-row mr-4 flex-wrap">
                        <p class="text-gray-500 mb-2 text-10 leading-140">{locale('general.account_address')}</p>
                        <pre
                            class="text-gray-800 dark:text-white text-11 leading-140 font-normal break-all whitespace-pre-line">{$account.address}</pre>
                    </div>
                    <div class="flex-1 items-end flex flex-col">
                        <Icon classes="text-gray-500" icon="qr" />
                    </div>
                </button>
            </div>
            <div class="flex flex-col mb-6 justify-between items-center">
                <Button icon="transfer" classes="w-full mb-5 p-4" secondary onClick={() => handleTransferClick()}>
                    {locale('general.transfer_between_accounts')}
                    <Text type="p" secondary>{locale('general.move_funds_between_accounts')}</Text>
                </Button>
                <Button icon="transfer" classes="w-full mb-5 p-4" secondary onClick={() => handleManageClick()}>
                    {locale('general.manage_account')}
                    <Text type="p" secondary>{locale('general.customize_account')}</Text>
                </Button>
            </div>
        </div>
        <div class="flex flex-row justify-between space-x-4">
            <Button xl secondary icon="receive" classes="w-1/2" onClick={() => handleReceiveClick()}>
                {locale('actions.receive')}
            </Button>
            <Button xl secondary icon="transfer" classes="w-1/2" onClick={() => handleSendClick()}>
                {locale('actions.send')}
            </Button>
        </div>
    </div>
{:else if $state === AccountState.Send}
    <Send on:next {send} {internalTransfer} on:previous {locale} />
{:else if $state === AccountState.Transfer}
    <Send on:next internal {send} {internalTransfer} on:previous {locale} />
{:else if $state === AccountState.Receive}
    <Receive on:next on:previous {generateAddress} {locale} />
{:else if $state === AccountState.Manage}
    <ManageAccount on:next on:previous {locale} name={$account.name} />
{/if}
