<script lang="typescript">
    import { Button, Password, Text } from 'shared/components'
    import { closePopup } from 'shared/lib/popup'
    import { AccountIdentifier } from 'shared/lib/typings/account'
    import { Locale } from '@core/i18n'
    import { setStrongholdPassword } from '@core/profile-manager'
    import { isSoftwareProfile } from '@core/profile'
    import { selectedAccount } from '@core/account'
    export let locale: Locale

    export let deleteAccount: (id: AccountIdentifier) => void = () => {}
    export let hasMultipleAccounts: boolean

    let password: string
    let error = ''
    let isBusy = false

    async function handleDeleteClick(): Promise<void> {
        if (hasMultipleAccounts) {
            isBusy = true
            error = ''
            if ($isSoftwareProfile) {
                await deleteStrongholdAccount(password)
            } else {
                triggerDeleteAccount()
            }
        }
    }

    async function deleteStrongholdAccount(password: string): Promise<void> {
        try {
            await setStrongholdPassword(password)
            triggerDeleteAccount()
        } catch (e) {
            error = locale(e.error)
            isBusy = false
        }
    }

    function handleCancelClick(): void {
        closePopup()
    }

    function triggerDeleteAccount(): void {
        isBusy = false
        closePopup()
        deleteAccount($selectedAccount?.id)
    }
</script>

<div class="mb-5">
    <Text type="h4">
        {locale(`popups.deleteAccount.${hasMultipleAccounts ? 'title' : 'errorTitle'}`, {
            values: { name: $selectedAccount?.getAlias() },
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
