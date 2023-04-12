<script lang="ts">
    import { AppSetupRoute, appSetupRoute } from '@core/router'
    import { Transition } from 'shared/components'
    import { LanguageAndAppearanceView, WelcomeView } from './views'
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
