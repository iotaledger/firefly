<script lang="typescript">
    import { Icon } from 'shared/components'
    import Logo from './Logo.svelte'

    export let type, progress, message, subMessage, classes

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
</script>

<style type="text/scss">
</style>

<div class="{classes} flex flex-row items-center bg-{TOAST_STYLE[type].backgroundColor} rounded-lg px-6 py-4">
    <div
        style={'width:40px;height:40px'}
        class="flex flex-shrink-0 justify-center items-center bg-{TOAST_STYLE[type].iconBackgroundColor} rounded-lg text-{TOAST_STYLE[type].iconColor}">
        {#if TOAST_STYLE[type].logo}
            <Logo logo={TOAST_STYLE[type].logo} />
        {:else}
            <Icon icon={TOAST_STYLE[type].icon} />
        {/if}
    </div>
    <div class="flex flex-auto flex-col px-4">
        <span class="flex text-12 text-{TOAST_STYLE[type].messageColor}">{message}</span>
        {#if progress !== undefined}
            <span class="block bg-{TOAST_STYLE[type].subMessageColor}" style={`width:100%;height:2px;margin:4px 0`}>
                <span class="block bg-{TOAST_STYLE[type].messageColor}" style={`width:${progress}%;height:2px`} />
            </span>
        {/if}
        {#if subMessage}<span class="flex text-11 text-{TOAST_STYLE[type].subMessageColor}">{subMessage}</span>{/if}
    </div>
</div>
