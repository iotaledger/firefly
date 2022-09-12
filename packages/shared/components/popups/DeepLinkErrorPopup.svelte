<script lang="typescript">
    import { localize } from '@core/i18n'
    import { Text, Button, TextHint } from 'shared/components'
    import { FontWeight } from 'shared/components/Text.svelte'
    import { closePopup } from '@lib/popup'

    export let error: Error
</script>

<activity-switcher-popup class="w-full h-full space-y-6 flex flex-auto flex-col flex-shrink-0">
    <Text type="h3" fontWeight={FontWeight.semibold} classes="text-left">
        {localize('popups.deeplinkError.title')}
    </Text>
    <div class="flex flex-col space-y-4">
        <Text fontSize="15" color="gray-700" classes="text-left">{localize('popups.deeplinkError.body')}</Text>
        <TextHint danger text={error.message} />
    </div>
    <popup-buttons class="flex flex-row flex-nowrap w-full space-x-4">
        <Button classes="w-1/2" secondary onClick={closePopup}>{localize('actions.close')}</Button>
    </popup-buttons>
</activity-switcher-popup>
