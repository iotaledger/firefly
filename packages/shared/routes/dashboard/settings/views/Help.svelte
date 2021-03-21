<script lang="typescript">
    import { Electron } from 'shared/lib/electron'
    import { Button, HR, Text } from 'shared/components'

    export let locale

    const handleTroubleshootClick = () => {
        Electron.openUrl('https://iota.org')
    }

    const handleDocumentationClick = () => {
        Electron.openUrl('https://iota.org')
    }

    const handleFaqClick = () => {
        Electron.openUrl('https://iota.org')
    }

    const handleDiscordClick = () => {
        Electron.openUrl('https://discord.iota.org')
    }

    const handleReportAnIssueClick = () => {
        Electron.openUrl('https://github.com/iotaledger/firefly/issues')
    }
</script>

<div>
    <!-- TODO: Add help links -->
    <section id="troubleshoot" class="w-3/4 opacity-50">
        <Text type="h4" classes="mb-3">{locale('views.settings.troubleshoot.title')}</Text>
        <Text type="p" secondary classes="mb-5">{locale('views.settings.troubleshoot.description')}</Text>
        <Button classes='pointer-events-none' onClick={() => handleTroubleshootClick()}>{locale('views.settings.troubleshoot.title')}</Button>
    </section>
    <HR classes="pb-5 mt-5 justify-center" />
    <section id="documentation" class="w-3/4 opacity-50">
        <Text type="h4" classes="mb-3">{locale('views.settings.documentation.title')}</Text>
        <Text type="p" secondary classes="mb-5">{locale('views.settings.documentation.description')}</Text>
        <Button classes='pointer-events-none' onClick={() => handleDocumentationClick()}>{locale('actions.readDocumentation')}</Button>
    </section>
    <HR classes="pb-5 mt-5 justify-center" />
    <section id="faq" class="w-3/4 opacity-50">
        <Text type="h4" classes="mb-3">{locale('views.settings.faq.title2')}</Text>
        <Text type="p" secondary classes="mb-5">{locale('views.settings.faq.description')}</Text>
        <Button classes='pointer-events-none' onClick={() => handleFaqClick()}>{locale('actions.visitFaq')}</Button>
    </section>
    <HR classes="pb-5 mt-5 justify-center" />
    <section id="discord" class="w-3/4">
        <Text type="h4" classes="mb-3">{locale('views.settings.discord.title')}</Text>
        <Text type="p" secondary classes="mb-5">{locale('views.settings.discord.description')}</Text>
        <Button onClick={() => handleDiscordClick()}>{locale('actions.visitDiscord')}</Button>
    </section>
    <HR classes="pb-5 mt-5 justify-center" />
    <section id="reportAnIssue" class="w-3/4">
        <Text type="h4" classes="mb-3">{locale('views.settings.reportAnIssue.title')}</Text>
        <Text type="p" secondary classes="mb-5">{locale('views.settings.reportAnIssue.description')}</Text>
        <Button onClick={() => handleReportAnIssueClick()}>{locale('actions.reportAnIssue')}</Button>
    </section>
</div>
