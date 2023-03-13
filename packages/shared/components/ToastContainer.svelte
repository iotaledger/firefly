<script lang="ts">
    import { fade } from 'svelte/transition'

    import { Swiper, Toast } from './'

    import { notifications } from '@auxiliary/notification/stores'

    export let classes: string = ''
    export let swipe: boolean = false
    export let fadeDuration: number = 0
    export let showDismiss = false
</script>

{#if $notifications?.length > 0}
    <toast-container class={`flex flex-col z-20 ${classes}`} transition:fade|local={{ duration: fadeDuration }}>
        <ul class="space-y-2">
            {#each $notifications as toast (toast.id)}
                <li transition:fade|local={{ duration: fadeDuration }}>
                    {#if swipe}
                        <Swiper toastId={toast.id}>
                            <Toast {toast} {showDismiss} />
                        </Swiper>
                    {:else}
                        <Toast {toast} {showDismiss} />
                    {/if}
                </li>
            {/each}
        </ul>
    </toast-container>
{/if}
