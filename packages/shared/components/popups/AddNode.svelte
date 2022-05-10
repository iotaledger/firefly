<script lang="typescript">
    import { get } from 'svelte/store'
    import { Button, Checkbox, Input, Password, Spinner, Text } from 'shared/components'
    import SwitchNetwork from './SwitchNetwork.svelte'
    import { stripSpaces, stripTrailingSlash } from 'shared/lib/helpers'
    import { IAuth, INode, INodeInfo, INetwork } from '@core/network'
    import { getNetwork, checkNodeUrlValidity, cleanAuth, updateNetworkStatusFromNodeInfo } from '@core/network'
    import { showAppNotification } from 'shared/lib/notifications'
    import { closePopup } from 'shared/lib/popup'
    import { asyncGetNodeInfo, wallet } from 'shared/lib/wallet'
    import { activeProfile } from 'shared/lib/profile'
    import { localize } from '@core/i18n'

    export let node: INode = { url: '', isPrimary: false }
    export let nodes: INode[] = []
    export let network: INetwork
    export let isAddingNode = true

    export let onSuccess = (..._: any[]): void => {}

    const { accounts } = $wallet

    let nodeUrl = node?.url || ''
    const oldNodeUrl = nodeUrl
    const optNodeAuth = node?.auth || { username: '', password: '', jwt: '' }

    let addressError = ''
    let addressWarn = ''
    const authError = ''

    let isBusy = false
    let isSuccess = true
    let isNetworkSwitch = false
    let newNetwork: INetwork

    $: nodeUrl, (addressError = '')
    $: {
        addressWarn = ''
        node.url = stripSpaces(node.url)
        if (!$activeProfile?.isDeveloperProfile && /^http:\/\//.exec(node.url)) {
            addressWarn = localize('warning.node.http')
        }
    }

    const cleanNodeUrl = (_url: string): string => stripTrailingSlash(stripSpaces(_url))

    const constructNodes = (): INode[] =>
        node ? nodes.filter((n) => cleanNodeUrl(node.url) !== cleanNodeUrl(n.url)) : nodes

    const cleanNodeFormData = (): void => {
        const _nodes = constructNodes()
        const validErr = checkNodeUrlValidity(_nodes, cleanNodeUrl(nodeUrl), $activeProfile.isDeveloperProfile)
        if (validErr) {
            addressError = localize(validErr)
        }
    }

    const checkNetworkId = (id: string): void => {
        if (!id) {
            addressError = localize('error.network.notReachable')
        } else if (id !== network.id) {
            if ($activeProfile.isDeveloperProfile) {
                newNetwork = getNetwork($activeProfile?.networkProtocol, $activeProfile?.networkType, id)
                isNetworkSwitch = true
            } else {
                addressError = localize('error.network.mismatch', { values: { networkId: id } })
            }
        }
    }

    const handleAddNodeClick = async (): Promise<void> => {
        isBusy = true
        addressError = ''

        let nodeInfo: INodeInfo

        try {
            if (node) {
                cleanNodeFormData()

                if (!addressError) {
                    nodeInfo = await asyncGetNodeInfo($accounts[0].id, cleanNodeUrl(nodeUrl), cleanAuth(optNodeAuth))

                    checkNetworkId(nodeInfo?.nodeinfo?.networkId)
                }
            }
        } catch (err) {
            isBusy = false
            isSuccess = false

            showAppNotification({
                type: 'error',
                message: localize(err?.error),
            })

            return
        }

        if (!addressError) {
            if (!isNetworkSwitch) {
                // TODO refactor
                // await updateNetworkStatus(get($wallet.accounts)[0]?.id, {
                //     url: nodeUrl,
                //     auth: optNodeAuth,
                //     isPrimary: node?.isPrimary,
                // })
                //     .then(() => {
                //         isBusy = false
                //         onSuccess(
                //             false,
                //             {
                //                 url: cleanNodeUrl(nodeUrl),
                //                 auth: optNodeAuth,
                //                 network: getNetwork(
                //                     $activeProfile?.networkProtocol,
                //                     $activeProfile?.networkType,
                //                     nodeInfo?.nodeinfo.networkId
                //                 ),
                //                 isPrimary: node?.isPrimary || false,
                //             },
                //             oldNodeUrl
                //         )
                //         closePopup()
                //     })
                //     .catch((err) => {
                //         isBusy = false
                //         return
                //     })
            }
        }

        isBusy = false
    }
</script>

{#if isNetworkSwitch}
    <SwitchNetwork network={newNetwork} node={{ url: cleanNodeUrl(nodeUrl), auth: optNodeAuth, isPrimary: true }} />
{:else}
    <Text type="h4" classes="mb-6">{localize(`popups.node.title${isAddingNode ? 'Add' : 'Update'}`)}</Text>
    <form id="node-config-form" class="w-full h-full">
        <Input
            bind:value={nodeUrl}
            placeholder={localize('popups.node.nodeAddress')}
            error={addressError}
            disabled={isBusy}
            autofocus
        />
        {#if addressWarn}
            <Text overrideColor classes="text-orange-500 mt-2">{addressWarn}</Text>
        {/if}
        <Input
            classes="mt-3"
            bind:value={optNodeAuth.username}
            placeholder={localize('popups.node.optionalUsername')}
            error={authError}
            disabled={isBusy}
        />
        <Password
            classes="mt-3"
            bind:value={optNodeAuth.password}
            placeholder={localize('popups.node.optionalPassword')}
            disabled={isBusy}
        />
        <Password
            classes="mt-3"
            bind:value={optNodeAuth.jwt}
            placeholder={localize('popups.node.optionalJwt')}
            disabled={isBusy}
        />
        <Checkbox
            label={localize('popups.node.setAsPrimaryNode')}
            bind:checked={node.isPrimary}
            disabled={isBusy}
            classes="mt-4 mb-8"
        />
    </form>
    <div class="flex flex-row justify-between space-x-4 w-full md:px-8 ">
        <Button secondary classes="w-1/2" onClick={() => closePopup()} disabled={isBusy}>
            {localize('actions.cancel')}
        </Button>
        <Button
            disabled={!nodeUrl || isBusy}
            type="submit"
            form="node-config-form"
            classes="w-1/2"
            onClick={handleAddNodeClick}
        >
            {#if isBusy}
                <Spinner
                    busy={isBusy}
                    message={localize(`popups.node.${isAddingNode ? 'addingNode' : 'updatingNode'}`)}
                    classes="justify-center"
                />
            {:else}
                {localize(`actions.${isAddingNode ? 'addNode' : 'updateNode'}`)}
            {/if}
        </Button>
    </div>
{/if}
