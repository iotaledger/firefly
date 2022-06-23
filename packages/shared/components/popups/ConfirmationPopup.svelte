<script lang="typescript">
    import { Button, Text } from 'shared/components'
    import { FontWeightText, TextType } from 'shared/components/Text.svelte'
    import { localize } from '@core/i18n'
    import { closePopup } from '@lib/popup'

    export let title: string
    export let description: string
    export let onConfirm: () => void

    function confirmClick(): void {
        onConfirm()
        closePopup()
    }
</script>

<div class="w-full h-full space-y-6 flex flex-auto flex-col flex-shrink-0">
    <Text type={TextType.h3} fontWeight={FontWeightText.semibold} classes="text-left">
        {title}
    </Text>
    <Text classes="text-left">{description}</Text>
    <popup-buttons class="flex flex-row flex-nowrap w-full space-x-4">
        <Button classes="w-full" secondary onClick={closePopup}>{localize('actions.cancel')}</Button>
        <Button classes="w-full" autofocus onClick={confirmClick}>{localize('actions.confirm')}</Button>
    </popup-buttons>
</div>
