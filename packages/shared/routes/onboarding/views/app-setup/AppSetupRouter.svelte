<script lang="typescript">
    import { Transition } from 'shared/components'
    import { CrashReportingView, LanguageAndAppearanceView, LegalView } from './views'
    import { _ } from '@core/i18n'
    import { AppSetupRoute, appSetupRoute } from '@core/router'
</script>

{#if $appSetupRoute === AppSetupRoute.Legal}
    <Transition>
        <LegalView />
    </Transition>
{:else if $appSetupRoute === AppSetupRoute.CrashReporting}
    <Transition>
        <CrashReportingView />
    </Transition>
{:else if $appSetupRoute === AppSetupRoute.LanguageAndAppearance}
    <Transition>
        <LanguageAndAppearanceView locale={$_} />
    </Transition>
{/if}
