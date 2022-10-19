<script lang="typescript">
    import { WelcomeView } from './views'
    import { AppSetupRoute, appSetupRoute } from '../../../../lib/core/router'
</script>

{#if $appSetupRoute === AppSetupRoute.Welcome}
    <WelcomeView />
{/if}
