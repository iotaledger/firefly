<script lang="ts">
    import { SelectorInput, IOption, Modal } from 'shared/components'
    import { localize } from '@core/i18n'
    import { activeProfile } from '@core/profile/stores'
    import { isValidUrl } from '@core/utils'

    export let disabled = false
    export let error: string
    export let nodeUrl: string

    let inputElement: HTMLInputElement
    let modal: Modal
    let nodeOptions: IOption[]
    let selected: IOption = { value: nodeUrl }

    $: clientOptionsNodes = $activeProfile?.clientOptions?.nodes
    $: clientOptionsNodes, (nodeOptions = getNodeOptionsFromClientOptions())
    $: nodeUrl = selected?.value

    export async function validate(): Promise<void> {
        try {
            if (!isValidUrl(selected?.value)) {
                throw new Error(localize('error.node.invalid'))
            }
            return Promise.resolve()
        } catch (err) {
            error = err?.message ?? err
            return Promise.reject(error)
        }
    }

    function getNodeOptionsFromClientOptions(): IOption[] {
        return clientOptionsNodes
            .filter((node) => !node.disabled)
            .map((node, index) => ({
                id: index,
                key: null,
                value: node.url,
            }))
    }
</script>

<SelectorInput
    labelLocale="views.governance.details.proposalInformation.nodeUrl"
    bind:selected
    bind:inputElement
    bind:modal
    bind:error
    {disabled}
    options={nodeOptions}
    {...$$restProps}
/>
