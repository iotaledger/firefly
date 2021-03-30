<script lang="typescript">
    import { Button, Checkbox, HR, Radio, Text } from 'shared/components'
    import { loggedIn } from 'shared/lib/app'
    import { appSettings } from 'shared/lib/appSettings'
    import { DEFAULT_NODES } from 'shared/lib/network'
    import { openPopup } from 'shared/lib/popup'
    import { activeProfile, updateProfile } from 'shared/lib/profile'
    import { isSyncing, syncAccounts, updateAccountNetwork, wallet } from 'shared/lib/wallet'
    import { get } from 'svelte/store'

    export let locale

    const { accounts } = $wallet

    let activeProfileSettings = get(activeProfile)?.settings

    let deepLinkingChecked = $appSettings.deepLinking
    let automaticNodeSelection = activeProfileSettings?.automaticNodeSelection ?? true
    let includeOfficialNodes = activeProfileSettings.includeOfficialNodes ?? true

    let customNodes = []
    let officialNodes = DEFAULT_NODES.slice()
    let primaryNodeUrl = ''
    let nodeContextMenu = undefined
    let nodeContextMenuIsOfficial = false

    $: {
        if ($accounts && $accounts.length) {
            customNodes = $accounts[0].clientOptions.customNodes ?? []
            if ($accounts[0].clientOptions.node) {
                primaryNodeUrl = $accounts[0].clientOptions.node.url
            }
        }
    }
    $: $appSettings.deepLinking = deepLinkingChecked
    $: updateProfile('settings.automaticNodeSelection', automaticNodeSelection)
    $: updateProfile('settings.includeOfficialNodes', includeOfficialNodes)
    $: updateAccountNetwork(automaticNodeSelection, includeOfficialNodes, customNodes, primaryNodeUrl)

    function handleAddNodeClick() {
        openPopup({ type: 'addNode' })
    }

    function handlePropertiesNodeClick(nodeUrl) {
        openPopup({ type: 'addNode' })
    }

    function handleRemoveNodeClick(nodeUrl) {
        openPopup({ type: 'removeNode' })
    }

    function handleErrorLogClick() {
        openPopup({ type: 'errorLog' })
    }

    function handleDiagnosticsClick() {
        openPopup({ type: 'diagnostics' })
    }
</script>

