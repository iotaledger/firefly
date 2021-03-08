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
        } else {
            console.error('Cannot allow account deletion.')
        }
    }
    function handleMoveFundsClick() {
        closePopup()
        sendParams.update((params) => ({ ...params, amount: $account.rawIotaBalance })) // TODO: fix input amount
        accountRoute.set(AccountRoutes.Send)
    }
    function handleCancelClick() {
        closePopup()
    }
</script>

{#if canDelete}
    <div class="mb-5">
        <Text type="h4">{locale('popups.delete_account.title', { values: { name: $account?.alias } })}</Text>
    </div>
    <div class="flex w-full flex-row flex-wrap">
        <Text type="p" secondary classes="mb-5">{locale('popups.delete_account.body')}</Text>
        <Text type="p" secondary classes="mb-3">{locale('popups.delete_account.type_password')}</Text>
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
        <div class="flex flex-row justify-between w-full space-x-4 px-8">
            <Button secondary classes="w-1/2" onClick={() => handleCancelClick()} disabled={isBusy}>
                {locale('actions.cancel')}
            </Button>
            <Button warning classes="w-1/2" onClick={() => handleDeleteClick()} type="submit" disabled={!password || isBusy}>
                {locale('actions.delete_account')}
            </Button>
        </div>
    </div>
{:else}
    <div class="mb-5">
        <Text type="h4">{locale('popups.delete_account.error_title', { values: { name: $account?.alias } })}</Text>
    </div>
    <div class="flex w-full flex-row flex-wrap">
        <Text type="p" secondary classes="mb-3">{locale('popups.delete_account.error_body_1')}</Text>
        <Text type="p" secondary classes="mb-5">
            {locale('popups.delete_account.error_body_2', { values: { balance: $account?.balance } })}
        </Text>
        <div class="flex flex-row justify-between w-full space-x-4 px-8">
            <Button secondary classes="w-1/2" onClick={() => handleCancelClick()}>{locale('actions.dismiss')}</Button>
            <Button classes="w-1/2" onClick={() => handleMoveFundsClick()}>{locale('general.move_funds')}</Button>
        </div>
    </div>
{/if}
