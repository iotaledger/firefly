<script lang="typescript">
    import { displayNotifications } from 'shared/lib/notifications'
    import { Icon } from 'shared/components'
    import { fade } from 'svelte/transition'
    import Logo from './Logo.svelte'

    const TOAST_STYLE = {
        info: {
            backgroundColor: 'blue-500',
            iconBackgroundColor: 'white',
            logo: 'logo-firefly',
            messageColor: 'white',
            subMessageColor: 'blue-300',
            buttonSecondary: 'white'
        },
        warning: {
            backgroundColor: 'yellow-100',
            iconBackgroundColor: 'yellow-500',
            icon: 'info',
            iconColor: 'white',
            messageColor: 'gray-800',
            subMessageColor: 'gray-600',
            buttonSecondary: 'black'
        },
        error: {
            backgroundColor: 'red-100',
            iconBackgroundColor: 'red-500',
            icon: 'warning',
            iconColor: 'white',
            messageColor: 'gray-800',
            subMessageColor: 'gray-600',
            buttonSecondary: 'black'
        },
    }
</script>

<style type="text/scss">
    toast-container {
        position: absolute;
        right: 20px;
        bottom: 20px;
        width: 400px;

        li {
            min-height: 100px;
            box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
        }

        li + li {
            margin-top: 10px;
        }

        button + button {
            margin-top: 8px;
        }
    }
</style>

<toast-container class="flex flex-col">
    <ul>
        {#each $displayNotifications as notification}
            <li
                in:fade={{ duration: 100 }}
                out:fade={{ duration: 100 }}
                class="flex flex-row items-center bg-{TOAST_STYLE[notification.type].backgroundColor} rounded-lg overflow-hidden z-10 px-6 py-3">
                <div
                    style={"width:40px;height:40px"}
                    class="flex flex-shrink-0 justify-center items-center bg-{TOAST_STYLE[notification.type].iconBackgroundColor} rounded-lg text-{TOAST_STYLE[notification.type].iconColor}">
                    {#if TOAST_STYLE[notification.type].logo}
                        <Logo logo={TOAST_STYLE[notification.type].logo} />
                    {:else}
                        <Icon icon={TOAST_STYLE[notification.type].icon} />
                    {/if}
                </div>
                <div class="flex flex-auto flex-col px-4">
                    <span class="flex text-12 text-{TOAST_STYLE[notification.type].messageColor}">{notification.message}</span>
                    {#if notification.progress !== undefined}
                        <span class="block bg-{TOAST_STYLE[notification.type].subMessageColor}" style={`width:100%;height:2px;margin:4px 0`}>
                            <span class="block bg-{TOAST_STYLE[notification.type].messageColor}" style={`width:${notification.progress}%;height:2px`} />
                        </span>
                    {/if}
                    {#if notification.subMessage}
                        <span
                            class="flex text-11 text-{TOAST_STYLE[notification.type].subMessageColor}">{notification.subMessage}</span>
                    {/if}
                </div>
                {#if notification.actions}
                    <div class="flex flex-col" style="min-width:90px">
                        {#each notification.actions as action, actionIndex}
                            <button
                                class="cursor-pointer text-center rounded-lg font-bold text-11 {action.isPrimary ? "bg-white" : ""} text-{action.isPrimary ? "black" : TOAST_STYLE[notification.type].buttonSecondary}"
                                style={`min-width:90px;min-height:32px`}
                                on:click={() => action.callback(notification, actionIndex)}>
                                {action.label}
                            </button>
                        {/each}
                    </div>
                {/if}
            </li>
        {/each}
    </ul>
</toast-container>
