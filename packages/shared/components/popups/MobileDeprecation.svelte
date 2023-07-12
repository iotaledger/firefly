<script lang="typescript">
    import { localize } from '@core/i18n'
    import { closePopup } from '@lib/popup'
    import { Icon, Button, Text } from 'shared/components'
</script>

<mobile-deprecation-popup class="flex flex-col text-center justify-between">
    <div class="flex flex-row space-x-3 items-center justify-center">
        <Icon icon="warning" classes="text-orange-500" />
        <Text type="h4" classes="text-center capitalize">{localize('popups.mobileDeprecation.title')}</Text>
    </div>
    <Text type="p">{localize('popups.mobileDeprecation.body')}</Text>
    <Button classes="w-full" onClick={closePopup}>{localize('actions.okIUnderstand')}</Button>
</mobile-deprecation-popup>

<style lang="scss">
    mobile-deprecation-popup {
        min-height: 80vh;
    }
</style>
