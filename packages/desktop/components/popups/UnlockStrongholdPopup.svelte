<script lang="ts">
    import { Button, PasswordInput, Text, HTMLButtonType } from 'shared/components'
    import { closePopup } from '@auxiliary/popup'
    import { localize } from '@core/i18n'
    import { unlockStronghold } from '@core/profile'

    export let subtitle: string = ''
    export let returnPassword = false

    export let onSuccess: (..._: any[]) => void = () => {}
    export let onCancelled: (..._: any[]) => void = () => {}

    let password: string
    let error = ''
    let isBusy = false

    async function onSubmit(): Promise<void> {
        try {
            isBusy = true
            const response = await unlockStronghold(password)
            closePopup()
            onSuccess(returnPassword ? password : response)
        } catch (err) {
            console.error(err)
            error = localize(err?.message ?? err)
        } finally {
            isBusy = false
        }
    }

    function onCancelClick(): void {
        closePopup()
        if ('function' === typeof onCancelled) {
            onCancelled()
        }
    }
</script>

<div class="mb-5">
    <Text type="h4">{localize('popups.password.title')}</Text>
    <Text type="p" secondary>{subtitle ?? localize('popups.password.subtitle')}</Text>
</div>
<form
    id="password-popup-form"
    class="flex justify-center w-full flex-row flex-wrap"
    on:submit|preventDefault={onSubmit}
>
    <PasswordInput
        bind:error
        bind:value={password}
        classes="w-full mb-5"
        showRevealToggle
        placeholder={localize('general.password')}
        autofocus
    />
    <div class="flex flex-row justify-between w-full space-x-4">
        <Button outline classes="w-1/2" onClick={onCancelClick} disabled={isBusy}>
            {localize('actions.cancel')}
        </Button>
        <Button
            disabled={!password || password.length === 0 || isBusy}
            type={HTMLButtonType.Submit}
            classes="w-1/2"
            {isBusy}
        >
            {localize('actions.unlock')}
        </Button>
    </div>
</form>
