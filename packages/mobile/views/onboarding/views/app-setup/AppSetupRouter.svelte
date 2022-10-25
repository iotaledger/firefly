<script lang="typescript">
    import { WelcomeView } from './views'
    import { AppSetupRoute, appSetupRoute } from '../../../../lib/routers'
</script>

{#if $appSetupRoute === AppSetupRoute.Welcome}
    <WelcomeView />
{/if}
