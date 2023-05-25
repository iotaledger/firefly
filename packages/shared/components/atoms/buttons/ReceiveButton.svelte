<script lang="ts">
    import { localize } from '@core/i18n'
    import { openOverlay, PopupId } from '@overlay'

    export let text: string = localize('actions.receive')
    export let title: string = localize('general.receiveFunds')

    function onClick(): void {
        openOverlay({
            id: PopupId.ReceiveAddress,
            props: {
                title,
            },
        })
    }
</script>

<button class="action py-3 px-8 text-center rounded-lg font-medium text-14 bg-blue-500 text-white" on:click={onClick}>
    {text}
</button>
