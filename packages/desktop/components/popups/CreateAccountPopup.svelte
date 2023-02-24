<script lang="ts">
    import { onMount } from 'svelte'
    import { Button, ColorPicker, Input, Text, TextType } from '@ui'
    import { getRandomAccountColor, tryCreateAdditionalAccount, validateAccountName } from '@core/account'
    import { handleError } from '@core/error/handlers/handleError'
    import { localize } from '@core/i18n'
    import { checkActiveProfileAuth } from '@core/profile'
    import { getTrimmedLength } from '@core/utils'
    import { closePopup, updatePopupProps } from '@auxiliary/popup'

    export let accountAlias = ''
    export let error: string
    export let color = getRandomAccountColor()
    export let isBusy = false
    export let _onMount: (..._: any[]) => Promise<void> = async () => {}

    $: accountAlias, (error = null)
    $: trimmedAccountAlias = accountAlias.trim()

    async function onCreateClick(): Promise<void> {
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
            error = err.error
            handleError(err)
            isBusy = false
        }
    }

    function onCancelClick(): void {
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
            error = err.error
            handleError(err)
        }
        isBusy = false
    })
</script>

<create-account-popup class="flex flex-col h-full justify-between">
    <div>
        <title-container class="flex flex-row mb-6">
            <Text type={TextType.h5}>{localize('general.addAWallet')}</Text>
        </title-container>
        <create-account-popup-inputs class="w-full flex flex-col justify-between">
            <Input
                {error}
                bind:value={accountAlias}
                placeholder={localize('general.accountName')}
                autofocus
                submitHandler={onCreateClick}
                disabled={isBusy}
                classes="mb-4"
            />
            <ColorPicker
                title={localize('general.accountColor')}
                bind:active={color}
                classes="mb-4"
                isCustomColorEnabled
            />
        </create-account-popup-inputs>
    </div>
    <create-account-popup-actions class="flex flex-row justify-between px-2">
        <Button outline classes="-mx-2 w-1/2" onClick={onCancelClick} disabled={isBusy}>
            {localize('actions.cancel')}
        </Button>
        <Button
            disabled={!getTrimmedLength(accountAlias) || isBusy}
            classes="-mx-2 w-1/2"
            onClick={onCreateClick}
            {isBusy}
            busyMessage={localize('general.creating')}
        >
            {localize('actions.create')}
        </Button>
    </create-account-popup-actions>
</create-account-popup>
