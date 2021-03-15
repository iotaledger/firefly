<script lang="typescript">
    import type { ClientOptions } from 'lib/typings/client'
    import { Button, Checkbox, Dropdown, Radio, Text } from 'shared/components'
    import { loggedIn } from 'shared/lib/app'
    import { appSettings } from 'shared/lib/appSettings'
    import { DEFAULT_NODE, DEFAULT_NODES } from 'shared/lib/network'
    import { showAppNotification } from 'shared/lib/notifications'
    import { openPopup } from 'shared/lib/popup'
    import { activeProfile, updateProfile } from 'shared/lib/profile'
    import type { Node } from 'shared/lib/typings/client'
    import { api, isSyncing, syncAccounts, wallet, WalletAccount } from 'shared/lib/wallet'
    import { get } from 'svelte/store'

    export let locale

    const { accounts } = $wallet

    let outsourcePowChecked = get(activeProfile)?.settings.outsourcePow
    let deepLinkingChecked = $appSettings.deepLinking
    let automaticNodeSelection = get(activeProfile)?.settings.automaticNodeSelection

    $: updateProfile('settings.outsourcePow', outsourcePowChecked)
    $: $appSettings.deepLinking = deepLinkingChecked
    $: updateProfile('settings.automaticNodeSelection', automaticNodeSelection)

    $: if (automaticNodeSelection) {
        if ($accounts.some((account) => !account.clientOptions.nodes.length)) {
            const _nodes = [...$activeProfile?.settings.customNodes, ...DEFAULT_NODES]
            api.setClientOptions(
                {
                    ...$accounts[0].clientOptions,
                    nodes: _nodes,
                    node: DEFAULT_NODE,
                },
                {
                    onSuccess() {
                        updateProfile('settings.node', DEFAULT_NODE)
                        accounts.update((_accounts) =>
                            _accounts.map((_account) =>
                                Object.assign<WalletAccount, WalletAccount, Partial<WalletAccount>>(
                                    {} as WalletAccount,
                                    _account,
                                    {
                                        clientOptions: Object.assign<ClientOptions, ClientOptions, ClientOptions>(
                                            {} as ClientOptions,
                                            _account.clientOptions,
                                            {
                                                nodes: _nodes,
                                                node: DEFAULT_NODE,
                                            }
                                        ),
                                    }
                                )
                            )
                        )
                    },
                    onError(error) {
                        console.error(error)
                    },
                }
            )
        }
    } else {
        if ($accounts.some((account) => account.clientOptions.nodes.length)) {
            api.setClientOptions(
                {
                    ...$accounts[0].clientOptions,
                    nodes: [],
                    node: DEFAULT_NODE,
                },
                {
                    onSuccess() {
                        updateProfile('settings.node', DEFAULT_NODE)

                        accounts.update((_accounts) =>
                            _accounts.map((_account) =>
                                Object.assign<WalletAccount, WalletAccount, Partial<WalletAccount>>(
                                    {} as WalletAccount,
                                    _account,
                                    {
                                        clientOptions: Object.assign<ClientOptions, ClientOptions, ClientOptions>(
                                            {} as ClientOptions,
                                            _account.clientOptions,
                                            {
                                                nodes: [],
                                                node: DEFAULT_NODE,
                                            }
                                        ),
                                    }
                                )
                            )
                        )
                    },
                    onError(error) {
                        console.error(error)
                    },
                }
            )
        }
    }

    function selectNode(option) {
        const selectedNode = [...DEFAULT_NODES, ...$activeProfile?.settings.customNodes].find(
            (node: Node) => node.url === option.value
        )

        if (selectedNode.url !== $activeProfile?.settings.node?.url) {
            updateProfile('settings.node', selectedNode)

            api.setClientOptions(
                {
                    node: selectedNode,
                    nodes: [],
                },
                {
                    onSuccess(response) {
                        // Update client options for accounts
                        accounts.update((_accounts) =>
                            _accounts.map((_account) =>
                                Object.assign<WalletAccount, WalletAccount, Partial<WalletAccount>>(
                                    {} as WalletAccount,
                                    _account,
                                    {
                                        clientOptions: Object.assign<ClientOptions, ClientOptions, ClientOptions>(
                                            {} as ClientOptions,
                                            _account.clientOptions,
                                            {
                                                nodes: [],
                                                node: selectedNode,
                                            }
                                        ),
                                    }
                                )
                            )
                        )
                    },
                    onError(err) {
                        showAppNotification({
                            type: 'error',
                            message: locale(err.error),
                        })
                    },
                }
            )
        }
    }

    function handleAddNodeClick() {
        openPopup({ type: 'addNode' })
    }

    function handleRemoveNodeClick() {
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
        <hr class="border-t border-gray-100 w-full border-solid pb-5 mt-5 justify-center" />

        {#if !automaticNodeSelection}
            <section id="configureNodeList" class="w-3/4">
                <Text type="h4" classes="mb-3">{locale('views.settings.configureNodeList.title')}</Text>
                <Text type="p" secondary classes="mb-5">{locale('views.settings.configureNodeList.description')}</Text>
                <!-- Nodes list -->
                <Text type="h4" classes="mb-3">{locale('general.nodes')}</Text>
                <Dropdown
                    onSelect={selectNode}
                    value={$activeProfile?.settings.node?.url}
                    items={[...DEFAULT_NODES, ...$activeProfile?.settings.customNodes].map((node) => ({
                        value: node.url,
                        label: node.url,
                    }))} />

                <!-- As client options (nodes) have association with accounts, disable "Add node" button if there are no accounts in wallet -->
                <Button classes="w-1/4 mt-4" disabled={!$accounts.length} onClick={() => handleAddNodeClick()}>
                    {locale('actions.add_node')}
                </Button>
                <Button
                    classes="w-1/2 mt-4"
                    onClick={() => handleRemoveNodeClick()}
                    disabled={!$activeProfile?.settings.customNodes.find((n) => n.url === $activeProfile?.settings.node?.url)}>
                    {locale('actions.remove_node')}
                </Button>
            </section>
            <hr class="border-t border-gray-100 w-full border-solid pb-5 mt-5 justify-center" />
        {/if}

        <section id="proofOfWork" class="w-3/4 opacity-50">
            <Text type="h4" classes="mb-3">{locale('views.settings.proofOfWork.title')}</Text>
            <Text type="p" secondary classes="mb-5">{locale('views.settings.proofOfWork.description')}</Text>
            <Checkbox label={locale('actions.outsourceProofOfWork')} disabled bind:checked={outsourcePowChecked} />
        </section>
        <hr class="border-t border-gray-100 w-full border-solid pb-5 mt-5 justify-center" />
    {/if}
    <!-- TODO: Implement and enable -->
    <section id="developerMode" class="w-3/4 opacity-50">
        <Text type="h4" classes="mb-3">{locale('views.settings.developerMode.title')}</Text>
        <Text type="p" secondary classes="mb-5">{locale('views.settings.developerMode.description')}</Text>
        <Checkbox label={locale('actions.enableDeveloperMode')} disabled bind:checked={$appSettings.developerMode} />
    </section>
    <hr class="border-t border-gray-100 w-full border-solid pb-5 mt-5 justify-center" />
    <section id="deepLinks" class="w-3/4">
        <Text type="h4" classes="mb-3">{locale('views.settings.deepLinks.title')}</Text>
        <Text type="p" secondary classes="mb-5">{locale('views.settings.deepLinks.description')}</Text>
        <Checkbox label={locale('actions.enableDeepLinks')} bind:checked={deepLinkingChecked} />
    </section>
    {#if $loggedIn}
        <hr class="border-t border-gray-100 w-full border-solid pb-5 mt-5 justify-center" />
        <section id="resyncAccounts" class="w-3/4">
            <Text type="h4" classes="mb-3">{locale('views.settings.resyncAccounts.title')}</Text>
            <Text type="p" secondary classes="mb-5">{locale('views.settings.resyncAccounts.description')}</Text>
            <Button classes="w-1/4" onClick={syncAccounts} disabled={$isSyncing}>{locale('actions.syncAll')}</Button>
        </section>
    {/if}
    <hr class="border-t border-gray-100 w-full border-solid pb-5 mt-5 justify-center" />
    <section id="errorLog" class="w-3/4">
        <Text type="h4" classes="mb-3">{locale('views.settings.errorLog.title')}</Text>
        <Text type="p" secondary classes="mb-5">{locale('views.settings.errorLog.description')}</Text>
        <Button classes="w-1/4" onClick={() => handleErrorLogClick()}>{locale('views.settings.errorLog.title')}</Button>
    </section>
    <hr class="border-t border-gray-100 w-full border-solid pb-5 mt-5 justify-center" />
    <section id="diagnostics" class="w-3/4">
        <Text type="h4" classes="mb-3">{locale('views.settings.diagnostics.title')}</Text>
        <Text type="p" secondary classes="mb-5">{locale('views.settings.diagnostics.description')}</Text>
        <Button classes="w-1/4" onClick={() => handleDiagnosticsClick()}>{locale('views.settings.diagnostics.title')}</Button>
    </section>
    <hr class="border-t border-gray-100 w-full border-solid pb-5 mt-5 justify-center" />
    {#if $loggedIn}
        <!-- TODO: Implement state export -->
        <section id="stateExport" class="w-3/4 opacity-50">
            <Text type="h4" classes="mb-3">{locale('views.settings.stateExport.title')}</Text>
            <Text type="p" secondary classes="mb-5">{locale('views.settings.stateExport.description')}</Text>
            <Button classes="w-1/4" disabled onClick={() => {}}>{locale('actions.exportState')}</Button>
        </section>
    {/if}
</div>
