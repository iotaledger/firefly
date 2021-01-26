<script>
    import { api } from 'shared/lib/wallet'
    import { Password, Button } from 'shared/components'
    export let locale
    export let active

    let password

    export let onSuccess
    export let onError

    function handleSubmit() {
        api.setStrongholdPassword(password, {
            onSuccess(response) {
                if ('function' === typeof onSuccess) {
                    onSuccess(response)
                    
                    // Close popup
                    active = false
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
        active = false
    }
</script>

<div class="flex justify-center w-full flex-row flex-wrap">
    <Password classes="w-full mb-8" bind:value={password} showRevealToggle {locale} placeholder={locale('general.password')} />
    <div class="flex flex-row justify-between px-2 w-full">
        <Button secondary classes="-mx-2 w-1/2" onClick={() => handleCancelClick()}>{locale('actions.cancel')}</Button>
        <Button classes="-mx-2 w-1/2" onClick={() => handleSubmit()}>{locale('actions.unlock')}</Button>
    </div>
</div>
