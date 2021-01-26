<script lang="typescript">
    import QR from './QR.svelte'
    import Password from './Password.svelte'
    import { Text, Icon } from 'shared/components'

    export let locale
    export let active
    export let type
    export let title
    export let subtitle
    export let qrData

    export let onSuccess
    export let onError

    const types = {
        qr: QR,
        password: Password,
    }

    const onkey = (e) => {
        if (e.key === 'Escape') {
            active = false
        }
    }
</script>

<style type="text/scss">
    popup {
        &.active {
            @apply opacity-100;
            @apply pointer-events-auto;
        }
        popup-content {
            box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
            width: 100%;
            max-width: 480px;
        }
    }
</style>

<svelte:window on:keydown={onkey} />

<popup
    class:active
    class="flex items-center justify-center fixed top-0 left-0 w-screen p-6
                h-screen overflow-hidden z-10 pointer-events-none opacity-0 
                bg-gray-800 bg-opacity-40 transition-opacity ">
    <popup-content class="bg-white rounded-xl pt-6 px-8 pb-14">
        <div class="w-full mb-10 flex flex-row justify-between items-start">
            <div>
                {#if title}
                    <Text type="h4">{title}</Text>
                {/if}
                {#if subtitle}
                    <Text type="p" secondary>{subtitle}</Text>
                {/if}
            </div>
            <button on:click={() => (active = false)}>
                <Icon icon="close" classes="text-gray-800" />
            </button>
        </div>
        <svelte:component this={types[type]} data={qrData} {locale} bind:active onSuccess={onSuccess} onError={onError} />
    </popup-content>
</popup>
