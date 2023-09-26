<script lang="ts">
    import { openUrlInBrowser } from '@core/app/utils'
    import { localize } from '@core/i18n'
    import { Link, Text, TextType } from '@ui'

    function onLinkClick(): void {
        const href =
            'https://blog.iota.org/stardust-upgrade-iota-tokenomics/#new-iota-token-denomination-moving-away-from-metric-unit-prefixes'
        openUrlInBrowser(href)
    }
</script>

<div class="flex flex-col space-y-6">
    <Text type={TextType.h3}>{localize('popups.metricSystemInfo.title')}</Text>
    <div class="flex flex-col space-y-2">
        <Text fontSize="14">{localize('popups.metricSystemInfo.body1')}</Text>
        <Text fontSize="14">{localize('popups.metricSystemInfo.body2')}</Text>
    </div>
    <info-box
        class="flex flex-col items-center p-4 rounded-lg space-y-2 bg-blue-50 dark:bg-blue-500 dark:bg-opacity-10"
    >
        <Text fontSize="14" lineHeight="5">
            {localize('popups.metricSystemInfo.body3')}
        </Text>
        <Link on:click={onLinkClick}>
            {localize('popups.metricSystemInfo.link')}
        </Link>
    </info-box>
</div>
