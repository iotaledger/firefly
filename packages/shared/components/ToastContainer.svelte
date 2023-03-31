<script lang="typescript">
    import { fade } from 'svelte/transition'
    import { Toast, Swiper } from 'shared/components'
    import { mobile } from '@lib/app'
    import { displayNotifications, removeDisplayNotification } from '@lib/notifications'
    import { NotificationData } from '@lib/typings/notification'

    let toasts: NotificationData[]
    $: toasts = $displayNotifications.map((notification) => ({
        ...notification,
        actions: notification.actions.map((action, actionIndex) => ({
            ...action,
            onClick: () => action.callback(notification, actionIndex),
        })),
    }))
</script>

{#if $mobile}
    <toast-container class="flex flex-col relative z-60 mobile-container">
        <ul class="space-y-2">
            {#each toasts as toast (toast.id)}
                <li>
                    <Swiper on:close={() => removeDisplayNotification(toast.id)}>
                        <Toast {...toast} />
                    </Swiper>
                </li>
            {/each}
        </ul>
    </toast-container>
{:else}
    <toast-container class="flex flex-col relative z-60 desktop-container">
        <ul class="space-y-2">
            {#each toasts as toast}
                <li transition:fade={{ duration: 100 }}>
                    <Toast {...toast} />
                </li>
            {/each}
        </ul>
    </toast-container>
{/if}

<style type="text/scss">
    .mobile-container {
        z-index: 100;
        position: fixed;
        top: calc(env(safe-area-inset-top) + 20px);
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
