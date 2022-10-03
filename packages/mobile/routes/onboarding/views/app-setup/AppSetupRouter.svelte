<script lang="typescript">
    import { Transition } from 'shared/components'
    import { WelcomeView } from './views'
    import { AppSetupRoute, appSetupRoute } from '@core/router'
</script>

{#if $appSetupRoute === AppSetupRoute.Welcome}
    <Transition>
        <WelcomeView />
    </Transition>
{/if}
