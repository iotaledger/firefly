<script lang="typescript">
    import { Electron } from 'shared/lib/electron'
    import { Button, HR, Text } from 'shared/components'
    import { Locale } from 'shared/lib/typings/i18n'

    export let locale: Locale

    // const handleTroubleshootClick = () => {
    //     Electron.openUrl('https://iota.org')
    // }

    const handleDocumentationClick = () => {
        Electron.openUrl('https://wiki.iota.org/learn/networks/iota-1.5-chrysalis/')
    }

    const handleFaqClick = () => {
        Electron.openUrl('https://firefly.iota.org/faq')
    }

    const handleDiscordClick = () => {
        Electron.openUrl('https://discord.iota.org')
    }

    const handleReportAnIssueClick = () => {
        Electron.openUrl('https://github.com/iotaledger/firefly/issues')
    }
</script>

<div>
    <!-- <section id="troubleshoot" class="w-3/4">
        <Text type="h4" classes="mb-3">{locale('views.settings.troubleshoot.title')}</Text>
        <Text type="p" secondary classes="mb-5">{locale('views.settings.troubleshoot.description')}</Text>
        <Button medium inlineStyle="min-width: 156px;" onClick={() => handleTroubleshootClick()}>
            {locale('views.settings.troubleshoot.title')}
        </Button>
    </section>
    <HR classes="pb-5 mt-5 justify-center" /> -->
    <section id="documentation" class="w-3/4">
        <Text type="h4" classes="mb-3">{locale('views.settings.documentation.title')}</Text>
        <Text type="p" secondary classes="mb-5">{locale('views.settings.documentation.description')}</Text>
        <Button medium inlineStyle="min-width: 156px;" onClick={() => handleDocumentationClick()}>
            {locale('actions.readDocumentation')}
        </Button>
    </section>
    <HR classes="pb-5 mt-5 justify-center" />
    <section id="faq" class="w-3/4">
        <Text type="h4" classes="mb-3">{locale('views.settings.faq.title2')}</Text>
        <Text type="p" secondary classes="mb-5">{locale('views.settings.faq.description')}</Text>
        <Button medium inlineStyle="min-width: 156px;" onClick={() => handleFaqClick()}>
            {locale('actions.visitFaq')}
        </Button>
    </section>
    <HR classes="pb-5 mt-5 justify-center" />
    <section id="discord" class="w-3/4">
        <Text type="h4" classes="mb-3">{locale('views.settings.discord.title')}</Text>
        <Text type="p" secondary classes="mb-5">{locale('views.settings.discord.description')}</Text>
        <Button medium inlineStyle="min-width: 156px;" onClick={() => handleDiscordClick()}>
            {locale('actions.visitDiscord')}
        </Button>
    </section>
    <HR classes="pb-5 mt-5 justify-center" />
    <section id="reportAnIssue" class="w-3/4">
        <Text type="h4" classes="mb-3">{locale('views.settings.reportAnIssue.title')}</Text>
        <Text type="p" secondary classes="mb-5">{locale('views.settings.reportAnIssue.description')}</Text>
        <Button medium inlineStyle="min-width: 156px;" onClick={() => handleReportAnIssueClick()}>
            {locale('actions.reportAnIssue')}
        </Button>
    </section>
</div>
