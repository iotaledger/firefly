<script lang="typescript">
    import { Button, Password, Text } from 'shared/components'
    import { sendParams } from 'shared/lib/app'
    import { closePopup } from 'shared/lib/popup'
    import { isSoftwareProfile } from 'shared/lib/profile'
    import { accountRoute } from 'shared/lib/router'
    import { AccountRoutes } from 'shared/lib/typings/routes'
    import { api, selectedAccountId } from 'shared/lib/wallet'

    export let locale
    export let account
    export let hideAccount = (selectedAccountId) => {}
    export let hasMultipleAccounts

    $: canDelete = $account ? $account.rawIotaBalance === 0 : false

    let password
    let error = ''
    let isBusy = false

    function handleHideClick() {
        if (hasMultipleAccounts) {
            isBusy = true
            error = ''
            if ($isSoftwareProfile) {
                api.setStrongholdPassword(password, {
                    onSuccess() {
                        triggerHideAccount()
                    },
                    onError(err) {
                        isBusy = false
                        error = locale(err.error)
                    },
                })
            } else {
                triggerHideAccount()
            }
        }
    }
    function handleMoveFundsClick() {
        closePopup()
        sendParams.update((params) => ({ ...params, amount: $account.rawIotaBalance, isInternal: true }))
        accountRoute.set(AccountRoutes.Send)
    }
    function handleCancelClick() {
        closePopup()
    }
    function triggerHideAccount() {
        isBusy = false
        closePopup()
        hideAccount($selectedAccountId)
    }
</script>

{#if canDelete}
    <div class="mb-5">
        <Text type="h4">
            {locale(`popups.hideAccount.${hasMultipleAccounts ? 'title' : 'errorTitle'}`, { values: { name: $account?.alias } })}
        </Text>
    </div>
    <div class="flex w-full flex-row flex-wrap">
        {#if hasMultipleAccounts}
            <Text type="p" secondary classes="mb-5">{locale('popups.hideAccount.body')}</Text>
            {#if $isSoftwareProfile}
                <Text type="p" secondary classes="mb-3">{locale('popups.hideAccount.typePassword')}</Text>
                <Password
                    {error}
                    classes="w-full mb-8"
                    bind:value={password}
                    showRevealToggle
                    {locale}
                    placeholder={locale('general.password')}
                    autofocus
                    submitHandler={() => handleHideClick()}
                    disabled={isBusy} />
            {/if}
        {:else}
            <Text type="p" secondary classes="mb-5">{locale('popups.hideAccount.errorBody3')}</Text>
        {/if}
        <div class={`flex flex-row w-full space-x-4 px-8 ${hasMultipleAccounts ? 'justify-between' : 'justify-center'}`}>
            <Button secondary classes="w-1/2" onClick={() => handleCancelClick()} disabled={isBusy}>
                {locale(hasMultipleAccounts ? 'actions.cancel' : 'actions.close')}
            </Button>
            {#if hasMultipleAccounts}
                <Button
                    warning
                    classes="w-1/2"
                    onClick={() => handleHideClick()}
                    type="submit"
                    disabled={(!password && $isSoftwareProfile) || isBusy}>
                    {locale('actions.hideAccount')}
                </Button>
            {/if}
        </div>
    </div>
{:else}
    <div class="mb-5">
        <Text type="h4">{locale('popups.hideAccount.errorTitle', { values: { name: $account?.alias } })}</Text>
    </div>
    <div class="flex w-full flex-row flex-wrap">
        <Text type="p" secondary classes="mb-3">{locale('popups.hideAccount.errorBody1')}</Text>
        <Text type="p" secondary classes="mb-5">
            {locale('popups.hideAccount.errorBody2', { values: { balance: $account?.balance } })}
        </Text>
        <div class="flex flex-row justify-between w-full space-x-4 px-8">
            <Button secondary classes="w-1/2" onClick={() => handleCancelClick()}>{locale('actions.dismiss')}</Button>
            <Button classes="w-1/2" onClick={() => handleMoveFundsClick()}>{locale('general.moveFunds')}</Button>
        </div>
    </div>
{/if}
