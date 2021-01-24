<script lang="typescript">
    import { Text, Button, Icon } from 'shared/components'

    export let locale
    export let mobile
    export let account
    export let AccountState
    export let _next
    export let showQR
</script>

<div class="flex flex-col justify-between">
    <div class="flex flex-row mb-6 justify-between items-center">
        <button
            on:click={() => (showQR = true)}
            class="w-full rounded-2xl bg-gray-50 dark:bg-gray-900 dark:bg-opacity-50 flex items-center p-4 text-left">
            <div class="flex flex-row mr-4 flex-wrap">
                <p class="text-gray-500 mb-2 text-10 leading-140">{locale('views.popup.account_address_qr.title')}</p>
                <pre class="text-gray-800 dark:text-white text-11 leading-140">{account.address}</pre>
            </div>
            <div class="flex-1 items-end flex flex-col">
                <Icon classes="text-gray-500" icon="qr" />
            </div>
        </button>
    </div>
    <div class="flex flex-col mb-6 justify-between items-center">
        <Button icon="transfer" classes="w-full mb-5 p-4" secondary onClick={() => _next(AccountState.Transfer)}>
            {locale('general.transfer_between_accounts')}
            <Text type="p" secondary>{locale('general.move_funds_between_accounts')}</Text>
        </Button>
        <Button icon="transfer" classes="w-full mb-5 p-4" secondary onClick={() => _next(AccountState.Manage)}>
            {locale('general.manage_account')}
            <Text type="p" secondary>{locale('general.customize_account')}</Text>
        </Button>
    </div>
</div>
<div class="flex flex-row justify-between space-x-4">
    <Button xl secondary icon="receive" classes="w-1/2" onClick={() => _next(AccountState.Receive)}>
        {locale('actions.receive')}
    </Button>
    <Button xl secondary icon="transfer" classes="w-1/2" onClick={() => _next(AccountState.Send)}>
        {locale('actions.send')}
    </Button>
</div>