<div>
    {#if $loggedIn}
        <section id="nodeSettings" class="w-3/4">
            <Text type="h4" classes="mb-3">{locale('views.settings.nodeSettings.title')}</Text>
            <Text type="p" secondary classes="mb-5">{locale('views.settings.nodeSettings.description')}</Text>
            <Radio value={true} bind:group={automaticNodeSelection} label={locale('general.automaticNodeSelection')} />
            <Radio value={false} bind:group={automaticNodeSelection} label={locale('general.manualNodeSelection')} />
        </section>
        <HR classes="pb-5 mt-5 justify-center" />
        {#if !automaticNodeSelection}
            <section id="configureNodeList" class="w-3/4">
                <Text type="h4" classes="mb-3">{locale('views.settings.configureNodeList.title')}</Text>
                <Text type="p" secondary classes="mb-5">{locale('views.settings.configureNodeList.description')}</Text>
                <Checkbox label={locale('actions.includeOfficialNodeList')} bind:checked={includeOfficialNodes} classes="mb-5" />
                <div class="flex flex-col border border-solid dark:border-gray-700 rounded-2xl overflow-hidden">
                    {#if !includeOfficialNodes && customNodes.length === 0}
                        <Text classes="p-3">{locale('view.settings.configureNodeList.noNodes')}</Text>
                    {/if}
                    {#if includeOfficialNodes}
                        {#each officialNodes as officialNode}
                            <div class="flex flex-row items-center justify-between h-12 p-3 dark:hover:bg-blue-400">
                                <div class="flex flex=row">
                                    <Text>{officialNode.url}</Text>
                                    <Text>
                                        {officialNode.url === primaryNodeUrl ? locale('view.settings.configureNodeList.primaryNode') : ''}
                                    </Text>
                                </div>
                                <button
                                    on:click={() => {
                                        nodeContextMenuIsOfficial = true
                                        nodeContextMenu = officialNode
                                    }}
                                    class="dark:text-white">...</button>
                            </div>
                        {/each}
                    {/if}
                    {#each customNodes as customNode}
                        <div class="flex flex-row">
                            <Text>{customNode.url}</Text>
                            <Text>
                                {customNode.url === primaryNodeUrl ? locale('view.settings.configureNodeList.primaryNode') : ''}
                            </Text>
                            <button
                                on:click={() => {
                                    nodeContextMenuIsOfficial = false
                                    nodeContextMenu = customNode
                                }}>...</button>
                        </div>
                    {/each}
                    {#if nodeContextMenu}
                        <div class="flex flex-col border border-solid dark:border-gray-700 rounded-2xl overflow-hidden">
                            <button
                                on:click={() => (nodeContextMenu.enabled = !nodeContextMenu.enabled)}>{locale(nodeContextMenu.enabled ? 'view.settings.configureNodeList.excludeNode' : 'view.settings.configureNodeList.includeNode')}</button>
                            {#if !nodeContextMenuIsOfficial}
                                <button
                                    on:click={() => handlePropertiesNodeClick(nodeContextMenu.url)}>{locale('view.settings.viewDetails')}</button>
                            {/if}
                            <button
                                on:click={() => (primaryNodeUrl = nodeContextMenu.url)}>{locale('view.settings.setAsPrimary')}</button>
                            {#if !nodeContextMenuIsOfficial}
                                <button
                                    on:click={() => handleRemoveNodeClick(nodeContextMenu.url)}>{locale('view.settings.removeNode')}</button>
                            {/if}
                        </div>
                    {/if}
                </div>
                <Button
                    medium
                    inlineStyle="min-width: 156px;"
                    classes="w-1/4 mt-4"
                    disabled={!$accounts.length}
                    onClick={() => handleAddNodeClick()}>
                    {locale('actions.addNode')}
                </Button>
            </section>
            <HR classes="pb-5 mt-5 justify-center" />
        {/if}
    {/if}
    <!-- TODO: Implement and enable -->
    <section id="developerMode" class="w-3/4 opacity-50">
        <Text type="h4" classes="mb-3">{locale('views.settings.developerMode.title')}</Text>
        <Text type="p" secondary classes="mb-5">{locale('views.settings.developerMode.description')}</Text>
        <Checkbox label={locale('actions.enableDeveloperMode')} disabled bind:checked={$appSettings.developerMode} />
    </section>
    <HR classes="pb-5 mt-5 justify-center" />
    <section id="deepLinks" class="w-3/4">
        <Text type="h4" classes="mb-3">{locale('views.settings.deepLinks.title')}</Text>
        <Text type="p" secondary classes="mb-5">{locale('views.settings.deepLinks.description')}</Text>
        <Checkbox label={locale('actions.enableDeepLinks')} bind:checked={deepLinkingChecked} />
    </section>
    {#if $loggedIn}
        <HR classes="pb-5 mt-5 justify-center" />
        <section id="resyncAccounts" class="w-3/4">
            <Text type="h4" classes="mb-3">{locale('views.settings.resyncAccounts.title')}</Text>
            <Text type="p" secondary classes="mb-5">{locale('views.settings.resyncAccounts.description')}</Text>
            <Button medium inlineStyle="min-width: 156px;" onClick={syncAccounts} disabled={$isSyncing}>
                {locale('actions.syncAll')}
            </Button>
        </section>
    {/if}
    <HR classes="pb-5 mt-5 justify-center" />
    <section id="errorLog" class="w-3/4">
        <Text type="h4" classes="mb-3">{locale('views.settings.errorLog.title')}</Text>
        <Text type="p" secondary classes="mb-5">{locale('views.settings.errorLog.description')}</Text>
        <Button medium inlineStyle="min-width: 156px;" onClick={() => handleErrorLogClick()}>
            {locale('views.settings.errorLog.title')}
        </Button>
    </section>
    <HR classes="pb-5 mt-5 justify-center" />
    <section id="diagnostics" class="w-3/4">
        <Text type="h4" classes="mb-3">{locale('views.settings.diagnostics.title')}</Text>
        <Text type="p" secondary classes="mb-5">{locale('views.settings.diagnostics.description')}</Text>
        <Button medium inlineStyle="min-width: 156px;" onClick={() => handleDiagnosticsClick()}>
            {locale('views.settings.diagnostics.title')}
        </Button>
    </section>
    {#if $loggedIn}
        <HR classes="pb-5 mt-5 justify-center" />
        <!-- TODO: Implement state export -->
        <section id="stateExport" class="w-3/4 opacity-50">
            <Text type="h4" classes="mb-3">{locale('views.settings.stateExport.title')}</Text>
            <Text type="p" secondary classes="mb-5">{locale('views.settings.stateExport.description')}</Text>
            <Button medium inlineStyle="min-width: 156px;" disabled onClick={() => {}}>{locale('actions.exportState')}</Button>
        </section>
    {/if}
</div>
