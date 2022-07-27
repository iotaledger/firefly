<script lang="typescript">
    import { Toast } from 'shared/components'
    import { mobile } from '@core/app'
    import { displayNotifications } from 'shared/lib/notifications'
    import { fade } from 'svelte/transition'
    import Alert from './Alert.svelte'

    let toasts
    $: toasts = $displayNotifications.map((notification) => ({
        ...notification,
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
                {#if toast?.alert}
                    <Alert {...toast} />
                {:else}
                    <Toast {...toast} />
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
