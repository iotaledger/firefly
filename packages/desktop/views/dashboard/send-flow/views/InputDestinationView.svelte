<script lang="ts">
    import { localize } from '@core/i18n'
    import { Button, FontWeight, Text, TextType } from 'shared/components'
    import { sendFlowRouter } from '../send-flow-router'

    function onContinueClick(): void {
        $sendFlowRouter.next()
    }

    function onBackClick(): void {
        $sendFlowRouter.previous()
    }
</script>

<input-destination-view class="w-full h-full space-y-6 flex flex-auto flex-col flex-shrink-0">
    <input-destination-title>
        <Text type={TextType.h3} fontWeight={FontWeight.semibold} classes="text-left">Input Destination Title</Text>
    </input-destination-title>
    <input-destination-content> Input Destination Content </input-destination-content>
    <input-destination-buttons class="flex flex-row flex-nowrap w-full space-x-4">
        <Button classes="w-full" outline onClick={onBackClick}>
            {localize('actions.back')}
        </Button>
        <Button classes="w-full" onClick={onContinueClick}>
            {localize('actions.continue')}
        </Button>
    </input-destination-buttons>
</input-destination-view>
