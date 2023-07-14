<script lang="ts">
    import { Icon, Text, FontWeight } from 'shared/components'
    import { localize } from '@core/i18n'
    import { removeDisplayNotification } from '@auxiliary/notification/stores'
    import { Icon as IconEnum } from '@ui'

    export let type: string
    export let message: string
    export let showDismiss: boolean = false
    export let id: string = ''

    const TOAST_STYLE: Record<string, Record<string, string | IconEnum>> = {
        info: {
            backgroundColor: 'bg-blue-100',
            iconColor: 'text-blue-700',
            icon: IconEnum.InfoFilled,
            messageColor: 'text-blue-700',
        },
        success: {
            backgroundColor: 'bg-green-100',
            iconColor: 'text-green-800',
            icon: IconEnum.CheckmarkFilled,
            messageColor: 'text-green-800',
        },
        warning: {
            backgroundColor: 'bg-yellow-100',
            iconColor: 'text-yellow-800',
            icon: IconEnum.ExclamationFilled,
            messageColor: 'text-yellow-800',
        },
        error: {
            backgroundColor: 'bg-red-100',
            iconColor: 'text-red-700',
            icon: IconEnum.ErrorFilled,
            messageColor: 'text-red-700',
        },
    }

    function onDismissClick(): void {
        removeDisplayNotification(id)
    }
</script>

<alert-container class="flex flex-row items-center rounded-xl p-4 {TOAST_STYLE[type].backgroundColor}">
    <Icon
        height={24}
        width={24}
        primaryColor="white"
        icon={TOAST_STYLE[type].icon}
        classes="fill-current {TOAST_STYLE[type].iconColor}"
    />
    <div class="flex flex-auto flex-col px-4">
        <Text fontWeight={FontWeight.semibold} class="flex text-13 {TOAST_STYLE[type].messageColor}">{message}</Text>
    </div>
    {#if showDismiss}
        <button
            type="button"
            on:click={onDismissClick}
            class="dismiss-min-wh cursor-pointer text-center rounded-lg
            font-bold text-11 {TOAST_STYLE[type].messageColor}"
        >
            {localize('actions.dismiss')}
        </button>
    {/if}
</alert-container>
