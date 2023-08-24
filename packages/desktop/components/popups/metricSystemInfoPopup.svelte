<script lang="ts">
    import { Text, TextType, TextHint, TextHintVariant } from '@ui'
    import { localize } from '@core/i18n'
</script>

<div class="flex flex-col space-y-6">
    <Text type={TextType.h3}>{localize('popups.metricSystemInfo.title')}</Text>
    <div class="flex flex-col space-y-2">
        <Text fontSize="14">{localize('popups.metricSystemInfo.body1')}</Text>
        <Text fontSize="14">{localize('popups.metricSystemInfo.body2')}</Text>
    </div>
    <div class="flex flex-col space-y-2">
        <Text type={TextType.h4}>{localize('popups.metricSystemInfo.body3')}</Text>
        <TextHint variant={TextHintVariant.Info} text={localize('popups.metricSystemInfo.body4')} />
    </div>
</div>
