<script>
    import { Text, Radio, Checkbox, Button } from 'shared/components';

    export let locale

    let deepLinksChecked
    let automaticNodeSelection = true
</script>

<div>
    <section id="nodeSettings" class='w-3/4'>
        <Text type="h4" classes="mb-3">{locale('views.settings.nodeSettings.title')}</Text>
        <Text type="p" secondary classes="mb-5">{locale('views.settings.nodeSettings.description')}</Text>
        <Radio value={false} bind:group={automaticNodeSelection} label={locale('general.automaticNodeSelection')} />
        <Radio value={true} bind:group={automaticNodeSelection} label={locale('general.manualNodeSelection')} />
    </section>
    <hr class='border-t border-gray-100 w-full border-solid pb-5 mt-5 justify-center'/>
    <section id="proofOfWork" class='w-3/4'>
        <Text type="h4" classes="mb-3">{locale('views.settings.proofOfWork.title')}</Text>
        <Text type="p" secondary classes="mb-5">{locale('views.settings.proofOfWork.description')}</Text>
        <Checkbox label={locale('actions.outsourceProofOfWork')} bind:deepLinksChecked />
    </section>
    <hr class='border-t border-gray-100 w-full border-solid pb-5 mt-5 justify-center'/>
    <section id="developerMode" class='w-3/4'>
        <Text type="h4" classes="mb-3">{locale('views.settings.developerMode.title')}</Text>
        <Text type="p" secondary classes="mb-5">{locale('views.settings.developerMode.description')}</Text>
        <Checkbox label={locale('actions.enableDeveloperMode')} bind:deepLinksChecked />
    </section>
    <hr class='border-t border-gray-100 w-full border-solid pb-5 mt-5 justify-center'/>
    <section id="deepLinks" class='w-3/4'>
        <Text type="h4" classes="mb-3">{locale('views.settings.deepLinks.title')}</Text>
        <Text type="p" secondary classes="mb-5">{locale('views.settings.deepLinks.description')}</Text>
        <Checkbox label={locale('actions.enableDeepLinks')} bind:deepLinksChecked />
    </section>
    <hr class='border-t border-gray-100 w-full border-solid pb-5 mt-5 justify-center'/>
    <section id="resyncAccounts" class='w-3/4'>
        <Text type="h4" classes="mb-3">{locale('views.settings.resyncAccounts.title')}</Text>
        <Text type="p" secondary classes="mb-5">{locale('views.settings.resyncAccounts.description')}</Text>
        <Button classes="w-1/4" onClick={() => {}}>{locale('actions.syncAll')}</Button>
    </section>
    <hr class='border-t border-gray-100 w-full border-solid pb-5 mt-5 justify-center'/>
    <section id="errorLog" class='w-3/4'>
        <Text type="h4" classes="mb-3">{locale('views.settings.errorLog.title')}</Text>
        <Text type="p" secondary classes="mb-5">{locale('views.settings.errorLog.description')}</Text>
        <Button classes="w-1/4" onClick={() => {}}>{locale('views.settings.errorLog.title')}</Button>
    </section>
    <hr class='border-t border-gray-100 w-full border-solid pb-5 mt-5 justify-center'/>
    <section id="stateExport" class='w-3/4'>
        <Text type="h4" classes="mb-3">{locale('views.settings.stateExport.title')}</Text>
        <Text type="p" secondary classes="mb-5">{locale('views.settings.stateExport.description')}</Text>
        <Button classes="w-1/4" onClick={() => {}}>{locale('actions.exportState')}</Button>
    </section>
</div>
