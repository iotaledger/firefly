<script lang="typescript">
    import { Icon } from '@components'
    import { showCameraScanner, stopScanner } from '../lib/auxiliary/scanner'
</script>

{#if $showCameraScanner}
    <div class="fixed top-0 left-0 w-screen h-screen z-50 flex items-center justify-center">
        <div class="absolute top-0 bottom-0 left-0 right-0 bg-gray-300 bg-opacity-20" />
        <div class="barcode-scanner--area--container">
            <div class="square surround-cover">
                <div class="barcode-scanner--area--outer surround-cover">
                    <div class="barcode-scanner--area--inner" />
                </div>
            </div>
        </div>
        <button on:click={stopScanner} class="absolute top-6 right-8 text-white">
            <Icon icon="close" />
        </button>
    </div>
{/if}

<style global type="text/scss">
    .barcode-scanner--area--container {
        @apply w-2/3;
    }
    .square {
        @apply w-full;
        @apply relative;
        @apply overflow-hidden;
        &:after {
            content: '';
            padding-bottom: 100%;
            @apply block;
            @apply top-0;
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
        box-shadow: 0 0 0 99999px rgba(0, 0, 0, 0.5);
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
            @apply border-2;
            @apply border-transparent;
        }
    }
    .barcode-scanner--area--outer,
    .barcode-scanner--area--inner {
        &:before {
            @apply left-0;
            @apply border-l-blue-500;
        }
        &:after {
            @apply right-0;
            @apply border-r-blue-500;
        }
    }
    .barcode-scanner--area--outer {
        &:after,
        &:before {
            @apply top-0;
            @apply border-t-blue-500;
        }
    }
    .barcode-scanner--area--inner {
        &:after,
        &:before {
            @apply bottom-0;
            @apply border-b-blue-500;
        }
    }
</style>
