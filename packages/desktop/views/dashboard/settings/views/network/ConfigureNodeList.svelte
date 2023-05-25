<script lang="ts">
    import { closeOverlay, openOverlay, PopupId } from '@auxiliary/popup'
    import { localize } from '@core/i18n'
    import { addOfficialNodesToClientOptions as onAddOfficialNodesClick, NetworkType } from '@core/network'
    import { activeProfile } from '@core/profile'
    import { NetworkSettingsRoute } from '@core/router'
    import { Button, ButtonSize, NodeListTable } from 'shared/components'
    import SettingsSection from '../SettingsSection.svelte'

    let nodesContainer: HTMLElement

    const { networkType } = $activeProfile

    function onAddNodeClick(): void {
        openOverlay({
            id: PopupId.AddNode,
            props: {
                onSuccess: () => {
                    closeOverlay()
                    setTimeout(() => {
                        /**
                         * NOTE: This automatically scrolls the user to the bottom of the
                         * nodes container to see the newly added node.
                         */
                        nodesContainer.scrollTop = nodesContainer.scrollHeight
                    }, 100)
                },
            },
        })
    }
</script>

<SettingsSection setting={NetworkSettingsRoute.ConfigureNodeList}>
    <NodeListTable bind:nodesContainer />
    <div class="flex flex-row justify-between space-x-3 w-full mt-4">
        {#if networkType !== NetworkType.PrivateNet}
            <Button
                outline
                size={ButtonSize.Medium}
                inlineStyle="min-width: 156px;"
                classes="w-1/2"
                onClick={onAddOfficialNodesClick}
            >
                {localize('actions.addOfficialNodes')}
            </Button>
        {/if}
        <Button
            inlineStyle="min-width: 156px;"
            size={ButtonSize.Medium}
            classes={networkType === NetworkType.PrivateNet ? '' : 'w-1/2'}
            onClick={onAddNodeClick}
        >
            {localize('actions.addNode')}
        </Button>
    </div>
</SettingsSection>
