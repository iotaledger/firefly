<script lang="typescript">
    import { Transition } from 'shared/components'
    import {
        BundleMiningWarning,
        Migrate,
        SecureSpentAddresses,
        SecuringSpentAddresses,
        SecurityCheckCompleted,
        TransferFragmentedFunds,
    } from './views/'
    import { Locale } from 'shared/lib/typings/i18n'
    import { FireflyEvent } from '@core/router/typings/event'
    import { migrateRoute, MigrateRouter, MigrateRoutes } from '@core/router'

    export let locale: Locale

    const migrateRouter = new MigrateRouter()

    const next = (event: CustomEvent<FireflyEvent>): void => migrateRouter.next(event.detail)
    const previous = (): void => migrateRouter.previous()
</script>

{#if $migrateRoute === MigrateRoutes.Init}
    <Transition>
        <Migrate on:next={next} on:previous={previous} {locale} />
    </Transition>
{:else if $migrateRoute === MigrateRoutes.TransferFragmentedFunds}
    <Transition>
        <TransferFragmentedFunds on:next={next} on:previous={previous} {locale} />
    </Transition>
{:else if $migrateRoute === MigrateRoutes.BundleMiningWarning}
    <Transition>
        <BundleMiningWarning on:next={next} on:previous={previous} {locale} />
    </Transition>
{:else if $migrateRoute === MigrateRoutes.SecureSpentAddresses}
    <Transition>
        <SecureSpentAddresses on:next={next} on:previous={previous} {locale} />
    </Transition>
{:else if $migrateRoute === MigrateRoutes.SecuringSpentAddresses}
    <Transition>
        <SecuringSpentAddresses on:next={next} on:previous={previous} {locale} />
    </Transition>
{:else if $migrateRoute === MigrateRoutes.SecurityCheckCompleted}
    <Transition>
        <SecurityCheckCompleted on:next={next} on:previous={previous} {locale} />
    </Transition>
{/if}
