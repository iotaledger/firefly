<script lang="ts">
    import { localize } from '@core/i18n'
    import { Text, Button, TextHint, FontWeight } from 'shared/components'
    import { closeOverlay } from '@auxiliary/popup'

    export let error: Error
</script>

<deep-link-error-popup class="w-full h-full space-y-6 flex flex-auto flex-col flex-shrink-0">
    <Text type="h3" fontWeight={FontWeight.semibold} classes="text-left">
        {localize('popups.deeplinkError.title')}
    </Text>
    <div class="flex flex-col space-y-4">
        <Text fontSize="15" color="gray-700" classes="text-left">{localize('popups.deeplinkError.body')}</Text>
        <TextHint danger text={error.message} />
    </div>
    <popup-buttons class="flex flex-row flex-nowrap w-full space-x-4">
        <Button classes="w-1/2" secondary onClick={closeOverlay}>{localize('actions.close')}</Button>
    </popup-buttons>
</deep-link-error-popup>
