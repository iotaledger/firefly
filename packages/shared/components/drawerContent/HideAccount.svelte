<script lang="typescript">
    import { getContext } from 'svelte'
    import { Readable } from 'svelte/store'

    import { Button, Password, Text } from 'shared/components'

    import { localize } from '@core/i18n'
    import { accountRouter, AccountRoute, resetWalletRoute } from '@core/router'

    import { isKeyboardOpened, keyboardHeight, sendParams } from '@lib/app'
    import { activeProfile, isSoftwareProfile, updateProfile } from '@lib/profile'
    import { WalletAccount } from '@lib/typings/wallet'
    import { api, selectedMessage } from '@lib/wallet'

    export let account: WalletAccount

    const viewableAccounts = getContext<Readable<WalletAccount[]>>('viewableAccounts')
    const hasMultipleAccounts = $viewableAccounts.length > 1

    const hiddenAccounts = $activeProfile?.hiddenAccounts ?? []

    $: canDelete = account ? account.rawIotaBalance === 0 : false

    let password = ''
    let error = ''
    let isBusy = false

    function hideAccount(id: string): void {
        if (!hiddenAccounts.includes(id)) {
            hiddenAccounts.push(id)
            updateProfile('hiddenAccounts', hiddenAccounts)
        }
        // TODO: handle for single wallet view
        selectedMessage.set(null)
        resetWalletRoute()
    }

    function handleHideClick(): void {
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

    function handleMoveFundsClick(): void {
        $accountRouter.goTo(AccountRoute.Init)
        sendParams.update((params) => ({ ...params, amount: account.rawIotaBalance.toString(), isInternal: true }))
        $accountRouter.goTo(AccountRoute.Send)
    }

    function handleCancelClick(): void {
        $accountRouter.goTo(AccountRoute.Init)
    }

    function triggerHideAccount(): void {
        isBusy = false
        $accountRouter.goTo(AccountRoute.Init)
        hideAccount(account?.id)
    }
</script>

<div
    class="flex flex-col px-6 py-10"
    style="padding-bottom: {$isKeyboardOpened
        ? $keyboardHeight
        : 0}px; transition: padding-bottom 0.2s cubic-bezier(0, 0.5, 0, 1.1)"
>
    {#if canDelete}
        <div class="mb-6 -mt-4">
            <Text type="h4" classes="flex w-full justify-center">
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
                        submitHandler={() => handleHideClick()}
                        disabled={isBusy}
                    />
                {/if}
            {:else}
                <Text type="p" secondary classes="mb-5">{localize('popups.hideAccount.errorBody3')}</Text>
            {/if}
            <div
                class={`flex flex-row w-full space-x-4 px-8 ${
                    hasMultipleAccounts ? 'justify-between' : 'justify-center'
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
        <div class="mb-6 -mt-4">
            <Text type="h4" classes="flex w-full justify-center">
                {localize('popups.hideAccount.errorTitle', { values: { name: account?.alias } })}
            </Text>
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
