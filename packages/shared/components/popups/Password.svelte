<script>
    import { api } from 'shared/lib/wallet'
    import { closePopup } from 'shared/lib/popup'
    import { Password, Button, Text } from 'shared/components'

    export let locale

    export let onSuccess
    export let onError

    let password

    function handleSubmit() {
        api.setStrongholdPassword(password, {
            onSuccess(response) {
                // Close popup
                closePopup()
                if ('function' === typeof onSuccess) {
                    onSuccess(response)
                }
            },
            onError(error) {
                if ('function' === typeof onError) {
                    onError(error)
                } else {
                    console.error(error)
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
    <Password classes="w-full mb-8" bind:value={password} showRevealToggle {locale} placeholder={locale('general.password')} />
    <div class="flex flex-row justify-between w-full space-x-4 px-8">
        <Button secondary classes="w-1/2" onClick={handleCancelClick}>{locale('actions.cancel')}</Button>
        <Button classes="w-1/2" type="submit" form="password-popup-form">{locale('actions.unlock')}</Button>
    </div>
</form>
