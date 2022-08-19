<script lang="typescript">
    import { localize } from '@core/i18n'
    import { mobile } from '@lib/app'
    import { Button, Password, Text } from 'shared/components'
    import { closePopup } from 'shared/lib/popup'
    import { isSoftwareProfile } from 'shared/lib/profile'
    import { AccountIdentifier } from 'shared/lib/typings/account'
    import { WalletAccount } from 'shared/lib/typings/wallet'
    import { api } from 'shared/lib/wallet'
    import { Writable } from 'svelte/store'

    export let account: Writable<WalletAccount>
    export let deleteAccount: (id: AccountIdentifier) => void = () => {}
    export let hasMultipleAccounts

    let password
    let error = ''
    let isBusy = false

    function handleDeleteClick() {
        if (hasMultipleAccounts) {
            isBusy = true
            error = ''
            if ($isSoftwareProfile) {
                api.setStrongholdPassword(password, {
                    onSuccess() {
                        triggerDeleteAccount()
                    },
                    onError(err) {
                        isBusy = false
                        error = localize(err.error)
                    },
                })
            } else {
                triggerDeleteAccount()
            }
        }
    }
    function handleCancelClick() {
        closePopup()
    }

    function triggerDeleteAccount() {
        isBusy = false
        closePopup()
        deleteAccount($account?.id)
    }
</script>

<div class="flex flex-col {$mobile ? 'safe-area px-6 py-10' : ''}">
    <div class={$mobile ? 'mb-6 -mt-4' : 'mb-5'}>
        <Text type="h4" classes={$mobile ? 'flex w-full justify-center' : ''}>
            {localize(`popups.deleteAccount.${hasMultipleAccounts ? 'title' : 'errorTitle'}`, {
                values: { name: $account?.alias },
            })}
        </Text>
    </div>
    <div class="flex w-full flex-row flex-wrap">
        {#if hasMultipleAccounts}
            <Text type="p" secondary classes="mb-5">{localize('popups.deleteAccount.body')}</Text>
            {#if $isSoftwareProfile}
                <Text type="p" secondary classes="mb-3">{localize('popups.deleteAccount.typePassword')}</Text>
                <Password
                    {error}
                    classes="w-full mb-8"
                    bind:value={password}
                    showRevealToggle
                    locale={localize}
                    placeholder={localize('general.password')}
                    autofocus
                    submitHandler={() => handleDeleteClick()}
                    disabled={isBusy}
                />
            {/if}
        {:else}
            <Text type="p" secondary classes="mb-5">{localize('popups.deleteAccount.errorBody1')}</Text>
        {/if}
        <div class={'flex flex-row w-full space-x-4 px-8 justify-center'}>
            <Button secondary classes="w-1/2" onClick={() => handleCancelClick()} disabled={isBusy}>
                {localize(hasMultipleAccounts ? 'actions.cancel' : 'actions.close')}
            </Button>
            {#if hasMultipleAccounts}
                <Button
                    warning
                    classes="w-1/2"
                    onClick={() => handleDeleteClick()}
                    type="submit"
                    disabled={(!password && $isSoftwareProfile) || isBusy}
                >
                    {localize('actions.deleteAccount')}
                </Button>
            {/if}
        </div>
    </div>
</div>

<style type="text/scss">
    .safe-area {
        margin-bottom: calc(env(safe-area-inset-top) / 2);
    }
</style>
