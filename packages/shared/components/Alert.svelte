<script lang="typescript">
    import { Icon, Text } from 'shared/components'
    import { FontWeight, TextType } from 'shared/components/Text.svelte'

    export let classes: string
    export let type: string
    export let message: string

    const TOAST_STYLE = {
        info: {
            backgroundColor: 'blue-100',
            iconColor: 'blue-700',
            icon: 'info-filled',
            messageColor: 'blue-700',
        },
        success: {
            backgroundColor: 'green-100',
            iconColor: 'green-800',
            icon: 'checkmark-filled',
            messageColor: 'green-800',
        },
        warning: {
            backgroundColor: 'yellow-100',
            iconColor: 'yellow-800',
            icon: 'exclamation-filled',
            messageColor: 'yellow-800',
        },
        error: {
            backgroundColor: 'red-100',
            iconColor: 'red-700',
            icon: 'error-filled',
            messageColor: 'red-700',
        },
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
</div>
