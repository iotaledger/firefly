<script lang="typescript">
    import { Toast } from 'shared/components'
    import { displayNotifications } from 'shared/lib/notifications'
    import { fade } from 'svelte/transition'

    $: toasts = $displayNotifications.map((notification) => ({
        ...notification,
        actions: notification.actions.map((action, actionIndex) => ({
            ...action,
            onClick: () => action.callback(notification, actionIndex),
        })),
    }))
</script>

<style type="text/scss">
    toast-container {
        position: absolute;
        right: 20px;
        bottom: 20px;
        width: 400px;
    }
</style>

<toast-container class="flex flex-col relative z-20">
    <ul class="space-y-2">
        {#each toasts as toast}
            <li in:fade={{ duration: 100 }} out:fade={{ duration: 100 }}>
                <Toast {...toast} />
            </li>
        {/each}
    </ul>
</toast-container>
