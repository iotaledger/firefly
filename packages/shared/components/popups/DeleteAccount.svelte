<script>
    import { getContext } from 'svelte'
    import { api, selectedAccountId } from 'shared/lib/wallet'
    import { sendParams } from 'shared/lib/app'
    import { walletViewState, WalletViewStates, accountViewState, AccountViewStates } from 'shared/lib/router'
    import { Password, Button, Text } from 'shared/components'

    export let locale

    const popupState = getContext('popupState')
    const account = getContext('selectedAccount')

    $: canDelete = $account.rawIotaBalance == 0

    let password

    function handleDeleteClick() {
        api.setStrongholdPassword(password, {
            onSuccess(response) {
                // 1. Delete account
                // 2. Close popup
                popupState.set({ active: false })
                // 3. Go to main dashboard
                selectedAccountId.set(null)
                accountViewState.set(AccountViewStates.Init)
                walletViewState.set(WalletViewStates.Init)
            },
            onError(error) {
                console.error(error)
            },
        })
    }
    function handleMoveFundsClick() {
        popupState.set({ active: false })
        sendParams.update((params) => ({ ...params, amount: $account.rawIotaBalance })) // TODO: fix input amount
        accountViewState.set(AccountViewStates.Send)
    }
    function handleCancelClick() {
        popupState.set({ active: false })
    }
</script>

{#if canDelete}
    <div class="mb-5">
        <Text type="h4">{locale('popups.delete_account.title', { values: { name: $account.alias } })}</Text>
    </div>
    <div class="flex w-full flex-row flex-wrap">
        <Text type="p" secondary classes="mb-5">{locale('popups.delete_account.body')}</Text>
        <Text type="p" secondary classes="mb-3">{locale('popups.delete_account.type_password')}</Text>
        <Password
            classes="w-full mb-8"
            bind:value={password}
            showRevealToggle
            {locale}
            placeholder={locale('general.password')} />
        <div class="flex flex-row justify-between w-full space-x-4 px-8">
            <Button secondary classes="w-1/2" onClick={() => handleCancelClick()}>{locale('actions.cancel')}</Button>
            <Button warning classes="w-1/2" onClick={() => handleDeleteClick()}>{locale('actions.delete_account')}</Button>
        </div>
    </div>
{:else}
    <div class="mb-5">
        <Text type="h4">{locale('popups.delete_account.error_title', { values: { name: $account.alias } })}</Text>
    </div>
    <div class="flex w-full flex-row flex-wrap">
        <Text type="p" secondary classes="mb-3">{locale('popups.delete_account.error_body_1')}</Text>
        <Text type="p" secondary classes="mb-5">
            {locale('popups.delete_account.error_body_2', { values: { balance: $account.balance } })}
        </Text>
        <div class="flex flex-row justify-between w-full space-x-4 px-8">
            <Button secondary classes="w-1/2" onClick={() => handleCancelClick()}>{locale('actions.dismiss')}</Button>
            <Button classes="w-1/2" onClick={() => handleMoveFundsClick()}>{locale('general.move_funds')}</Button>
        </div>
    </div>
{/if}
