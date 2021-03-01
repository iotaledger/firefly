<script>
    import { api } from 'shared/lib/wallet'
    import { closePopup } from 'shared/lib/popup'
    import { Password, Button, Text } from 'shared/components'

    export let locale

    export let onSuccess
    export let onError

    let password
    let error = ''

    function handleSubmit() {
        api.setStrongholdPassword(password, {
            onSuccess(response) {
                closePopup()
                if ('function' === typeof onSuccess) {
                    onSuccess(response)
                }
            },
            onError(err) {
                // TODO: Add proper error handling
                if (err.payload.error.includes('try another password')){
                        error = locale('error.password.incorrect')
                    }
                if ('function' === typeof onError) {
                    onError(err)
                }
            },
        })
    }
    function handleCancelClick() {
        closePopup()
    }
</script>

<div class="mb-5">
    <Text type="h4">{locale('popups.password.title')}</Text>
    <Text type="p" secondary>{locale('popups.password.subtitle')}</Text>
</div>
<form id="password-popup-form" class="flex justify-center w-full flex-row flex-wrap" on:submit={handleSubmit}>
    <Password {error} classes="w-full mb-5" bind:value={password} showRevealToggle {locale} placeholder={locale('general.password')} />
    <div class="flex flex-row justify-between w-full space-x-4 px-8">
        <Button secondary classes="w-1/2" onClick={handleCancelClick}>{locale('actions.cancel')}</Button>
        <Button classes="w-1/2" type="submit" form="password-popup-form">{locale('actions.unlock')}</Button>
    </div>
</form>
