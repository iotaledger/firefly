<script lang="ts">
    import { Alert, Icon } from 'shared/components'

    import { localize } from '@core/i18n'

    import { removeDisplayNotification } from '@auxiliary/notification/stores'

    import Logo from './Logo.svelte'
    import { INotificationData } from '@auxiliary/notification'

    export let toast: INotificationData
    export let classes: string = ''
    export let showDismiss: boolean = false

    const TOAST_STYLE = {
        info: {
            backgroundColor: 'blue-500',
            iconBackgroundColor: 'white',
            logo: 'logo-firefly',
            messageColor: 'white',
            subMessageColor: 'blue-300',
            buttonSecondary: 'white',
        },
        warning: {
            backgroundColor: 'yellow-100',
            iconBackgroundColor: 'yellow-500',
            icon: 'info',
            iconColor: 'white',
            messageColor: 'gray-800',
            subMessageColor: 'gray-600',
            buttonSecondary: 'black',
        },
        error: {
            backgroundColor: 'red-50',
            iconBackgroundColor: 'red-500',
            icon: 'warning',
            iconColor: 'white',
            messageColor: 'red-500',
            subMessageColor: 'gray-600',
            buttonSecondary: 'black',
        },
    }

    function onDismissClick(): void {
        removeDisplayNotification(toast.id)
    }
</script>

{#if alert}
    <Alert type={toast.type} message={toast.message} id={toast.id} {showDismiss} />
{:else}
    <div class="{classes} flex flex-row items-center bg-{TOAST_STYLE[toast.type].backgroundColor} rounded-lg px-6 py-4">
        <div
            style={'width:40px;height:40px'}
            class="flex flex-shrink-0 justify-center items-center bg-{TOAST_STYLE[toast.type]
                .iconBackgroundColor} rounded-lg text-{TOAST_STYLE[toast.type].iconColor}"
        >
            {#if TOAST_STYLE[toast.type].logo}
                <Logo logo={TOAST_STYLE[toast.type].logo} overrideStage="prod" />
            {:else}
                <Icon icon={TOAST_STYLE[toast.type].icon} />
            {/if}
        </div>
        <div class="flex flex-auto flex-col px-4">
            <span class="flex text-12 text-{TOAST_STYLE[type].messageColor}">{toast.message}</span>
            {#if toast.progress !== undefined}
                <span class="block bg-{TOAST_STYLE[type].subMessageColor}" style={'width:100%;height:2px;margin:4px 0'}>
                    <span
                        class="block bg-{TOAST_STYLE[type].messageColor}"
                        style={`width:${toast.progress}%;height:2px`}
                    />
                </span>
            {/if}
            {#if toast.subMessage}<span class="flex text-11 text-{TOAST_STYLE[type].subMessageColor}"
                    >{toast.subMessage}</span
                >{/if}
        </div>
        {#if toast.actions.length > 0}
            <div class="flex flex-col" style="min-width:90px">
                {#each toast.actions as action, actionIndex}
                    <button
                        class="cursor-pointer text-center rounded-lg font-bold text-11 {action.isPrimary
                            ? 'bg-white'
                            : ''} text-{action.isPrimary ? 'black' : TOAST_STYLE[toast.type].buttonSecondary}"
                        style={'min-width:90px;min-height:32px'}
                        on:click={() => action.callback(toast, actionIndex)}
                    >
                        {action.label}
                    </button>
                {/each}
            </div>
        {:else if showDismiss}
            <button
                type="button"
                on:click={onDismissClick}
                class="dismiss-min-wh cursor-pointer text-center rounded-lg
                font-bold text-11 text-{TOAST_STYLE[toast.type].messageColor}"
            >
                {localize('actions.dismiss')}
            </button>
        {/if}
    </div>
{/if}

<style lang="scss">
    .dismiss-min-wh {
        min-width: 90px;
        min-height: 32px;
    }
</style>
