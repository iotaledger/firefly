<script>
    import { get } from 'svelte/store'
    import { activeProfile, updateProfile } from 'shared/lib/profile'
    import { developerMode } from 'shared/lib/app'
    import { Dropdown, Text, Radio, Checkbox, Button } from 'shared/components'
    import { DEFAULT_NODES as nodes, DEFAULT_NODE as node } from 'shared/lib/network'
    import { api, updateAccounts, wallet } from 'shared/lib/wallet'
    import { openPopup, closePopup } from 'shared/lib/popup'

    export let locale

    const { accounts } = $wallet

    let outsourcePowChecked = get(activeProfile).settings.outsourcePow
    let deepLinkingChecked = get(activeProfile).settings.deepLinking
    let automaticNodeSelection = get(activeProfile).settings.automaticNodeSelection

    $: updateProfile('settings.outsourcePow', outsourcePowChecked)
    $: updateProfile('settings.deepLinking', deepLinkingChecked)
    $: updateProfile('settings.automaticNodeSelection', automaticNodeSelection)

    $: if (automaticNodeSelection) {
        if ($accounts.some((account) => !account.clientOptions.nodes.length)) {
            const _nodes = [...$activeProfile.settings.customNodes, ...nodes].map((node) => node.url)
            api.setClientOptions(
                {
                    ...$accounts[0].clientOptions,
                    nodes: _nodes,
                    node: node.url,
                },
                {
                    onSuccess() {
                        updateProfile('settings.node', { url: node.url, password: '', username: '' })
                        accounts.update((_accounts) =>
                            _accounts.map((_account) =>
                                Object.assign({}, _account, {
                                    clientOptions: Object.assign({}, _account.clientOptions, { node: node.url, nodes: _nodes }),
                                })
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
                    node: node.url,
                },
                {
                    onSuccess() {
                        updateProfile('settings.node', { url: node.url, password: '', username: '' })

                        accounts.update((_accounts) =>
                            _accounts.map((_account) =>
                                Object.assign({}, _account, {
                                    clientOptions: Object.assign({}, _account.clientOptions, { node: node.url, nodes: [] }),
                                })
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
        const node = option.value

        if (node !== $activeProfile.settings.node.url) {
            api.setClientOptions(
                {
                    node,
                    nodes: [],
                },
                {
                    onSuccess(response) {
                        // Update profile in local storage
                        updateProfile('settings.node', { url: node, password: '', username: '' })

                        // Update client options for accounts
                        accounts.update((_accounts) =>
                            _accounts.map((_account) =>
                                Object.assign({}, _account, {
                                    clientOptions: Object.assign({}, _account.clientOptions, { node, nodes: [] }),
                                })
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

    function handleAddNodeClick() {
        openPopup({ type: 'addNode' })
    }

    function resyncAccounts() {
        const _sync = () => {
            api.syncAccounts({
                onSuccess(syncAccountsResponse) {
                    const syncedAccounts = syncAccountsResponse.payload

                    updateAccounts(syncedAccounts)
                },
                onError(error) {
                    console.error(error)
                },
            })
        }

        if ($activeProfile.isStrongholdLocked) {
            openPopup({ type: 'password', props: { onSuccess: _sync } })
        } else {
            _sync();
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
                onSelect={selectNode}
                value={$activeProfile.settings.node.url}
                items={[...nodes, ...$activeProfile.settings.customNodes].map((node) => ({
                    value: node.url,
                    label: node.url,
                }))} />
            <Button classes="w-1/4 mt-4" onClick={() => handleAddNodeClick()}>{locale('actions.add_node')}</Button>
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
        <Checkbox label={locale('actions.enableDeveloperMode')} bind:checked={$developerMode} />
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
        <Button classes="w-1/4" onClick={resyncAccounts}>{locale('actions.syncAll')}</Button>
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
