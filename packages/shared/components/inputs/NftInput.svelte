<script lang="typescript">
    import { Modal, SelectorInput } from 'shared/components'
    import { selectedAccountNfts } from '@core/nfts'

    export let nftId: string = ''
    export let error: string = ''

    let inputElement: HTMLInputElement = undefined
    let modal: Modal = undefined

    const nftOptions = $selectedAccountNfts.map((_nft) => ({ key: _nft.name, value: _nft.id }))

    export async function validate(): Promise<void> {
        if (!nftId) {
            error = 'Nft is required'
            return Promise.reject(error)
        } else if (!isValidNft()) {
            error = 'Nft is not in possession'
            return Promise.reject(error)
        } else {
            return Promise.resolve()
        }
    }

    function isValidNft(): boolean {
        return nftOptions.some((option) => option.value === nftId)
    }
</script>

<SelectorInput
    labelLocale="popups.sendNft.property.nft"
    bind:value={nftId}
    bind:inputElement
    bind:modal
    bind:error
    options={nftOptions}
    let:option
/>
