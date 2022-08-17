<script lang="typescript">
    import { Icon, Text } from 'shared/components'
    import { FontWeight, TextType } from 'shared/components/Text.svelte'

    export let classes: string
    export let type: string
    export let message: string

    const TOAST_STYLE = {
        info: {
            backgroundColor: 'blue-100',
            iconBackgroundColor: 'blue-700',
            icon: 'info',
            iconColor: 'white',
            messageColor: 'blue-700',
        },
        success: {
            backgroundColor: 'green-100',
            iconBackgroundColor: 'green-800',
            icon: 'checkmark',
            iconColor: 'white',
            messageColor: 'green-800',
        },
        warning: {
            backgroundColor: 'yellow-100',
            iconBackgroundColor: 'yellow-800',
            icon: 'exclamation',
            iconColor: 'white',
            messageColor: 'yellow-800',
        },
        error: {
            backgroundColor: 'red-100',
            iconBackgroundColor: 'red-700',
            icon: 'status-error',
            iconColor: 'white',
            messageColor: 'red-700',
        },
    }
</script>

<div class="{classes} flex flex-row items-center rounded-xl p-4 bg-{TOAST_STYLE[type].backgroundColor}">
    <div
        class="w-4 h-4 flex flex-shrink-0 justify-center items-center bg-{TOAST_STYLE[type]
            .iconBackgroundColor} rounded-lg text-{TOAST_STYLE[type].iconColor}"
    >
        <Icon height={12} width={12} icon={TOAST_STYLE[type].icon} />
    </div>
    <div class="flex flex-auto flex-col px-4">
        <Text
            type={TextType.p}
            fontWeight={FontWeight.semibold}
            class="flex text-13 text text-{TOAST_STYLE[type].messageColor}">{message}</Text
        >
    </div>
</div>
