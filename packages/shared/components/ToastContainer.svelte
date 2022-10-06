<script lang="typescript">
    import { Toast } from 'shared/components'
    import { mobile } from '@core/app'
    import { displayNotifications } from 'shared/lib/notifications'
    import { fade } from 'svelte/transition'
    import Alert from './Alert.svelte'

    $: toasts = $displayNotifications.map((notification) => ({
        type: notification.type,
        alert: notification.alert,
        message: notification.message,
        subMessage: notification.subMessage,
        progress: notification.progress,
        actions: notification.actions.map((action, actionIndex) => ({
            ...action,
            onClick: () => action.callback(notification, actionIndex),
        })),
    }))
</script>

<toast-container class="flex flex-col relative z-20 {$mobile ? 'mobile-container' : 'desktop-container'}">
    <ul class="space-y-2">
        {#each toasts as toast}
            <li in:fade={{ duration: 100 }} out:fade={{ duration: 100 }}>
                {#if toast.alert}
                    <Alert type={toast.type} message={toast.message} />
                {:else}
                    <Toast
                        type={toast.type}
                        message={toast.message}
                        subMessage={toast.subMessage}
                        progress={toast.progress}
                        actions={toast.actions}
                    />
                {/if}
            </li>
        {/each}
    </ul>
</toast-container>

<style type="text/scss">
    .mobile-container {
        position: absolute;
        top: calc(env(safe-area-inset-top) * 1.2);
        left: 20px;
        right: 20px;
    }

    .desktop-container {
        position: absolute;
        right: 20px;
        bottom: 20px;
        width: 400px;
    }
</style>
