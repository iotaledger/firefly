<script lang="ts">
    import { localize } from '@core/i18n'
    import { Text, TextType } from '@ui'
</script>

<div class="flex flex-row justify-between mb-6">
    <div class="flex justify-center content-center">
        <Text type={TextType.h4} classes="text-center">{localize('views.dashboard.network.drawer.title')}</Text>
    </div>
</div>
