<script lang="typescript">
    import { HR } from 'shared/components'
    import { HelpAndInfoRoute } from '@core/router'
    import HelpSection from './HelpSection.svelte'
    import features from '@features/features'
    import { DISCORD_URL, DOCUMENTATION_URL, FAQ_URL, ISSUE_REPORT_URL } from '@contexts/settings'

    const settings: {
        component: unknown
        childRoute: HelpAndInfoRoute
        actionLocale: string
        url: string
    }[] = [
        {
            component: HelpSection,
            childRoute: HelpAndInfoRoute.Documentation,
            url: DOCUMENTATION_URL,
            actionLocale: 'readDocumentation',
        },
        {
            component: HelpSection,
            childRoute: HelpAndInfoRoute.Faq,
            url: FAQ_URL,
            actionLocale: 'visitFaq',
        },
        {
            component: HelpSection,
            childRoute: HelpAndInfoRoute.Discord,
            url: DISCORD_URL,
            actionLocale: 'visitDiscord',
        },
        {
            component: HelpSection,
            childRoute: HelpAndInfoRoute.ReportAnIssue,
            url: ISSUE_REPORT_URL,
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
