<script lang="typescript">
    import { HR } from 'shared/components'
    import { ExternalRoute, HelpAndInfo } from 'shared/lib/typings/routes'
    import HelpSection from './HelpSection.svelte'

    const settings: {
        component: unknown
        childRoute: HelpAndInfo
        actionLocale: string
        url: ExternalRoute
    }[] = [
        {
            component: HelpSection,
            childRoute: HelpAndInfo.Documentation,
            url: ExternalRoute.Documentation,
            actionLocale: 'readDocumentation',
        },
        { component: HelpSection, childRoute: HelpAndInfo.FAQ, url: ExternalRoute.FAQ, actionLocale: 'visitFaq' },
        {
            component: HelpSection,
            childRoute: HelpAndInfo.Discord,
            url: ExternalRoute.Discord,
            actionLocale: 'visitDiscord',
        },
        {
            component: HelpSection,
            childRoute: HelpAndInfo.ReportAnIssue,
            url: ExternalRoute.IssueReport,
            actionLocale: 'reportAnIssue',
        },
    ]
</script>

<div>
    {#each settings as { component, childRoute, actionLocale, url }, index}
        <section id={childRoute} class="w-full sm:w-3/4">
            <svelte:component this={component} route={childRoute} {url} {actionLocale} />
        </section>
        {#if index < settings.length - 1}
            <HR classes="pb-5 mt-5 justify-center hidden md:block" />
        {/if}
    {/each}
</div>
