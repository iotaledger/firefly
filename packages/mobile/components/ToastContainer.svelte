<script lang="ts">
    import { Alert, Toast } from 'shared/components'
    import { notifications, removeDisplayNotification } from '@auxiliary/notification/stores'
    import { fade } from 'svelte/transition'
    import { Swiper } from '../components'

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
    <toast-container class="fixed top-0 flex flex-col z-10 w-full p-5" transition:fade|local={{ duration: 100 }}>
        <ul class="space-y-2">
            {#each toasts as toast (toast.id)}
                <li transition:fade|local={{ duration: 100 }}>
                    <Swiper on:close={() => removeDisplayNotification(toast.id)}>
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
                </li>
            {/each}
        </ul>
    </toast-container>
{/if}
