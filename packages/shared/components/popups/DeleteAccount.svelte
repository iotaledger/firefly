<script lang="typescript">
    import { Button, Password, Text } from 'shared/components'
    import { sendParams } from 'shared/lib/app'
    import { showAppNotification } from 'shared/lib/notifications'
    import { closePopup } from 'shared/lib/popup'
    import { accountRoute, walletRoute } from 'shared/lib/router'
    import { AccountRoutes, WalletRoutes } from 'shared/lib/typings/routes'
    import { api, selectedAccountId } from 'shared/lib/wallet'

    export let locale
    export let account
    export let deleteAccount = (selectedAccountId) => {}
    export let hasMultipleAccounts

    $: canDelete = $account ? $account.rawIotaBalance === 0 : false

    let password
    let error = ''
    let isBusy = false

    function handleDeleteClick() {
        if (hasMultipleAccounts) {
            isBusy = true
            error = ''
            api.setStrongholdPassword(password, {
                onSuccess() {
                    api.removeAccount($selectedAccountId, {
                        onSuccess() {
                            isBusy = false

                            // 1. Close popup
                            closePopup()

                            // 2. Remove account from walletAccounts
                            deleteAccount($selectedAccountId)

                            // 3. Go to main dashboard
                            selectedAccountId.set(null)
                            accountRoute.set(AccountRoutes.Init)
                            walletRoute.set(WalletRoutes.Init)
                        },
                        onError(err) {
                            isBusy = false

                            showAppNotification({
                                type: 'error',
                                message: locale(err.error),
                            })
                        },
                    })
                },
                onError(err) {
                    isBusy = false
                    error = locale(err.error)
                },
            })
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
</script>

{#if canDelete}
    <div class="mb-5">
        <Text type="h4">
            {locale(`popups.deleteAccount.${hasMultipleAccounts ? 'title' : 'errorTitle'}`, {
                values: { name: $account?.alias },
            })}
        </Text>
    </div>
    <div class="flex w-full flex-row flex-wrap">
        {#if hasMultipleAccounts}
            <Text type="p" secondary classes="mb-5">{locale('popups.deleteAccount.body')}</Text>
            <Text type="p" secondary classes="mb-3">{locale('popups.deleteAccount.typePassword')}</Text>
            <Password
                {error}
                classes="w-full mb-8"
                bind:value={password}
                showRevealToggle
                {locale}
                placeholder={locale('general.password')}
                autofocus
                submitHandler={() => handleDeleteClick()}
                disabled={isBusy} />
        {:else}
            <Text type="p" secondary classes="mb-5">{locale('popups.deleteAccount.errorBody3')}</Text>
        {/if}
        <div class={`flex flex-row w-full space-x-4 px-8 ${hasMultipleAccounts ? 'justify-between' : 'justify-center'}`}>
            <Button secondary classes="w-1/2" onClick={() => handleCancelClick()} disabled={isBusy}>
                {locale(hasMultipleAccounts ? 'actions.cancel' : 'actions.close')}
            </Button>
            {#if hasMultipleAccounts}
                <Button warning classes="w-1/2" onClick={() => handleDeleteClick()} type="submit" disabled={!password || isBusy}>
                    {locale('actions.deleteAccount')}
                </Button>
            {/if}
        </div>
    </div>
{:else}
    <div class="mb-5">
        <Text type="h4">{locale('popups.deleteAccount.errorTitle', { values: { name: $account?.alias } })}</Text>
    </div>
    <div class="flex w-full flex-row flex-wrap">
        <Text type="p" secondary classes="mb-3">{locale('popups.deleteAccount.errorBody1')}</Text>
        <Text type="p" secondary classes="mb-5">
            {locale('popups.deleteAccount.errorBody2', { values: { balance: $account?.balance } })}
        </Text>
        <div class="flex flex-row justify-between w-full space-x-4 px-8">
            <Button secondary classes="w-1/2" onClick={() => handleCancelClick()}>{locale('actions.dismiss')}</Button>
            <Button classes="w-1/2" onClick={() => handleMoveFundsClick()}>{locale('general.moveFunds')}</Button>
        </div>
    </div>
{/if}
