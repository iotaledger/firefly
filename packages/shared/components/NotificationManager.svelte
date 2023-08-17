<script lang="ts">
    import { fade } from 'svelte/transition'
    import { notifications } from '@auxiliary/notification/stores'
    import { Toast } from '.'

    export let showDismiss = false
</script>

{#if $notifications?.length > 0}
    <ul
        id="notification-manager"
        class="absolute right-5 bottom-5 w-100 z-20 grid grid-cols-1 gap-2 list-none pointer-events-none"
    >
        {#each $notifications as toast (toast.id)}
            <li transition:fade|local>
                <Toast {toast} {showDismiss} />
            </li>
        {/each}
    </ul>
{/if}
