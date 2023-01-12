<script lang="typescript">
    import { Button, PasswordInput, Text, HTMLButtonType, Form } from 'shared/components'
    import { closePopup } from '@auxiliary/popup'
    import { localize } from '@core/i18n'
    import { unlockStronghold } from '@core/profile'

    export let subtitle: string = ''
    export let returnPassword = false

    export let onSuccess: (..._: any[]) => void = () => {}
    export let onCancelled: (..._: any[]) => void = () => {}

    let password: string
    let error = ''

    async function onSubmit(): Promise<void> {
        try {
            const response = await unlockStronghold(password)
            closePopup()
            onSuccess(returnPassword ? password : response)
        } catch (err) {
            console.error(err)
            error = localize(err?.message ?? err)
        }
    }

    function handleCancelClick(): void {
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
<Form
    id="password-popup-form"
    classes="flex justify-center w-full flex-row flex-wrap"
    {onSubmit}
>
    <PasswordInput
        {error}
        classes="w-full mb-5"
        bind:value={password}
        showRevealToggle
        placeholder={localize('general.password')}
        submitHandler={onSubmit}
        autofocus
    />
    <div class="flex flex-row justify-between w-full space-x-4">
        <Button outline classes="w-1/2" onClick={handleCancelClick}>{localize('actions.cancel')}</Button>
        <Button classes="w-1/2" type={HTMLButtonType.Submit} disabled={!password || password.length === 0}>
            {localize('actions.unlock')}
        </Button>
    </div>
</Form>
