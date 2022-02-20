<script lang="typescript">
    import { Button, Password, Text } from 'shared/components'
    import { closePopup } from 'shared/lib/popup'
    import { isSoftwareProfile } from 'shared/lib/profile'
    import type { AccountIdentifier } from 'shared/lib/typings/account'
    import type { Locale } from 'shared/lib/typings/i18n'
    import type { WalletAccount } from 'shared/lib/typings/wallet'
    import { api } from 'shared/lib/wallet'
    import type { Writable } from 'svelte/store'

    export let locale: Locale

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
                        error = locale(err.error)
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
        {#if $isSoftwareProfile}
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
                disabled={isBusy}
            />
        {/if}
    {:else}
        <Text type="p" secondary classes="mb-5">{locale('popups.deleteAccount.errorBody1')}</Text>
    {/if}
    <div class={'flex flex-row w-full space-x-4 px-8 justify-center'}>
        <Button secondary classes="w-1/2" onClick={() => handleCancelClick()} disabled={isBusy}>
            {locale(hasMultipleAccounts ? 'actions.cancel' : 'actions.close')}
        </Button>
        {#if hasMultipleAccounts}
            <Button
                warning
                classes="w-1/2"
                onClick={() => handleDeleteClick()}
                type="submit"
                disabled={(!password && $isSoftwareProfile) || isBusy}
            >
                {locale('actions.deleteAccount')}
            </Button>
        {/if}
    </div>
</div>
