<script lang="typescript">
    import { HR } from 'shared/components'
    import { ExternalRoute, HelpAndInfoRoute } from '@core/router'
    import HelpSection from './HelpSection.svelte'
    import features from 'shared/features/features'

    const settings: {
        component: unknown
        childRoute: HelpAndInfoRoute
        actionLocale: string
        url: ExternalRoute
    }[] = [
        {
            component: HelpSection,
            childRoute: HelpAndInfoRoute.Documentation,
            url: ExternalRoute.Documentation,
            actionLocale: 'readDocumentation',
        },
        {
            component: HelpSection,
            childRoute: HelpAndInfoRoute.Faq,
            url: ExternalRoute.FAQ,
            actionLocale: 'visitFaq',
        },
        {
            component: HelpSection,
            childRoute: HelpAndInfoRoute.Discord,
            url: ExternalRoute.Discord,
            actionLocale: 'visitDiscord',
        },
        {
            component: HelpSection,
            childRoute: HelpAndInfoRoute.ReportAnIssue,
            url: ExternalRoute.IssueReport,
            actionLocale: 'reportAnIssue',
        },
    ]

    const visibleSettings = settings.filter((setting) => features?.settings?.helpAndInfo?.[setting.childRoute]?.enabled)
</script>

<div>
    {#each visibleSettings as { component, childRoute, actionLocale, url }, index}
        <section id={childRoute} class="w-full sm:w-3/4">
            <svelte:component this={component} route={childRoute} {url} {actionLocale} />
        </section>
        {#if index < settings.length - 1}
            <HR classes="pb-5 mt-5 justify-center" />
        {/if}
    {/each}
</div>
