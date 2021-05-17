<script>
    import { Text, Button } from 'shared/components'
    import { closePopup } from 'shared/lib/popup'

    export let message
    export let handleClose
    export let locale

    function handleCancelClick() {
        if ('function' === typeof handleClose) {
            handleClose()
        } else {
            closePopup()
        }
    }
</script>

<div class="p-8 flex flex-col w-full items-center justify-center text-center">
    <div class="w-12 h-12 bg-orange-300 rounded-lg mb-6" />
    <Text type="p" classes="mb-6 px-16">{message}</Text>
    <Button secondary classes="w-1/2" onClick={handleCancelClick}>{locale('actions.cancel')}</Button>
</div>
