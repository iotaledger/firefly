<script lang="typescript">
    import { Button, PasswordInput, Text } from 'shared/components'
    import { sendParams } from 'shared/lib/app'
    import { closePopup } from 'shared/lib/popup'
    import { isSoftwareProfile } from '@core/profile'
    import { setStrongholdPassword } from '@core/profile-manager'
    import { AccountIdentifier } from '@lib/typings/accountIdentifier'
    import { Locale } from '@core/i18n'
    import { formatUnitPrecision, Unit } from '@lib/units'
    import { selectedAccount } from '@core/account'

    export let locale: Locale
    export let hasMultipleAccounts: boolean
    export let hideAccount: (id: AccountIdentifier) => void = () => {}

    $: canDelete = $selectedAccount ? Number($selectedAccount?.balances?.total) === 0 : false

    let password: string
    let error = ''
    let isBusy = false

    async function handleHideClick(): Promise<void> {
        if (hasMultipleAccounts) {
            isBusy = true
            error = ''
            if ($isSoftwareProfile) {
                await hideStrongholdAccount(password)
            } else {
                triggerHideAccount()
            }
        }
    }

    async function hideStrongholdAccount(password: string): Promise<void> {
        try {
            await setStrongholdPassword(password)
            triggerHideAccount()
        } catch (e) {
            isBusy = false
            error = locale(e.error)
        }
    }

    function handleMoveFundsClick(): void {
        closePopup()
        sendParams.update((params) => ({
            ...params,
            amount: formatUnitPrecision(Number($selectedAccount?.balances.total), Unit.M, false),
            unit: Unit.M,
            isInternal: true,
        }))
        // TODO: open send form
    }

    function handleCancelClick(): void {
        closePopup()
    }

    function triggerHideAccount(): void {
        isBusy = false
        closePopup()
        hideAccount($selectedAccount?.id)
    }
</script>

{#if canDelete}
    <div class="mb-5">
        <Text type="h4">
            {locale(`popups.hideAccount.${hasMultipleAccounts ? 'title' : 'errorTitle'}`, {
                values: { name: $selectedAccount?.getAlias() },
            })}
        </Text>
    </div>
    <div class="flex w-full flex-row flex-wrap">
        {#if hasMultipleAccounts}
            <Text type="p" secondary classes="mb-5">{locale('popups.hideAccount.body')}</Text>
            {#if $isSoftwareProfile}
                <Text type="p" secondary classes="mb-3">{locale('popups.hideAccount.typePassword')}</Text>
                <PasswordInput
                    {error}
                    classes="w-full mb-8"
                    bind:value={password}
                    showRevealToggle
                    placeholder={locale('general.password')}
                    autofocus
                    submitHandler={() => handleHideClick()}
                    disabled={isBusy}
                />
            {/if}
        {:else}
            <Text type="p" secondary classes="mb-5">{locale('popups.hideAccount.errorBody3')}</Text>
        {/if}
        <div
            class={`flex flex-row w-full space-x-4 px-8 ${hasMultipleAccounts ? 'justify-between' : 'justify-center'}`}
        >
            <Button secondary classes="w-1/2" onClick={() => handleCancelClick()} disabled={isBusy}>
                {locale(hasMultipleAccounts ? 'actions.cancel' : 'actions.close')}
            </Button>
            {#if hasMultipleAccounts}
                <Button
                    warning
                    classes="w-1/2"
                    onClick={() => handleHideClick()}
                    type="submit"
                    disabled={(!password && $isSoftwareProfile) || isBusy}
                >
                    {locale('actions.hideAccount')}
                </Button>
            {/if}
        </div>
    </div>
{:else}
    <div class="mb-5">
        <Text type="h4"
            >{locale('popups.hideAccount.errorTitle', { values: { name: $selectedAccount?.getAlias() } })}</Text
        >
    </div>
    <div class="flex w-full flex-row flex-wrap">
        <Text type="p" secondary classes="mb-3">{locale('popups.hideAccount.errorBody1')}</Text>
        <Text type="p" secondary classes="mb-5">
            {locale('popups.hideAccount.errorBody2', { values: { balance: $selectedAccount?.balances?.total } })}
        </Text>
        <div class="flex flex-row justify-between w-full space-x-4 md:px-8">
            <Button secondary classes="w-1/2" onClick={() => handleCancelClick()}>{locale('actions.dismiss')}</Button>
            <Button classes="w-1/2" onClick={() => handleMoveFundsClick()}>{locale('general.moveFunds')}</Button>
        </div>
    </div>
{/if}
