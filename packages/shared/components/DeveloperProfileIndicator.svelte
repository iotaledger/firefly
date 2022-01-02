<script lang="typescript">
    import { activeProfile } from 'shared/lib/profile';
    import { Link, Text } from 'shared/components'
    import type  { Locale } from 'shared/lib/typings/i18n';

    export let locale: Locale

    let showIndicator = true

    const handleDismiss = () => {
        showIndicator = false
    }
</script>

{#if $activeProfile?.isDeveloperProfile && showIndicator}
<div class="flex flex justify-center content-center items-center bg-yellow-700 space-x-4 p-2">
    <Text type="p">
        {locale('indicators.developerProfileIndicator.warningText', { values: { networkName: $activeProfile.settings.networkConfig.network.name }})}
    </Text>
    <Link onClick={handleDismiss} classes="text-13 hover:underline cursor-pointer">
        {locale('actions.dismiss')}
    </Link>
</div>
{/if}