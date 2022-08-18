<script lang="typescript">
    import { Animation, Text } from 'shared/components'
    import { openPopup } from 'shared/lib/popup'
    import { onDestroy } from 'svelte'

    export let sendConfirmationPopupProps = null

    onDestroy(() => {
        openPopup({
            type: 'sendConfirmation',
            props: sendConfirmationPopupProps,
        })
    })
</script>

<Text type="h4" classes="mb-6">Enable Blind Signing</Text>

<div class="w-full h-full space-y-6 flex flex-auto flex-col flex-shrink-0">
    <Animation
        width="100%"
        animation="ledger-bg-desktop"
        classes="absolute transform left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
    />
    <Animation animation="ledger-confirm-address-desktop" />
</div>
<div class="flex flex-col space-y-2" />
