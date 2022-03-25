<script lang="typescript">
    import { WalletAccount } from '@lib/typings/wallet'
    import { Button, Password, Text } from 'shared/components'
    import { sendParams } from 'shared/lib/app'
    import { localize } from 'shared/lib/i18n'
    import { activeProfile, isSoftwareProfile, updateProfile } from 'shared/lib/profile'
    import { accountRoute, resetWalletRoute } from 'shared/lib/router'
    import { AccountRoutes } from 'shared/lib/typings/routes'
    import { api, selectedMessage, setSelectedAccount } from 'shared/lib/wallet'
    import { getContext } from 'svelte'
    import { Readable } from 'svelte/store'

    export let account

    const viewableAccounts = getContext<Readable<WalletAccount[]>>('viewableAccounts')
    const hasMultipleAccounts = $viewableAccounts.length > 1

    const hiddenAccounts = $activeProfile?.hiddenAccounts ?? []

    let canDelete
    $: canDelete = account ? account.rawIotaBalance === 0 : false

    let password
    let error = ''
    let isBusy = false

    function hideAccount(id) {
        if (!hiddenAccounts.includes(id)) {
            hiddenAccounts.push(id)
            updateProfile('hiddenAccounts', hiddenAccounts)
        }
        // TODO: handle for single wallet view
        selectedMessage.set(null)
        resetWalletRoute()
        setSelectedAccount($viewableAccounts?.[0]?.id ?? null)
    }

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
                        error = localize(err.error)
                    },
                })
            } else {
                triggerHideAccount()
            }
        }
    }

    function handleMoveFundsClick() {
        accountRoute.set(AccountRoutes.Init)
        sendParams.update((params) => ({ ...params, amount: account.rawIotaBalance, isInternal: true }))
        accountRoute.set(AccountRoutes.Send)
    }

    function handleCancelClick() {
        accountRoute.set(AccountRoutes.Init)
    }

    function triggerHideAccount() {
        isBusy = false
        accountRoute.set(AccountRoutes.Init)
        hideAccount(account?.id)
    }
</script>

<div class="flex flex-col px-6 py-10">
    {#if canDelete}
        <div class="mb-5">
            <Text type="h4">
                {localize(`popups.hideAccount.${hasMultipleAccounts ? 'title' : 'errorTitle'}`, {
                    values: { name: account?.alias },
                })}
            </Text>
        </div>
        <div class="flex w-full flex-row flex-wrap">
            {#if hasMultipleAccounts}
                <Text type="p" secondary classes="mb-5">{localize('popups.hideAccount.body')}</Text>
                {#if $isSoftwareProfile}
                    <Text type="p" secondary classes="mb-3">{localize('popups.hideAccount.typePassword')}</Text>
                    <Password
                        {error}
                        classes="w-full mb-8"
                        bind:value={password}
                        showRevealToggle
                        {localize}
                        placeholder={localize('general.password')}
                        autofocus
                        submitHandler={() => handleHideClick()}
                        disabled={isBusy}
                    />
                {/if}
            {:else}
                <Text type="p" secondary classes="mb-5">{localize('popups.hideAccount.errorBody3')}</Text>
            {/if}
            <div
                class={`flex flex-row flex-nowrap w-full ${
                    hasMultipleAccounts ? 'justify-between space-x-4' : 'justify-center'
                }`}
            >
                <Button secondary classes="w-1/2" onClick={() => handleCancelClick()} disabled={isBusy}>
                    {localize(hasMultipleAccounts ? 'actions.cancel' : 'actions.close')}
                </Button>
                {#if hasMultipleAccounts}
                    <Button
                        warning
                        classes="w-1/2"
                        onClick={() => handleHideClick()}
                        type="submit"
                        disabled={(!password && $isSoftwareProfile) || isBusy}
                    >
                        {localize('actions.hideAccount')}
                    </Button>
                {/if}
            </div>
        </div>
    {:else}
        <div class="mb-5">
            <Text type="h4">{localize('popups.hideAccount.errorTitle', { values: { name: account?.alias } })}</Text>
        </div>
        <div class="flex w-full flex-row flex-wrap">
            <Text type="p" secondary classes="mb-3">{localize('popups.hideAccount.errorBody1')}</Text>
            <Text type="p" secondary classes="mb-5">
                {localize('popups.hideAccount.errorBody2', { values: { balance: account?.balance } })}
            </Text>
            <div class="flex flex-row justify-between w-full space-x-4 md:px-8">
                <Button secondary classes="w-1/2" onClick={() => handleCancelClick()}>
                    {localize('actions.dismiss')}
                </Button>
                <Button classes="w-1/2" onClick={() => handleMoveFundsClick()}>{localize('general.moveFunds')}</Button>
            </div>
        </div>
    {/if}
</div>
