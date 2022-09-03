<script lang="typescript">
    import { Button, ColorPicker, Input, Spinner, Text } from 'shared/components'
    import { getTrimmedLength } from 'shared/lib/helpers'
    import { localize } from '@core/i18n'
    import { closePopup, updatePopupProps } from 'shared/lib/popup'
    import { checkActiveProfileAuth } from '@core/profile'
    import { getRandomAccountColor, tryCreateAdditionalAccount, validateAccountName } from '@core/account'
    import { onMount } from 'svelte'
    import { BaseError } from '@core/error'

    export let accountAlias = ''
    export let color = getRandomAccountColor()
    export let error: BaseError
    export let isBusy = false

    export let _onMount: (..._: any[]) => Promise<void> = async () => {}

    $: accountAlias, (error = null)
    $: trimmedAccountAlias = accountAlias.trim()

    async function handleCreateClick(): Promise<void> {
        try {
            if (!trimmedAccountAlias) {
                return
            }
            isBusy = true
            error = null
            await validateAccountName(trimmedAccountAlias)
            updatePopupProps({ accountAlias, color, error, isBusy })
            await checkActiveProfileAuth(_create, { stronghold: true, ledger: true })
            isBusy = false
        } catch (err) {
            if (!error) {
                error = err.error ? new BaseError({ message: err.error, logToConsole: true }) : err
            }
            isBusy = false
        }
    }

    function handleCancelClick(): void {
        isBusy = false
        closePopup()
    }

    async function _create(): Promise<void> {
        if (trimmedAccountAlias && color) {
            try {
                await tryCreateAdditionalAccount(trimmedAccountAlias, color.toString())
                closePopup()
            } catch (err) {
                isBusy = false
            }
        }
    }

    onMount(async () => {
        isBusy = true
        try {
            await _onMount()
        } catch (err) {
            if (!error) {
                error = err.error ? new BaseError({ message: err.error, logToConsole: true }) : err
            }
        }
        isBusy = false
    })
</script>

<div class="flex flex-col h-full justify-between">
    <div>
        <div class="flex flex-row mb-6">
            <Text type="h5">{localize('general.addAWallet')}</Text>
        </div>
        <div class="w-full flex flex-col justify-between">
            <Input
                error={error?.message}
                bind:value={accountAlias}
                placeholder={localize('general.accountName')}
                autofocus
                submitHandler={handleCreateClick}
                disabled={isBusy}
                classes="mb-4"
            />
            <ColorPicker title={localize('general.accountColor')} bind:active={color} classes="mb-4" />
        </div>
    </div>
    {#if isBusy && !error}
        <Spinner busy={true} message={localize('general.creatingAccount')} classes="justify-center h-12" />
    {/if}
    {#if !isBusy}
        <div class="flex flex-row justify-between px-2">
            <Button secondary classes="-mx-2 w-1/2" onClick={() => handleCancelClick()}>
                {localize('actions.cancel')}
            </Button>
            <Button
                disabled={!getTrimmedLength(accountAlias) || isBusy}
                classes="-mx-2 w-1/2"
                onClick={() => handleCreateClick()}
            >
                {localize('actions.create')}
            </Button>
        </div>
    {/if}
</div>
