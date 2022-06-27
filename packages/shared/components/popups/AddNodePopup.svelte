<script lang="typescript">
    import { Text, NodeConfigurationForm, Button, Spinner } from 'shared/components'
    import { localize } from '@core/i18n'
    import { INode, INetwork } from '@core/network'
    import { closePopup } from '@lib/popup'
    import { activeProfile, addNodeToActiveProfile } from '@core/profile'
    import { showAppNotification } from '@lib/notifications'

    export let node: INode = { url: '', auth: { username: '', password: '', jwt: '' } }
    export let nodes: INode[] = []
    export let network: INetwork
    export let isAddingNode: boolean = true
    export let onSuccess: (..._: any[]) => void

    let nodeConfigurationForm: NodeConfigurationForm
    let isBusy = false
    let formError = ''

    async function handleAddNode(): Promise<void> {
        formError = ''
        await nodeConfigurationForm.validate()
        if (!formError) {
            isBusy = true
            try {
                await addNodeToActiveProfile(node)
                onSuccess()
            } catch (err) {
                showAppNotification({
                    type: 'error',
                    message: localize(err?.error ?? 'error.global.generic'),
                })
            } finally {
                isBusy = false
            }
        }
    }
</script>

<div class="flex flex-col space-y-6">
    <Text type="h4">{localize(`popups.node.title${isAddingNode ? 'Add' : 'Update'}`)}</Text>
    <NodeConfigurationForm
        bind:this={nodeConfigurationForm}
        bind:isBusy
        bind:node
        {nodes}
        {network}
        isDeveloperProfile={$activeProfile.isDeveloperProfile}
    />
    <div class="flex flex-row justify-between space-x-4 w-full">
        <Button secondary classes="w-1/2" onClick={closePopup} disabled={isBusy}>
            {localize('actions.cancel')}
        </Button>
        <Button
            disabled={!node.url || isBusy}
            type="submit"
            form="node-config-form"
            classes="w-1/2"
            onClick={handleAddNode}
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
</div>
