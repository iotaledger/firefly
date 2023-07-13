<script lang="ts">
    import { EMPTY_NODE, IClientOptions, INode } from '@core/network'
    import { Modal, NodeActionsMenu, MeatballMenuButton } from 'shared/components'

    export let node: INode = EMPTY_NODE
    export let clientOptions: IClientOptions

    let modal: Modal
</script>

<div>
    <MeatballMenuButton onClick={modal?.toggle} />
    <NodeActionsMenu bind:modal {node} {clientOptions} />
</div>
