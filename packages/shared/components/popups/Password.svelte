<script lang="typescript">
    import { Button, Password, Text } from 'shared/components'
    import { closePopup } from 'shared/lib/popup'
    import { api } from 'shared/lib/wallet'

    export let locale

    export let onSuccess
    export let onSubmit
    export let onError
    export let onCancelled
    export let subtitle
    
    let password
    let error = ''

    function handleSubmit() {
        if (onSubmit) {
            return onSubmit(password)
        }
        api.setStrongholdPassword(password, {
            onSuccess(response) {
                closePopup()
                if ('function' === typeof onSuccess) {
                    onSuccess(response)
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
    <Text type="h4">{locale('popups.password.title')}</Text>
    <Text type="p" secondary>{subtitle ?? locale('popups.password.subtitle')}</Text>
</div>
<form id="password-popup-form" class="flex justify-center w-full flex-row flex-wrap" on:submit={handleSubmit}>
    <Password
        {error}
        classes="w-full mb-5"
        bind:value={password}
        showRevealToggle
        {locale}
        placeholder={locale('general.password')}
        autofocus />
    <div class="flex flex-row justify-between w-full space-x-4 px-8">
        <Button secondary classes="w-1/2" onClick={handleCancelClick}>{locale('actions.cancel')}</Button>
        <Button classes="w-1/2" type="submit" form="password-popup-form" disabled={!password || password.length === 0}>
            {locale('actions.unlock')}
        </Button>
    </div>
</form>
