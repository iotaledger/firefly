<script lang="ts">
    import { WelcomeView } from './views'
    import { AppSetupRoute, appSetupRoute } from '@/routers'
</script>

{#if $appSetupRoute === AppSetupRoute.Welcome}
    <WelcomeView />
{/if}
