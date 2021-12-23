<script lang="typescript">
    import { activeProfile } from 'shared/lib/profile';
    import { Text , Icon } from 'shared/components'
    import type  { Locale } from 'shared/lib/typings/i18n';

    export let locale: Locale
</script>

<style type="text/scss">
</style>

{#if $activeProfile?.isDeveloperProfile}
<div class="flex flex roww-full justify-center content-center items-center bg-yellow-700 space-x-4 p-2">
    <Icon icon="warning" classes="text-white" width={20} height={20}/>
    <Text type="p">
        {locale('indicators.developerProfileIndicator.warningText', { values: { networkName: $activeProfile.settings.networkConfig.network.name }})}
    </Text>
    <Icon icon="warning" classes="text-white" width={20} height={20}/>
</div>
{/if}
