<script lang="typescript">
    import { HR } from 'shared/components'
    import { mobile } from 'shared/lib/app'
    import { settingsChildRoute } from 'shared/lib/router'
    import { HelpAndInfo } from 'shared/lib/typings/routes'
    import { Discord, Documentation, FAQ, ReportAnIssue } from './'

    const settings: {
        component: unknown
        childRoute: HelpAndInfo
    }[] = [
        // { component: Troubleshoot, childRoute: HelpAndInfo.Troubleshoot },
        { component: Documentation, childRoute: HelpAndInfo.Documentation },
        { component: FAQ, childRoute: HelpAndInfo.FAQ },
        { component: Discord, childRoute: HelpAndInfo.Discord },
        { component: ReportAnIssue, childRoute: HelpAndInfo.ReportAnIssue },
    ]
</script>

<div>
    {#each settings as { component, childRoute }, index}
        {#if !$mobile || ($mobile && $settingsChildRoute === childRoute)}
            <section id={childRoute} class="w-full sm:w-3/4">
                <svelte:component this={component} id={childRoute} />
            </section>
            {#if index < settings.length - 1}
                <HR classes="pb-5 mt-5 justify-center hidden md:block" />
            {/if}
        {/if}
    {/each}
</div>
