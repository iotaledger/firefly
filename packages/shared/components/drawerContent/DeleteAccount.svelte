<script lang="typescript">
    import { getContext } from 'svelte'
    import { Readable } from 'svelte/store'

    import { Button, Password, Text } from 'shared/components'

    import { localize } from '@core/i18n'
    import { AccountRoute, accountRouter, resetWalletRoute } from '@core/router'

    import { isKeyboardOpened, keyboardHeight } from '@lib/app'
    import { activeProfile, isSoftwareProfile, updateProfile } from '@lib/profile'
    import { WalletAccount } from '@lib/typings/wallet'
    import { api, asyncRemoveWalletAccount, selectedMessage, setSelectedAccount } from '@lib/wallet'

    export let account: WalletAccount

    const viewableAccounts = getContext<Readable<WalletAccount[]>>('viewableAccounts')
    const hiddenAccounts = $activeProfile?.hiddenAccounts ?? []

    async function deleteAccount(id): Promise<void> {
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

    let password: string
    let error = ''
    let isBusy = false

    async function handleDeleteClick(): Promise<void> {
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
    function handleCancelClick(): void {
        $accountRouter.goTo(AccountRoute.Init)
    }

    async function triggerDeleteAccount(): Promise<void> {
        isBusy = false
        $accountRouter.goTo(AccountRoute.Init)
        await deleteAccount(account?.id)
    }
</script>

<div
    class="flex flex-col px-6 py-10"
    style="padding-bottom: {$isKeyboardOpened
        ? $keyboardHeight
        : 0}px; transition: padding-bottom 0.2s var(--transition-scroll)"
>
    <div class="mb-6 -mt-4">
        <Text type="h4" classes="flex w-full justify-center">
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
