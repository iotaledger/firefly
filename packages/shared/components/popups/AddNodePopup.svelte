<script lang="typescript">
    import { Text, NodeConfigurationForm, Button, HTMLButtonType } from 'shared/components'
    import { localize } from '@core/i18n'
    import { INode, addNodeToClientOptions, editNodeInClientOptions } from '@core/network'
    import { closePopup } from '@auxiliary/popup'
    import { activeProfile } from '@core/profile'
    import { showAppNotification } from '@lib/notifications'

    export let node: INode = { url: '', auth: { username: '', password: '', jwt: '' } }
    export let isEditingNode: boolean = false
    export let onSuccess: (..._: any[]) => void

    const currentNode = node

    let nodeConfigurationForm: NodeConfigurationForm
    let isBusy = false

    async function handleAddNode(): Promise<void> {
        try {
            isBusy = true
            await nodeConfigurationForm.validate({
                validateUrl: true,
                checkSameNetwork: true,
                uniqueCheck: !isEditingNode,
                checkNodeInfo: true,
                validateClientOptions: true,
            })
            if (isEditingNode) {
                await editNodeInClientOptions(currentNode, node)
            } else {
                await addNodeToClientOptions(node)
            }
            onSuccess()
        } catch (err) {
            if (err.type !== 'validationError') {
                showAppNotification({
                    type: 'error',
                    message: localize(err?.error ?? 'error.global.generic'),
                })
            }
        } finally {
            isBusy = false
        }
    }
</script>

<div class="flex flex-col space-y-6">
    <Text type="h4">{localize(`popups.node.title${isEditingNode ? 'Update' : 'Add'}`)}</Text>
    <NodeConfigurationForm
        bind:this={nodeConfigurationForm}
        bind:node
        {isBusy}
        isDeveloperProfile={$activeProfile.isDeveloperProfile}
    />
    <div class="flex flex-row justify-between space-x-4 w-full">
        <Button outline classes="w-1/2" onClick={closePopup} disabled={isBusy}>
            {localize('actions.cancel')}
        </Button>
        <Button
            disabled={!node.url || isBusy}
            type={HTMLButtonType.Submit}
            form="node-configuration-form"
            classes="w-1/2"
            onClick={handleAddNode}
            {isBusy}
            busyMessage={localize(`popups.node.${isEditingNode ? 'updatingNode' : 'addingNode'}`)}
        >
            {localize(`actions.${isEditingNode ? 'updateNode' : 'addNode'}`)}
        </Button>
    </div>
</div>
