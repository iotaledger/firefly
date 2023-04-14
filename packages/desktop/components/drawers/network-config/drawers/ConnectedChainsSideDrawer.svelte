<script lang="ts">
    import { Text, TextType } from '@ui'
    import { localize } from '@core/i18n'
</script>

<div class="flex flex-row justify-between mb-6">
    <div class="flex justify-center content-center">
        <Text type={TextType.h4} classes="text-center"
            >{localize('views.dashboard.drawers.networkConfig.connectedChains.title')}</Text
        >
    </div>
</div>
