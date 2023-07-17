<script lang="ts">
    import { Icon, Text, FontWeight, TextType } from 'shared/components'
    import { localize } from '@core/i18n'
    import { removeDisplayNotification } from '@auxiliary/notification/stores'
    import { Icon as IconEnum } from '@auxiliary/icon'

    export let type: string
    export let message: string
    export let classes: string = ''
    export let showDismiss: boolean = false
    export let id: string = ''

    interface ToastStyle {
        backgroundColor: string
        iconColor: string
        icon: IconEnum
        messageColor: string
    }

    const TOAST_STYLE: Record<string, ToastStyle> = {
        info: {
            backgroundColor: 'blue-100',
            iconColor: 'blue-700',
            icon: IconEnum.InfoFilled,
            messageColor: 'blue-700',
        },
        success: {
            backgroundColor: 'green-100',
            iconColor: 'green-800',
            icon: IconEnum.CheckmarkFilled,
            messageColor: 'green-800',
        },
        warning: {
            backgroundColor: 'yellow-100',
            iconColor: 'yellow-800',
            icon: IconEnum.ExclamationFilled,
            messageColor: 'yellow-800',
        },
        error: {
            backgroundColor: 'red-100',
            iconColor: 'red-700',
            icon: IconEnum.ErrorFilled,
            messageColor: 'red-700',
        },
    }

    function onDismissClick(): void {
        removeDisplayNotification(id)
    }
</script>

<div class="{classes} flex flex-row items-center rounded-xl p-4 bg-{TOAST_STYLE[type].backgroundColor}">
    <Icon
        height={24}
        width={24}
        primaryColor="white"
        icon={TOAST_STYLE[type].icon}
        classes="fill-current text-{TOAST_STYLE[type].iconColor}"
    />
    <div class="flex flex-auto flex-col px-4">
        <Text
            type={TextType.p}
            fontWeight={FontWeight.semibold}
            class="flex text-13 text text-{TOAST_STYLE[type].messageColor}">{message}</Text
        >
    </div>
    {#if showDismiss}
        <button
            type="button"
            on:click={onDismissClick}
            class="dismiss-min-wh cursor-pointer text-center rounded-lg
            font-bold text-11 text-{TOAST_STYLE[type].messageColor}"
        >
            {localize('actions.dismiss')}
        </button>
    {/if}
</div>
