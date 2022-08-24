<script lang="typescript">
    import { Button, Password, Text } from 'shared/components'
    import { keyboardHeight, isKeyboardOpened, mobile, getKeyboardTransitionSpeed } from 'shared/lib/app'
    import { closePopup } from 'shared/lib/popup'
    import { api } from 'shared/lib/wallet'
    import { Locale } from '@core/i18n'

    export let locale: Locale

    export let subtitle
    export let returnPassword = false

    export let onSuccess = (..._: any[]): void => {}
    export let onError = (..._: any[]): void => {}
    export let onCancelled = (..._: any[]): void => {}

    let password = ''
    let error = ''

    function handleSubmit() {
        api.setStrongholdPassword(password, {
            onSuccess(response) {
                closePopup()
                if ('function' === typeof onSuccess) {
                    onSuccess(returnPassword ? password : response)
                }
            },
            onError(err) {
                error = locale(err.error)
                if ('function' === typeof onError) {
                    onError(err)
                }
            },
        })
    }
    function handleCancelClick() {
        if ('function' === typeof onCancelled) {
            onCancelled()
        }
        closePopup()
    }
</script>

<div class="mb-5">
    <Text type="h4" classes={$mobile && 'flex w-full justify-center -mt-4 mb-6'}>
        {locale('popups.password.title')}
    </Text>
    <Text type="p" secondary classes={$mobile && 'flex w-full justify-center -mt-4 mb-6'}>
        {subtitle ?? locale('popups.password.subtitle')}
    </Text>
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
    <div
        class="flex flex-row justify-between w-full space-x-4 md:px-8 {$mobile && $isKeyboardOpened && '-mb-6'}"
        style="padding-bottom: {$mobile && $isKeyboardOpened
            ? $keyboardHeight
            : 0}px; transition: padding-bottom {getKeyboardTransitionSpeed($isKeyboardOpened)} (--transition-scroll)"
    >
        <Button secondary classes="w-1/2" onClick={handleCancelClick}>{locale('actions.cancel')}</Button>
        <Button classes="w-1/2" type="submit" form="password-popup-form" disabled={!password || password.length === 0}>
            {locale('actions.unlock')}
        </Button>
    </div>
</form>
