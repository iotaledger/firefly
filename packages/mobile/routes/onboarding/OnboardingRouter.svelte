<script lang="typescript">
    import { Transition } from 'shared/components'
    import { AppSetupRouter } from './views'
    import { OnboardingRoute, onboardingRoute } from '@core/router'
</script>

{#if $onboardingRoute === OnboardingRoute.AppSetup}
    <Transition>
        <AppSetupRouter />
    </Transition>
{/if}
