<script lang="typescript">
    import { localize } from '@core/i18n'
    import { accountRouter } from '@core/router'
    import { AccountRoute } from '@core/router/enums'
    import { Unit } from '@iota/unit-converter'
    import { mobile, isKeyboardOpened, keyboardHeight } from '@lib/app'
    import { formatUnitPrecision } from '@lib/units'
    import { Button, Password, Text } from 'shared/components'
    import { sendParams } from 'shared/lib/app'
    import { closePopup } from 'shared/lib/popup'
    import { isSoftwareProfile } from 'shared/lib/profile'
    import { AccountIdentifier } from 'shared/lib/typings/account'
    import { WalletAccount } from 'shared/lib/typings/wallet'
    import { api } from 'shared/lib/wallet'
    import { Writable } from 'svelte/store'

    export let account: Writable<WalletAccount>
    export let hasMultipleAccounts

    export let hideAccount: (id: AccountIdentifier) => void = () => {}

    let canDelete
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
                        error = localize(err.error)
                    },
                })
            } else {
                triggerHideAccount()
            }
        }
    }
    function handleMoveFundsClick() {
        closePopup()
        sendParams.update((params) => ({
            ...params,
            amount: formatUnitPrecision($account.rawIotaBalance, Unit.Mi, false),
            unit: Unit.Mi,
            isInternal: true,
        }))
        $accountRouter.goTo(AccountRoute.Send)
    }
    function handleCancelClick() {
        closePopup()
    }
    function triggerHideAccount() {
        isBusy = false
        closePopup()
        hideAccount($account?.id)
    }
</script>

<div
    class="flex flex-col {$mobile ? 'safe-area px-2 pt-0 -mb-2 items-center' : 'px-6 py-10'}"
    style="padding-bottom: {$mobile && $isKeyboardOpened
        ? $keyboardHeight
        : 0}px; transition: padding-bottom 0.2s var(--transition-scroll)"
>
    {#if canDelete}
        <div class={$mobile ? 'mb-6 -mt-4' : 'mb-5'}>
            <Text type="h4" classes={$mobile ? 'classes="flex w-full justify-center' : ''}>
                {localize(`popups.hideAccount.${hasMultipleAccounts ? 'title' : 'errorTitle'}`, {
                    values: { name: $account?.alias },
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
                        locale={localize}
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
                class={`flex flex-row w-full space-x-4 md:px-8 ${
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
        <div class={$mobile ? 'mb-6 -mt-4' : 'mb-5'}>
            <Text type="h4" classes={$mobile ? 'classes="flex w-full justify-center' : ''}
                >{localize('popups.hideAccount.errorTitle', { values: { name: $account?.alias } })}</Text
            >
        </div>
        <div class="flex w-full flex-row flex-wrap">
            <Text type="p" secondary classes="mb-3">{localize('popups.hideAccount.errorBody1')}</Text>
            <Text type="p" secondary classes="mb-5">
                {localize('popups.hideAccount.errorBody2', { values: { balance: $account?.balance } })}
            </Text>
            <div class="flex flex-row justify-between w-full space-x-4 md:px-8">
                <Button secondary classes="w-1/2" onClick={() => handleCancelClick()}
                    >{localize('actions.dismiss')}</Button
                >
                <Button classes="w-1/2" onClick={() => handleMoveFundsClick()}>{localize('general.moveFunds')}</Button>
            </div>
        </div>
    {/if}
</div>

<style type="text/scss">
    .safe-area {
        padding-bottom: calc(env(safe-area-inset-bottom) / 2 * 1px);
    }
</style>
