<script lang="ts">
    import { fade } from 'svelte/transition'
    import { notifications } from '@auxiliary/notification/stores'
    import { Toast } from '.'

    export let showDismiss = false
</script>

{#if $notifications?.length > 0}
    <ul id="notification-manager">
        {#each $notifications as toast (toast.id)}
            <li transition:fade|local>
                <Toast {toast} {showDismiss} />
            </li>
        {/each}
    </ul>
{/if}

<style lang="scss">
    #notification-manager {
        @apply absolute;
        @apply right-5 bottom-5;
        @apply w-100;
        @apply z-20;
        @apply grid grid-cols-1;
        @apply gap-2;
        @apply list-none;
        @apply pointer-events-none;

        li {
            @apply pointer-events-auto;
        }
    }
</style>
