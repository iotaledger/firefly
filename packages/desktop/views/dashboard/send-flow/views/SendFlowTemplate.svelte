<script lang="ts">
    import { Button, FontWeight, Text, TextType } from '@ui'

    type ButtonInfo = { text: string; onClick: () => void; disabled?: boolean; isBusy?: boolean }

    export let title: string
    export let leftButton: ButtonInfo
    export let rightButton: ButtonInfo
</script>

<send-flow-view class="w-full h-full space-y-6 flex flex-auto flex-col flex-shrink-0">
    <Text type={TextType.h3} fontWeight={FontWeight.semibold} classes="text-left">
        {title}
    </Text>
    <send-flow-body class="w-full space-y-4">
        <slot />
    </send-flow-body>
    <popup-buttons class="flex flex-row flex-nowrap w-full space-x-4">
        <Button
            classes="w-full"
            outline
            onClick={leftButton.onClick}
            disabled={leftButton.disabled}
            isBusy={leftButton.isBusy}
        >
            {leftButton.text}
        </Button>
        <Button
            classes="w-full"
            onClick={rightButton.onClick}
            disabled={rightButton.disabled}
            isBusy={rightButton.isBusy}
        >
            {rightButton.text}
        </Button>
    </popup-buttons>
</send-flow-view>
