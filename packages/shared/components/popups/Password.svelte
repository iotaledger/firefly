<script>
    import { Password, Button } from 'shared/components'
    export let locale
    export let active

    let password

    function handleSendClick() {
        // DO LOGIC
        active = false
    }
    function handleCancelClick() {
        active = false
    }
</script>

<div class="flex justify-center w-full flex-row flex-wrap">
    <Password classes="w-full mb-8" bind:value={password} showRevealToggle {locale} placeholder={locale('general.password')} />
    <div class="flex flex-row justify-between px-2 w-full">
        <Button secondary classes="-mx-2 w-1/2" onClick={() => handleCancelClick()}>{locale('actions.cancel')}</Button>
        <Button classes="-mx-2 w-1/2" onClick={() => handleSendClick()}>{locale('actions.send')}</Button>
    </div>
</div>
