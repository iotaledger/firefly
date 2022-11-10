<script lang="typescript">
    import { Transition } from 'shared/components'
    import { LanguageAndAppearanceView, LegalView, WelcomeView } from './views'
    import { AppSetupRoute, appSetupRoute } from '@core/router'
</script>

{#if $appSetupRoute === AppSetupRoute.Welcome}
    <Transition>
        <WelcomeView />
    </Transition>
{:else if $appSetupRoute === AppSetupRoute.Legal}
    <Transition>
        <LegalView />
    </Transition>
{:else if $appSetupRoute === AppSetupRoute.LanguageAndAppearance}
    <Transition>
        <LanguageAndAppearanceView />
    </Transition>
{/if}
