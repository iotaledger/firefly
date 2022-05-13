<script lang="typescript">
    import { Button, Password, Text } from 'shared/components'
    import { closePopup } from 'shared/lib/popup'
    import { setStrongholdPassword } from '@core/profile-manager'
    import { Locale } from '@core/i18n'

    export let locale: Locale

    export let subtitle: string
    export let returnPassword = false

    export let onSuccess = (..._: any[]): void => {}
    export let onError = (..._: any[]): void => {}
    export let onCancelled = (..._: any[]): void => {}

    let password: string
    let error = ''

    async function handleSubmit(): Promise<void> {
        try {
            const response = await setStrongholdPassword(password)
            closePopup()
            onSuccess(returnPassword ? password : response)
        } catch (err) {
            error = locale(err.error)
            onError(err)
        }
    }

    function handleCancelClick(): void {
        if ('function' === typeof onCancelled) {
            onCancelled()
        }
        closePopup()
    }
</script>

<div class="mb-5">
    <Text type="h4">{locale('popups.password.title')}</Text>
    <Text type="p" secondary>{subtitle ?? locale('popups.password.subtitle')}</Text>
</div>
<form
    id="password-popup-form"
    class="flex justify-center w-full flex-row flex-wrap"
    on:submit|preventDefault={handleSubmit}
>
    <Password
        {error}
        classes="w-full mb-5"
        bind:value={password}
        showRevealToggle
        {locale}
        placeholder={locale('general.password')}
        autofocus
    />
    <div class="flex flex-row justify-between w-full space-x-4 md:px-8">
        <Button secondary classes="w-1/2" onClick={handleCancelClick}>{locale('actions.cancel')}</Button>
        <Button classes="w-1/2" type="submit" form="password-popup-form" disabled={!password || password.length === 0}>
            {locale('actions.unlock')}
        </Button>
    </div>
</form>
