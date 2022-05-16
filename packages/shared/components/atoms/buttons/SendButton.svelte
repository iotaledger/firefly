<script lang="typescript">
    import { localize } from '@core/i18n'
    import { openPopup } from '@lib/popup'

    function handleSendClick() {
        openPopup({
            type: 'sendForm',
            overflow: true,
        })
    }
</script>

<button
    class="action p-3 w-full text-center rounded-lg font-medium text-14 bg-blue-500 text-white"
    on:click={handleSendClick}
>
    {localize('actions.send')}
</button>
