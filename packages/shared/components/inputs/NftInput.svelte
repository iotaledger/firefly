<script lang="typescript">
    import { Modal, SelectorInput } from 'shared/components'
    import { selectedAccountNfts } from '@core/nfts'

    export let nftId: string = ''
    export let error: string = ''

    let inputElement: HTMLInputElement = undefined
    let modal: Modal = undefined
    let selected

    const nftOptions = $selectedAccountNfts.map((_nft) => ({ key: _nft.name, value: _nft.id }))

    $: nftId = selected?.value

    export async function validate(): Promise<void> {
        if (!nftId) {
            error = 'Nft is required'
            return Promise.reject(error)
        } else if (!nftId.startsWith('0x')) {
            error = 'Nft has to be in HEX format'
            return Promise.reject(error)
        } else if (!isNftInPossession()) {
            error = 'Nft not in possession'
            return Promise.reject(error)
        } else {
            return Promise.resolve()
        }
    }

    function isNftInPossession(): boolean {
        return nftOptions.some((option) => option.value === nftId)
    }
</script>

<SelectorInput
    labelLocale="popups.sendNft.property.nft"
    bind:selected
    bind:inputElement
    bind:modal
    bind:error
    options={nftOptions}
/>
