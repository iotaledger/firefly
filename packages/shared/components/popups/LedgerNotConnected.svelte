<script>
    import { getContext } from 'svelte'
    import { Text, Button } from 'shared/components'
    import { closePopup } from 'shared/lib/popup'
    export let locale
    export let message

    const popupState = getContext('popupState')

    function handleCancelClick() {
        closePopup()
    }
</script>

<style type="text/scss">
    .rectangle {
        width: 48px;
        height: 48px;
        background: #DC8989;
        border-radius: 16px;
    }

    .message-container {
        width: 220px;
    }

    .action-container {
        width: 220px;
    }
</style>

<div class="flex flex-col items-center">
    <div class="rectangle mt-5"></div>
    <div class="message-container">
        <Text type="h4" classes="mb-5 mt-5 text-center">{message}</Text>
    </div>
    <div class="flex flex-row justify-between px-2 w-full action-container">
        <Button secondary classes="w-full" onClick={handleCancelClick}>{locale('actions.cancel')}</Button>
    </div>
</div>