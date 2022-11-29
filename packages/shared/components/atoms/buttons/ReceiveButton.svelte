<script lang="typescript">
    import { localize } from '@core/i18n'
    import { openPopup } from '@auxiliary/popup'

    export let text: string = localize('actions.receive')

    function handleReceiveClick(): void {
        openPopup({
            type: 'receiveAddress',
        })
    }
</script>

<button
    class="action py-3 px-8 text-center rounded-lg font-medium text-14 bg-blue-500 text-white"
    on:click={handleReceiveClick}
>
    {text}
</button>
