<script>
    import { getContext } from 'svelte'
    import { api } from 'shared/lib/wallet'
    import { Password, Button, Text } from 'shared/components'

    export let locale

    export let onSuccess
    export let onError

    const popupState = getContext('popupState')

    let password

    function handleSubmit() {
        api.setStrongholdPassword(password, {
            onSuccess(response) {
                // Close popup
                popupState.set({ active: false })
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
        popupState.set({ active: false })
    }
</script>

<div class="mb-5">
    <Text type="h4">{locale('popups.password.title')}</Text>
    <Text type="p" secondary>{locale('popups.password.subtitle')}</Text>
</div>
<div class="flex justify-center w-full flex-row flex-wrap">
    <Password classes="w-full mb-8" bind:value={password} showRevealToggle {locale} placeholder={locale('general.password')} />
    <div class="flex flex-row justify-between w-full space-x-4 px-8">
        <Button secondary classes="w-1/2" onClick={() => handleCancelClick()}>{locale('actions.cancel')}</Button>
        <Button classes="w-1/2" onClick={() => handleSubmit()}>{locale('actions.unlock')}</Button>
    </div>
</div>
