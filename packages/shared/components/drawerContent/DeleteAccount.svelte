<script lang="typescript">
    import { WalletAccount } from '@lib/typings/wallet'
    import { Button, Password, Text } from 'shared/components'
    import { localize } from 'shared/lib/i18n'
    import { activeProfile, isSoftwareProfile, updateProfile } from 'shared/lib/profile'
    import { accountRoute, resetWalletRoute } from 'shared/lib/router'
    import { AccountRoutes } from 'shared/lib/typings/routes'
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
        accountRoute.set(AccountRoutes.Init)
    }

    async function triggerDeleteAccount() {
        isBusy = false
        accountRoute.set(AccountRoutes.Init)
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
        <div class={'flex flex-row flex-nowrap w-full space-x-4'}>
            <Button secondary classes="w-full" onClick={() => handleCancelClick()} disabled={isBusy}>
                {localize(hasMultipleAccounts ? 'actions.cancel' : 'actions.close')}
            </Button>
            {#if hasMultipleAccounts}
                <Button
                    warning
                    classes="w-full"
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
