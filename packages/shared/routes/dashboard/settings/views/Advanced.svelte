<script>
    import { get } from 'svelte/store'
    import { api } from 'shared/lib/wallet'
    import { activeProfile, updateProfile } from 'shared/lib/profile'
    import { Dropdown, Text, Radio, Checkbox, Button } from 'shared/components'
    import { DEFAULT_NODES as nodes } from 'shared/lib/network'

    export let locale
    let outsourcePowChecked = get(activeProfile).settings.outsourcePow
    let developerModeChecked = get(activeProfile).settings.developerMode
    let deepLinkingChecked = get(activeProfile).settings.deepLinking

    $: updateProfile('settings.outsourcePow', outsourcePowChecked)
    $: updateProfile('settings.developerMode', developerModeChecked)
    $: updateProfile('settings.deepLinking', deepLinkingChecked)

    let automaticNodeSelection = true

    function addNode() {
        if ([...$activeProfile.settings.customNodes, ...nodes].some((node) => node === 'http://localhost')) {
            return console.error('Node already exists')
        }
    }
</script>

<div>
    <section id="nodeSettings" class="w-3/4">
        <Text type="h4" classes="mb-3">{locale('views.settings.nodeSettings.title')}</Text>
        <Text type="p" secondary classes="mb-5">{locale('views.settings.nodeSettings.description')}</Text>
        <Radio value={true} bind:group={automaticNodeSelection} label={locale('general.automaticNodeSelection')} />
        <Radio value={false} bind:group={automaticNodeSelection} label={locale('general.manualNodeSelection')} />
    </section>
    <hr class="border-t border-gray-100 w-full border-solid pb-5 mt-5 justify-center" />

    {#if !automaticNodeSelection}
        <section id="configureNodeList" class="w-3/4">
            <Text type="h4" classes="mb-3">{locale('views.settings.configureNodeList.title')}</Text>
            <Text type="p" secondary classes="mb-5">{locale('views.settings.configureNodeList.description')}</Text>

            <!-- Nodes list -->
            <Text type="h4" classes="mb-3">{locale('general.nodes')}</Text>
            <Dropdown
                value={$activeProfile.settings.node}
                items={[...nodes, ...$activeProfile.settings.customNodes].map((node) => ({ value: node, label: node }))} />
            <Button classes="w-1/4 mt-4" onClick={() => {}}>{locale('actions.add_node')}</Button>

        </section>
        <hr class="border-t border-gray-100 w-full border-solid pb-5 mt-5 justify-center" />
    {/if}

    <section id="proofOfWork" class="w-3/4">
        <Text type="h4" classes="mb-3">{locale('views.settings.proofOfWork.title')}</Text>
        <Text type="p" secondary classes="mb-5">{locale('views.settings.proofOfWork.description')}</Text>
        <Checkbox label={locale('actions.outsourceProofOfWork')} bind:checked={outsourcePowChecked} />
    </section>
    <hr class="border-t border-gray-100 w-full border-solid pb-5 mt-5 justify-center" />
    <section id="developerMode" class="w-3/4">
        <Text type="h4" classes="mb-3">{locale('views.settings.developerMode.title')}</Text>
        <Text type="p" secondary classes="mb-5">{locale('views.settings.developerMode.description')}</Text>
        <Checkbox label={locale('actions.enableDeveloperMode')} bind:checked={developerModeChecked} />
    </section>
    <hr class="border-t border-gray-100 w-full border-solid pb-5 mt-5 justify-center" />
    <section id="deepLinks" class="w-3/4">
        <Text type="h4" classes="mb-3">{locale('views.settings.deepLinks.title')}</Text>
        <Text type="p" secondary classes="mb-5">{locale('views.settings.deepLinks.description')}</Text>
        <Checkbox label={locale('actions.enableDeepLinks')} bind:checked={deepLinkingChecked} />
    </section>
    <hr class="border-t border-gray-100 w-full border-solid pb-5 mt-5 justify-center" />
    <section id="resyncAccounts" class="w-3/4">
        <Text type="h4" classes="mb-3">{locale('views.settings.resyncAccounts.title')}</Text>
        <Text type="p" secondary classes="mb-5">{locale('views.settings.resyncAccounts.description')}</Text>
        <Button classes="w-1/4" onClick={() => {}}>{locale('actions.syncAll')}</Button>
    </section>
    <hr class="border-t border-gray-100 w-full border-solid pb-5 mt-5 justify-center" />
    <section id="errorLog" class="w-3/4">
        <Text type="h4" classes="mb-3">{locale('views.settings.errorLog.title')}</Text>
        <Text type="p" secondary classes="mb-5">{locale('views.settings.errorLog.description')}</Text>
        <Button classes="w-1/4" onClick={() => {}}>{locale('views.settings.errorLog.title')}</Button>
    </section>
    <hr class="border-t border-gray-100 w-full border-solid pb-5 mt-5 justify-center" />
    <section id="stateExport" class="w-3/4">
        <Text type="h4" classes="mb-3">{locale('views.settings.stateExport.title')}</Text>
        <Text type="p" secondary classes="mb-5">{locale('views.settings.stateExport.description')}</Text>
        <Button classes="w-1/4" onClick={() => {}}>{locale('actions.exportState')}</Button>
    </section>
</div>
