<script lang="ts">
    import { fade } from 'svelte/transition'

    import { Alert, Swiper, Toast } from './'

    import { notifications } from '@auxiliary/notification/stores'

    export let classes: string = ''
    export let swipe: boolean = false
    export let fadeDuration: number = 0

    $: toasts = $notifications.map((notification) => ({
        type: notification.type,
        alert: notification.alert,
        message: notification.message,
        subMessage: notification.subMessage,
        progress: notification.progress,
        id: notification.id,
        actions: notification.actions.map((action, actionIndex) => ({
            ...action,
            onClick: () => action.callback(notification, actionIndex),
        })),
    }))
</script>

{#if toasts?.length > 0}
    <toast-container class={`flex flex-col z-20 ${classes}`} transition:fade|local={{ duration: fadeDuration }}>
        <ul class="space-y-2">
            {#each toasts as toast (toast.id)}
                <li transition:fade|local={{ duration: fadeDuration }}>
                    {#if swipe}
                        <Swiper toastId={toast.id}>
                            {#if toast.alert}
                                <Alert type={toast.type} message={toast.message} id={toast.id} showDismiss />
                            {:else}
                                <Toast
                                    type={toast.type}
                                    message={toast.message}
                                    subMessage={toast.subMessage}
                                    progress={toast.progress}
                                    actions={toast.actions}
                                    id={toast.id}
                                    showDismiss
                                />
                            {/if}
                        </Swiper>
                    {:else if toast.alert}
                        <Alert type={toast.type} message={toast.message} id={toast.id} showDismiss />
                    {:else}
                        <Toast
                            type={toast.type}
                            message={toast.message}
                            subMessage={toast.subMessage}
                            progress={toast.progress}
                            actions={toast.actions}
                            id={toast.id}
                            showDismiss
                        />
                    {/if}
                </li>
            {/each}
        </ul>
    </toast-container>
{/if}
