<script lang="ts">
    import { Platform } from '@core/app'
    import { AppSetupRoute, appSetupRoute } from '@core/router'
    import features from '@features/features'
    import { Transition } from '@ui'
    import { LanguageAndAppearanceView, WelcomeView } from './views'

    $: if (features.analytics.onboardingRoute.appSetupRoute.enabled && $appSetupRoute) {
        Platform.trackEvent('app-setup-route', { route: $appSetupRoute })
    }
</script>

{#if $appSetupRoute === AppSetupRoute.Welcome}
    <Transition>
        <WelcomeView />
    </Transition>
{:else if $appSetupRoute === AppSetupRoute.LanguageAndAppearance}
    <Transition>
        <LanguageAndAppearanceView />
    </Transition>
{/if}
