<script lang="typescript">
    import { Text } from 'shared/components'
    import SwitchNetwork from './SwitchNetwork.svelte'
    import { stripSpaces, stripTrailingSlash } from 'shared/lib/helpers'
    import { INode, INetwork, IAuth } from '@core/network'
    import { localize } from '@core/i18n'
    import { NodeConfigurationForm } from 'shared/components/molecules'

    export let node: INode = { url: '' }
    export let nodes: INode[] = []
    export let network: INetwork
    export let isAddingNode: boolean = true
    export let onSuccess = (..._: any[]): void => {}

    const nodeUrl: string = node?.url || ''
    const optNodeAuth: IAuth = node?.auth || { username: '', password: '', jwt: '' }

    const isNetworkSwitch = false
    let newNetwork: INetwork

    $: {
        node.url = stripSpaces(node.url)
    }

    const cleanNodeUrl = (_url: string): string => stripTrailingSlash(stripSpaces(_url))
</script>

{#if isNetworkSwitch}
    <SwitchNetwork network={newNetwork} node={{ url: cleanNodeUrl(nodeUrl), auth: optNodeAuth }} />
{:else}
    <Text type="h4" classes="mb-6">{localize(`popups.node.title${isAddingNode ? 'Add' : 'Update'}`)}</Text>
    <NodeConfigurationForm {node} {nodes} {network} {onSuccess} />
{/if}
