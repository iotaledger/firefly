<script lang="typescript">
    import { IClientOptions, INode } from '@core/network'
    import { Modal, NodeActionsMenu, MeatballMenuButton } from 'shared/components'

    export let node: INode
    export let clientOptions: IClientOptions

    let modal: Modal
</script>

<div>
    <MeatballMenuButton onClick={modal?.toggle} />
    <NodeActionsMenu bind:modal {node} {clientOptions} />
</div>
