<script lang="typescript">
    import { localize } from '@core/i18n'
    import { Icon, Text } from 'shared/components'
    import Logo from './Logo.svelte'
    import { mobile } from '@lib/app'
    import { removeDisplayNotification } from '@lib/notifications'

    type Action = {
        label: string
        isPrimary?: boolean
        onClick?: () => void
    }

    export let classes: string
    export let type: string
    export let message: string
    export let subMessage: string
    export let progress: number
    export let actions: Action[] = []
    export let id: string

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
        removeDisplayNotification(id)
    }
</script>

<div class="{classes} flex flex-row items-center bg-{TOAST_STYLE[type].backgroundColor} rounded-lg px-6 py-4">
    <div
        style={'width:40px;height:40px'}
        class="flex flex-shrink-0 justify-center items-center bg-{TOAST_STYLE[type]
            .iconBackgroundColor} rounded-lg text-{TOAST_STYLE[type].iconColor}"
    >
        {#if TOAST_STYLE[type].logo}
            <Logo logo={TOAST_STYLE[type].logo} overrideStage="prod" />
        {:else}
            <Icon icon={TOAST_STYLE[type].icon} />
        {/if}
    </div>
    <div class="flex flex-auto flex-col px-4">
        <span class="flex text-12 text-{TOAST_STYLE[type].messageColor}">{message}</span>
        {#if progress !== undefined}
            <span class="block bg-{TOAST_STYLE[type].subMessageColor}" style={'width:100%;height:2px;margin:4px 0'}>
                <span class="block bg-{TOAST_STYLE[type].messageColor}" style={`width:${progress}%;height:2px`} />
            </span>
        {/if}
        {#if subMessage}<span class="flex text-11 text-{TOAST_STYLE[type].subMessageColor}">{subMessage}</span>{/if}
    </div>
    {#if actions.length > 0}
        <div class="flex flex-col" style="min-width:90px">
            {#each actions as action}
                <button
                    class="cursor-pointer text-center rounded-lg font-bold text-11 {action.isPrimary
                        ? 'bg-white'
                        : ''} text-{action.isPrimary ? 'black' : TOAST_STYLE[type].buttonSecondary}"
                    style={'min-width:90px;min-height:32px'}
                    on:click={() => action.onClick()}
                >
                    {action.label}
                </button>
            {/each}
        </div>
    {/if}
    {#if $mobile}
        <button on:click={onDismissClick}>
            <Text type="p" color="white" darkColor="white">{localize('actions.dismiss')}</Text>
        </button>
    {/if}
</div>
