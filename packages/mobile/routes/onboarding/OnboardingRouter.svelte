<script lang="typescript">
    import { Transition } from 'shared/components'
    import {
        // routers
        AppSetupRouter,
        NetworkSetupRouter,
        ProfileSetupRouter,
        StorageProtectionSetupRouter,
        StrongholdSetupRouter,
    } from './views'
    import { OnboardingRoute, onboardingRoute } from '@core/router'
</script>

{#if $onboardingRoute === OnboardingRoute.AppSetup}
    <Transition>
        <AppSetupRouter />
    </Transition>
{:else if $onboardingRoute === OnboardingRoute.NetworkSetup}
    <Transition>
        <NetworkSetupRouter />
    </Transition>
{:else if $onboardingRoute === OnboardingRoute.ProfileSetup}
    <Transition>
        <ProfileSetupRouter />
    </Transition>
{:else if $onboardingRoute === OnboardingRoute.StrongholdSetup}
    <Transition>
        <StrongholdSetupRouter />
    </Transition>
{:else if $onboardingRoute === OnboardingRoute.StorageProtectionSetup}
    <Transition transition={false}>
        <StorageProtectionSetupRouter />
    </Transition>
{/if}
