<script lang="typescript">
    import {
        NetworkConfigurationSettingsRoute,
        networkConfigurationSettingsRoute,
    } from '../../../../../../../../lib/routers'
    import { NetworkConfigurationInitView } from './views'
</script>

{#if $networkConfigurationSettingsRoute === NetworkConfigurationSettingsRoute.Init}
    <NetworkConfigurationInitView />
{/if}
