<script lang="typescript">
    import { Button, Checkbox, Icon, Input, Password, Text } from 'shared/components'
    import { stripSpaces, stripTrailingSlash } from 'shared/lib/helpers'
    import {
        cleanNodeAuth, getNetworkById, isNodeAuthValid,
        isNodeUrlValid,
    } from 'shared/lib/network'
    import { showAppNotification } from 'shared/lib/notifications'
    import { closePopup } from 'shared/lib/popup'
    import { asyncGetNodeInfo, wallet } from 'shared/lib/wallet'
    import { Locale } from 'shared/lib/typings/i18n'
    import { Node, NodeAuth, NodeInfo } from 'shared/lib/typings/node'
    import { Network } from 'shared/lib/typings/network'
    import { activeProfile } from 'shared/lib/profile'

    export let locale: Locale

    export let node: Node = { url: '' }
    export let nodes: Node[] = []
    export let network: Network

    export let onSuccess = (..._: any[]): void => {}

    const { accounts } = $wallet

    let nodeUrl: string = node?.url || ''
    let optNodeAuth: NodeAuth = node?.auth || { username: '', password: '', jwt: '', }

    let addressError = ''
    let addressWarn = ''
    let authError = ''

    let isBusy = false
    let isSuccess = true
    let isNetworkSwitch = false
    let newNetwork: Network

    $: nodeUrl, (addressError = '')
    $: {
        addressWarn = ''
        node.url = stripSpaces(node.url)
        if (!$activeProfile.isDeveloperProfile && /^http:\/\//.exec(node.url)) {
            addressWarn = locale('warning.node.http')
        }
    }

    const cleanNodeUrl = (_url: string): string => stripTrailingSlash(stripSpaces(_url))

    const constructNodes = (): Node[] => node ? nodes.filter((n) => cleanNodeUrl(node.url) !== cleanNodeUrl(n.url)) : nodes

    const cleanNodeFormData = (): void => {
        nodeUrl = cleanNodeUrl(nodeUrl)
        optNodeAuth = cleanNodeAuth(optNodeAuth)

        let _nodes = constructNodes()
        const validErr = isNodeUrlValid(_nodes, nodeUrl, $activeProfile.isDeveloperProfile)
        if (validErr) {
            addressError = locale(validErr)
        }
    }

    const checkNetworkId = (id: string): void => {
        if (!id) {
            addressError = locale('error.network.notReachable')
        } else if (id !== network.id) {
            if($activeProfile.isDeveloperProfile) {
                isNetworkSwitch = true
                newNetwork = getNetworkById(id)
            } else {
                addressError = locale('error.network.mismatch', { values: { networkId: id } })
            }
        }
    }

    const handleAddNodeClick = async (): Promise<void> => {
        isBusy = true
        addressError = ''

        let nodeInfo: NodeInfo

        try {
            if (node) {
                cleanNodeFormData()

                nodeInfo = await asyncGetNodeInfo($accounts[0].id, nodeUrl, optNodeAuth)

                checkNetworkId(nodeInfo?.nodeinfo?.networkId)
            }
        } catch (err) {
            isSuccess = false

            showAppNotification({
                type: 'error',
                message: locale(err?.error),
            })
        } finally {
            isBusy = false

            if (!addressError) {
                if (isNetworkSwitch) return

                onSuccess(
                    false,
                    {
                        url: nodeUrl,
                        auth: optNodeAuth,
                        network: getNetworkById(nodeInfo.nodeinfo.networkId),
                        isPrimary: node?.isPrimary || false
                    }
                )
                closePopup()
            }
        }
    }

    const handleCancelNetworkSwitchClick = (): void => {
        isNetworkSwitch = false
    }

    const handleConfirmNetworkSwitchClick = (): void => {
        console.log('TODO: Handle switching networks')
        closePopup()
    }
</script>

{#if isNetworkSwitch}
    <Text type="h4" classes="mb-5">Switch networks</Text>
    <div class="w-full h-full mb-5">
        <div class="mb-12">
            <Text type="p" secondary>
                You are changing networks to: <Text highlighted classes="inline">{newNetwork.name}</Text>
            </Text>
        </div>
        <div class="flex flex-row justify-between">
            <div class="relative flex flex-col items-center bg-red-100 dark:bg-red-900 rounded-2xl mb-6 p-3">
                <div class="bg-red-500 rounded-2xl absolute -top-6 w-12 h-12 flex items-center justify-center">
                    <Icon icon="warning" classes="text-white" />
                </div>
                <Text type="p" classes="text-gray dark:text-white ml-2 mt-4 mb-2">
                    Changing networks resets all accounts, balances, and transaction history of this profile.
                    Please click "Confirm" to proceed and switch networks.
                </Text>
            </div>
        </div>
    </div>
    <div class="flex flex-row justify-between space-x-4 w-full px-8">
        <Button secondary classes="w-1/2" onClick={handleCancelNetworkSwitchClick} disabled={isBusy}>
            {locale('actions.cancel')}
        </Button>
        <Button warning disabled={!nodeUrl || isBusy} classes="w-1/2" onClick={handleConfirmNetworkSwitchClick}>
            {locale('actions.confirm')}
        </Button>
    </div>
{:else}
    <Text type="h4" classes="mb-5">{locale(`popups.node.title${node ? 'Update' : 'Add'}`)}</Text>
    <div class="w-full h-full">
        <Input bind:value={nodeUrl} placeholder={locale('popups.node.nodeAddress')} error={addressError} disabled={isBusy} autofocus />
        {#if addressWarn}
            <Text overrideColor classes="text-orange-500 mt-2">{addressWarn}</Text>
        {/if}
        <Input
            classes="mt-3"
            bind:value={optNodeAuth.username}
            placeholder={locale('popups.node.optionalUsername')}
            error={authError}
            disabled={isBusy} />
        <Password classes="mt-3" bind:value={optNodeAuth.password} placeholder={locale('popups.node.optionalPassword')} disabled={isBusy} />
        <Password classes="mt-3" bind:value={optNodeAuth.jwt} placeholder={locale('popups.node.optionalJwt')} disabled={isBusy} />
        <Checkbox label={locale('popups.node.setAsPrimaryNode')} bind:checked={node.isPrimary} disabled={isBusy} classes="mt-4 mb-8" />
    </div>
    <div class="flex flex-row justify-between space-x-4 w-full px-8 ">
        <Button secondary classes="w-1/2" onClick={() => closePopup()} disabled={isBusy}>
            {locale('actions.cancel')}
        </Button>
        <Button disabled={!nodeUrl|| isBusy} classes="w-1/2" onClick={handleAddNodeClick}>
            {locale(`actions.${node ? 'updateNode' : 'addNode'}`)}
        </Button>
    </div>
{/if}
