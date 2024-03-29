<script lang="ts">
    import { Modal, SelectorInput, IOption } from 'shared/components'
    import { activeProfile, getNetworkHrp } from '@core/profile'
    import { validateBech32Address } from '@core/utils'
    import type { ChainMetadata } from '@core/network'

    export let iscpChainAddress: string | undefined = undefined
    export let showLayer2: boolean = false

    const layer1Network = {
        key: $activeProfile?.network.name,
        value: undefined,
    }

    let selectorInput: SelectorInput
    let inputElement: HTMLInputElement
    let modal: Modal
    let error: string

    $: networkOptions = getNetworkOptions(showLayer2)

    let selected: IOption = networkOptions?.find((option) => option.value === iscpChainAddress) ?? layer1Network

    $: iscpChainAddress = selected?.value

    export function reset(): void {
        selected = networkOptions[0]
        selectorInput?.resetValue(selected)
    }

    function getNetworkOptions(showLayer2: boolean): IOption[] {
        let layer2Networks: IOption[] = []
        if (showLayer2) {
            layer2Networks =
                $activeProfile.network?.chains?.map((chain) => ({
                    key: chain.name,
                    value: getNetworkValue(chain),
                })) ?? []
        }
        return [layer1Network, ...layer2Networks]
    }

    function getNetworkValue(chainMetadata: ChainMetadata): string | undefined {
        return chainMetadata?.aliasAddress ?? undefined
    }

    export function validate(): Promise<void> {
        try {
            if (iscpChainAddress !== undefined) {
                validateBech32Address(getNetworkHrp(), iscpChainAddress)
            }
            return Promise.resolve()
        } catch (err) {
            error = err?.message ?? err
            return Promise.reject(error)
        }
    }
</script>

<SelectorInput
    labelLocale="general.destinationNetwork"
    bind:this={selectorInput}
    bind:selected
    bind:inputElement
    bind:modal
    bind:error
    options={networkOptions}
    inputClasses="cursor-pointer"
    containerClasses="cursor-pointer"
/>
