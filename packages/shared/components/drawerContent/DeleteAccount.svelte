<script lang="typescript">
    import { WalletAccount } from '@lib/typings/wallet'
    import { Button, Password, Text } from 'shared/components'
    import { localize } from '@core/i18n'
    import { activeProfile, isSoftwareProfile, updateProfile } from 'shared/lib/profile'
    import { AccountRoute, accountRouter, resetWalletRoute } from '@core/router'
    import { api, asyncRemoveWalletAccount, selectedMessage, setSelectedAccount } from 'shared/lib/wallet'
    import { getContext } from 'svelte'
    import { Readable } from 'svelte/store'

    export let account
    const viewableAccounts = getContext<Readable<WalletAccount[]>>('viewableAccounts')
    const hiddenAccounts = $activeProfile?.hiddenAccounts ?? []

    async function deleteAccount(id) {
        await asyncRemoveWalletAccount(account.id)
        if (!hiddenAccounts.includes(id)) {
            hiddenAccounts.push(id)
            updateProfile('hiddenAccounts', hiddenAccounts)
        }
        // TODO: handle for single wallet view
        selectedMessage.set(null)
        resetWalletRoute()
        setSelectedAccount($viewableAccounts?.[0]?.id ?? null)
    }
    const hasMultipleAccounts = $viewableAccounts.length > 1

    let password
    let error = ''
    let isBusy = false

    async function handleDeleteClick() {
        if (hasMultipleAccounts) {
            isBusy = true
            error = ''
            if ($isSoftwareProfile) {
                api.setStrongholdPassword(password, {
                    async onSuccess() {
                        await triggerDeleteAccount()
                    },
                    onError(err) {
                        isBusy = false
                        error = localize(err.error)
                    },
                })
            } else {
                await triggerDeleteAccount()
            }
        }
    }
    function handleCancelClick() {
        $accountRouter.goTo(AccountRoute.Init)
    }

    async function triggerDeleteAccount() {
        isBusy = false
        $accountRouter.goTo(AccountRoute.Init)
        await deleteAccount(account?.id)
    }
</script>

<div class="flex flex-col px-6 py-10">
    <div class="mb-5">
        <Text type="h4">
            {localize(`popups.deleteAccount.${hasMultipleAccounts ? 'title' : 'errorTitle'}`, {
                values: { name: account?.alias },
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
                    {localize}
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
