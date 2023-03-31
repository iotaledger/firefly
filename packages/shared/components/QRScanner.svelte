<script lang="typescript">
    import { Icon, Text } from 'shared/components'
    import { Locale } from '@core/i18n'
    import { backButtonStore } from '@core/router'
    import { showCameraScanner, stopQRScanner } from 'shared/lib/device'

    export let locale: Locale

    function onCloseButton() {
        $backButtonStore?.pop()
        stopQRScanner()
    }
</script>

{#if $showCameraScanner}
    <div class="fixed top-0 left-0 w-screen h-screen z-50 flex flex-col items-center justify-center">
        <div class="absolute top-0 bottom-0 left-0 right-0 bg-gray-300 bg-opacity-20" />
        <div class="barcode-scanner--area--container">
            <div class="square surround-cover">
                <div class="barcode-scanner--area--outer surround-cover">
                    <div class="barcode-scanner--area--inner" />
                </div>
            </div>
        </div>
        <button
            on:click={onCloseButton}
            class="flex justify-center items-center close absolute top-6 right-8 text-white bg-white rounded-full w-10 h-10"
            style="--tw-bg-opacity: 0.2"
        >
            <Icon icon="close" />
        </button>
        <Text classes="relative top-8 text-white" type="h5">{locale('general.scanQr')}</Text>
    </div>
{/if}

<style global type="text/scss">
    .barcode-scanner--area--container {
        @apply w-52;
    }
    .square {
        @apply w-full;
        @apply relative;
        @apply overflow-hidden;
        @apply rounded-xl;
        &:after {
            content: '';
            padding-bottom: 100%;
            @apply block;
            @apply top-0;
            @apply border-2;
            @apply border-gray-700;
            @apply border-opacity-60;
        }
    }
    .barcode-scanner--area--outer {
        @apply absolute;
        @apply top-0;
        @apply left-0;
        @apply bottom-0;
        @apply right-0;
    }
    .surround-cover {
        box-shadow: 0 0 0 99999px rgba(64, 89, 133, 0.6);
    }
    .barcode-scanner--area--outer,
    .barcode-scanner--area--inner {
        &:after,
        &:before {
            content: '';
            @apply block;
            @apply absolute;
            @apply w-14;
            @apply h-14;
            @apply border-solid;
            @apply border-transparent;
            border-width: 3px;
        }
    }
    .barcode-scanner--area--outer,
    .barcode-scanner--area--inner {
        &:before {
            @apply left-0;
            @apply border-l-white;
            @apply rounded-l-xl;
        }
        &:after {
            @apply right-0;
            @apply border-r-white;
            @apply rounded-r-xl;
        }
    }
    .barcode-scanner--area--outer {
        &:after,
        &:before {
            @apply top-0;
            @apply border-t-white;
            @apply rounded-b-none;
        }
    }
    .barcode-scanner--area--inner {
        &:after,
        &:before {
            @apply bottom-0;
            @apply border-b-white;
            @apply rounded-t-none;
        }
    }

    .close {
        margin-top: calc(env(safe-area-inset-top) / 2 + 5px);
    }
</style>
